const User = require("../models/User");
const Video = require("../models/Video");
const createError = require("../utils/error");

// Get an User
const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select({ password: 0 });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// Update an User
const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(createError(403, "You can update only your profile."));
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    ).select({ password: 0 });

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// Delete an User
const deleteUser = async (req, res, next) => {
  if (req.params.id !== req.user.id) {
    return next(createError(403, "You can delete only your account."));
  }

  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User has been deleted." });
  } catch (error) {
    next(error);
  }
};

// Subscribe a Channel
const subscribeChannel = async (req, res, next) => {
  if (req.user.id === req.params.channelId) {
    return next(createError(400, "You cannot subscribe to yourself"));
  }
  try {
    const updatedUser1 = await User.findByIdAndUpdate(
      req.user.id,
      {
        $addToSet: { subscribedUsers: req.params.channelId },
      },
      { new: true }
    );

    const updatedUser2 = await User.findByIdAndUpdate(
      req.params.channelId,
      { $inc: { subscribers: 1 } },
      { new: true }
    );

    res.status(200).json({
      updatedUser1,
      updatedUser2,
      message: "You've subscribed the channel",
    });
  } catch (error) {
    next(error);
  }
};

// Unsubscribe a Channel
const unsubscribeChannel = async (req, res, next) => {
  try {
    const updatedUser1 = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { subscribedUsers: req.params.channelId } },
      { new: true }
    );

    const updatedUser2 = await User.findByIdAndUpdate(
      req.params.channelId,
      { $inc: { subscribers: -1 } },
      { new: true }
    );

    res.status(200).json({
      updatedUser1,
      updatedUser2,
      message: "You've unsubscribed the channel",
    });
  } catch (error) {
    next(error);
  }
};

// Like a Video
const likeVideo = async (req, res, next) => {
  try {
    const videoId = req.params.videoId;
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: { likes: req.user.id },
      $pull: { dislikes: req.user.id },
    });
    res.status(200).json({ message: "You've liked the video" });
  } catch (error) {
    next(error);
  }
};

// Unlike a Video
const dislikeVideo = async (req, res, next) => {
  try {
    const videoId = req.params.videoId;
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: { dislikes: req.user.id },
      $pull: { likes: req.user.id },
    });

    res.status(200).json({ message: "You've disliked the video" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUser,
  updateUser,
  deleteUser,
  subscribeChannel,
  unsubscribeChannel,
  likeVideo,
  dislikeVideo,
};
