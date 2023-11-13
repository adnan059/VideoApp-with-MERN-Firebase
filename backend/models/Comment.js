const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "UserId for comment is required."],
    },
    videoId: {
      type: String,
      required: [true, "Video Id for comment is required."],
    },
    desc: {
      type: String,
      required: [true, "Comment description is required."],
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
