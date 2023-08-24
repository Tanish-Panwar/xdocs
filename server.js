const cors = require("cors");
const express = require("express");
const app = express();
const http = require("http");

const Server = require('socket.io').Server;
const Connection = require('./database/db.js');
const { getDocument, updateDocument } = require("./controller/document-controller.js");


const MONGO_URL = process.env.MONGO_URL || "mongodb+srv://factknowledgeonly:1yK3MXiF4ONj8SRm@xdocs.bvpwuz0.mongodb.net/?retryWrites=true&w=majority";
const PORT = process.env.PORT || 9000

Connection(MONGO_URL);





// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/document', require('./routes/documentRoutes'));


if(process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))
}

const httpServer = http.createServer(app);
httpServer.listen(PORT, ()=> {
  console.log(`Backend up and running on PORT ${PORT}`)
});


// Start the server

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});








const activeUsers = {};

io.on("connection", socket => {
  socket.on("get-document", async documentId => {

    const document = await getDocument(documentId);

    socket.join(documentId);
    socket.emit("load-document", document);

    // Add the connected user to the activeUsers object if not already added
    if (!activeUsers[documentId]) {
      activeUsers[documentId] = [];
    }

    const existingUser = activeUsers[documentId].find(user => user.socketId === socket.id);
    if (!existingUser) {
      activeUsers[documentId].push({ socketId: socket.id, username: "username" }); // Replace with actual username
    }

    // Emit the list of active users to all clients in the document
    io.to(documentId).emit("active-users", activeUsers[documentId]);

    socket.on("send-changes", delta => {
      socket.broadcast.to(documentId).emit("recieve-changes", delta);
    });

    socket.on("save-changes", async data => {
      await updateDocument(documentId, data);
    });

    socket.on("disconnect", () => {
      // Remove the disconnected user from activeUsers
      if (activeUsers[documentId]) {
        activeUsers[documentId] = activeUsers[documentId].filter(user => user.socketId !== socket.id);
        // Emit the updated list of active users to all clients in the document
        io.to(documentId).emit("active-users", activeUsers[documentId]);
      }
    });

  });
});