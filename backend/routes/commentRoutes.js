const express = require("express");
const { verifyToken } = require("../utils/verify");
const {
  createComment,
  getAllComments,
  deleteComment,
} = require("../controllers/commentControllers");

const router = express.Router();

// create a comment
router.post("/create", verifyToken, createComment);

// get all comments
router.get("/:videoId", getAllComments);

// delete a comment
router.delete("/:id", verifyToken, deleteComment);

module.exports = router;
