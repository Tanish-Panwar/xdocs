const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const User = require('../schema/User');
const Feedback = require('../schema/Feedback');
const Document = require('../schema/dbSchema');

const router = express.Router();

router.use(authMiddleware)




// 😄 ROUTE 1: Create a document
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const user = req.user; // Authenticated user
    const document = new Document({ title: "Untitled Document", owner: user._id });
    await document.save();

    user.documents.push(document._id);
    await user.save();

    res.status(201).json({ message: 'Document created successfully', doc_id: document._id });

  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});





const GB_IN_BYTES = 1024 * 1024 * 1024; // 1 GB in bytes
// 😄 CHECK STORAGE ROUTE.
router.get('/storage/:user_id', async (req, res) => {
  try {
    // const user_id = req.body.user_id; // Assuming you're passing user_id in the request body
    const user_id = req.params.user_id

    const documents = await Document.find({ owner: user_id });

    let totalStorageBytes = 0;

    for (const document of documents) {
      const jsonString = JSON.stringify(document);
      const documentSizeBytes = Buffer.byteLength(jsonString, 'utf8');
      totalStorageBytes += documentSizeBytes;
    }

    const totalStorageGB = totalStorageBytes / GB_IN_BYTES;
    const formattedTotalStorageGB = totalStorageGB.toFixed(9); // Format to 9 decimal places

    const usedStorageInfo = `${formattedTotalStorageGB} GB used of 1.00 GB`;

    const isStorageExceeded = totalStorageGB > 1; // Compare with 1 GB

    res.json({ formattedTotalStorageGB, isStorageExceeded });
  } catch (error) {
    console.error('Error calculating storage:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;











// 😄 ROUTE 2: FETCH CURRENT USER's DOCUMENTS>
// Fetch documents created by the current user
router.get('/user-documents', async (req, res) => {
  try {
    const userId = req.user._id; // Get the user ID from the authenticated user
    const userDocuments = await Document.find({ owner: userId });

    res.status(200).json(userDocuments);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});





// 😄 ROUTE 3: FETCH CURRENT DOCUMENTS>
// Fetch documents created by the current user
router.get('/user-documents/:document_id', async (req, res) => {
  try {
    const document_id = req.params.document_id;
    const currentDocument = await Document.findById(document_id);

    res.status(200).json(currentDocument);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});






// 😄 ROUTE 4: UPDATE PERMISSIONS OF CURRENT USER's Current Document.
router.put('/user-document/update-permission/:document_id', async (req, res) => {
  try {
    const document_id = req.params.document_id;
    const { permission } = req.body;
    const currentDocument = await Document.findByIdAndUpdate(document_id, { permissions: permission });

    res.status(200).json(currentDocument);
  }
  catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
})



// 😄 ROUTE 5: UPDATE NAME OF CURRENT USER's Current Document.
router.put('/user-document/update-name/:document_id', async (req, res) => {
  try {
    const document_id = req.params.document_id;
    const { name } = req.body;
    const currentDocument = await Document.findByIdAndUpdate(document_id, { title: name });

    res.status(200).json(currentDocument);
  }
  catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
})



// 😄 ROUTE 6: DELETE Current Document.
router.delete('/user-document/delete-document/:document_id', async (req, res) => {
  try {
    const user = req.user;
    const document_id = req.params.document_id;

    // Remove the document from the user's documents array
    user.documents = user.documents.filter(docId => docId.toString() !== document_id);
    await user.save();

    // Delete the document from the database
    const deletedDocument = await Document.findByIdAndDelete(document_id);

    if (!deletedDocument) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.status(200).json({ msg: 'Document deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});






// 😄 ROUTE 7: Add accessUser to usersWithSpecialAccess Array, with {user: userid, permission: permission}
// Route to give access permission to a user for the document
router.put('/user-document/give-permission/:document_id', async (req, res) => {
  try {
    const document_id = req.params.document_id;
    const { userEmail, permission } = req.body;

    // Find the user by email to retrieve the user ID
    const userToGrantPermission = await User.findOne({ email: userEmail });

    if (!userToGrantPermission) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find the document and check if the user already has special access
    const documentToUpdate = await Document.findById(document_id);

    if (!documentToUpdate) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Check if the user already exists in the usersWithSpecialAccess array
    const existingUserAccess = documentToUpdate.usersWithSpecialAccess.find(
      access => access.user.toString() === userToGrantPermission._id.toString()
    );

    if (existingUserAccess) {
      // If user already exists, update their permission
      existingUserAccess.permission = permission;
    } else {
      // If user doesn't exist, add them to the usersWithSpecialAccess array
      documentToUpdate.usersWithSpecialAccess.push({
        user: userToGrantPermission._id, // User's ID
        permission: permission,
        email: userEmail
      });
    }

    // Save the updated document
    const updatedDocument = await documentToUpdate.save();

    res.status(200).json(updatedDocument);
  } catch (err) {
    console.error('Error giving permission:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});






// 😄 ROUTE 8: Remove Special Access for a particular user:
// Route to remove access for a user from the document
router.put('/user-document/remove-permission/:document_id', async (req, res) => {
  try {

    const document_id = req.params.document_id;
    const { userEmail } = req.body;

    // Find the user by email to retrieve the user ID
    const userToGrantPermission = await User.findOne({ email: userEmail });

    if (!userToGrantPermission) {
      return res.status(404).json({ error: 'User not found' });
    }


    // Find the document and remove the user from the usersWithSpecialAccess array
    const updatedDocument = await Document.findByIdAndUpdate(
      document_id,
      { $pull: { usersWithSpecialAccess: { user: userToGrantPermission._id } } },
      { new: true }
    );

    if (!updatedDocument) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.status(200).json(updatedDocument);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});






// FEEDBACK ROUTE: 
router.post('/send-feedback', async (req, res) => {
  try {
    const { title, description, user_id } = req.body;
    const feeds = Feedback.find({ user_id: user_id });
    if ((await feeds).length > 10) {
      res.status(500).json({ error: "We think you are spamming, so for now we have removed feedback access." });
    }
    const feed = new Feedback({ title: title, description: description, user: user_id });

    const sendFeed = await feed.save();
    res.status(200).json(sendFeed);

  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router;
