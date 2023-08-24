// import Document from "../schema/dbSchema";
const Document = require('../schema/dbSchema.js');
// const express = require("express");
// const authMiddleware = require("../middlewares/authMiddleware.js");

// const router = express.Router();

// router.use(authMiddleware)

const getDocument = async (id) => {
    if(!id) return;

    const document = await Document.findById(id);

    if(document) {
        return document.data;
    }
    return null;
}

const updateDocument = async (id, data) => {
    return Document.findByIdAndUpdate(id, {data: data.ops});
}


module.exports = {getDocument, updateDocument};