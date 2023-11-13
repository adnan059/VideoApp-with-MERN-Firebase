const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "UserId is required."],
    },
    title: {
      type: String,
      required: [true, "Video title is required."],
    },

    desc: {
      type: String,
      required: [true, "Video description is required."],
    },

    thumbnailUrl: {
      type: String,
      required: [true, "Thumbnail is required."],
    },

    videoUrl: {
      type: String,
      required: [true, "Video URL is required."],
    },

    views: {
      type: Number,
      default: 0,
    },

    tags: {
      type: [String],
      default: [],
    },

    likes: {
      type: [String],
      default: [],
    },

    dislikes: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Video = mongoose.model("Video", videoSchema);

module.exports = Video;
