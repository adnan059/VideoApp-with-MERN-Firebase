const Comment = require("../models/Comment");
const Video = require("../models/Video");
const createError = require("../utils/error");

// create a comment
const createComment = async (req, res, next) => {
  try {
    const newComment = await Comment.create({
      ...req.body,
      userId: req.user.id,
    });

    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
};

// get all comments
const getAllComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoId }).sort({
      createdAt: -1,
    });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

// delete a comment
const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    const video = await Video.findById(comment.videoId);

    if (req.user.id === comment.userId || req.user.id === video.userId) {
      await Comment.findByIdAndDelete(req.params.id);

      res.status(200).json({ message: "Comment has been deleted." });
    } else {
      return next(
        createError(403, "You aren't authorised to delete this comment")
      );
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComment,
  getAllComments,
  deleteComment,
};
