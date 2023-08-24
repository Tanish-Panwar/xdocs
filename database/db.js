const mongoose = require("mongoose");

const Connection = async (mongoUri) => {    
    // Connect to MongoDB
    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
    }).then(()=> {
        console.log("Connected to mongo")
    }).catch((err)=> {
        console.log("Could not connet to mongoDB");
    })
}

module.exports = Connection;
