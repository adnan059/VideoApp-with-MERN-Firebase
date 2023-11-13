const Video = require("../models/Video");
const User = require("../models/User");
const createError = require("../utils/error");

// create a video
const createVideo = async (req, res, next) => {
  try {
    const newVideo = await Video.create({ userId: req.user.id, ...req.body });
    res.status(201).json(newVideo);
  } catch (error) {
    next(error);
  }
};

// get a video
const getVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return next(createError(404, "Video not found!"));
    }

    res.status(200).json(video);
  } catch (error) {
    next(error);
  }
};

// get random videos
const getRandomVideos = async (req, res, next) => {
  try {
    const videos = await Video.aggregate([{ $sample: { size: 10 } }]);
    res.status(200).json(videos);
  } catch (error) {
    next(error);
  }
};

// get trendy videos
const getTrendyVideos = async (req, res, next) => {
  try {
    const videos = await Video.find().sort({ views: -1 });
    res.status(200).json(videos);
  } catch (error) {
    next(error);
  }
};

// get subcribed videos
const getSubscribedVideos = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const subscribedChannels = user.subscribedUsers;

    const list = await Promise.all(
      subscribedChannels.map((channelId) => {
        return Video.find({ userId: channelId });
      })
    );

    res.status(200).json(list.flat());
  } catch (error) {
    next(error);
  }
};

// get tagged videos
const getTaggedVideos = async (req, res, next) => {
  try {
    const tags = req.query.tags.split(",");
    //console.log(tags);
    const videos = await Video.find({ tags: { $in: tags } }).limit(20);
    res.status(200).json(videos);
  } catch (error) {
    next(error);
  }
};

// get searched videos
const getSearchedVideos = async (req, res, next) => {
  try {
    const query = req.query.q;
    const videos = await Video.find({
      title: { $regex: query, $options: "i" },
    });

    res.status(200).json(videos);
  } catch (error) {
    next(error);
  }
};

// add view
const addView = async (req, res, next) => {
  try {
    const updatedVideo = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    res.status(200).json({ message: "The view has been increased." });
  } catch (error) {
    next(error);
  }
};

// update a video
const updateVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return next(createError(404, "No video found!"));
    }

    if (req.user.id !== video.userId) {
      return next(createError(403, "You can update only your video"));
    }

    const updatedVideo = await Video.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updatedVideo);
  } catch (error) {
    next(error);
  }
};

// delete a video
const deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return next(createError(404, "Video not found"));
    if (req.user.id !== video.userId)
      return next(createError(403, "You can delete only your videos"));

    await Video.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createVideo,
  getVideo,
  updateVideo,
  deleteVideo,
  addView,
  getRandomVideos,
  getTrendyVideos,
  getSubscribedVideos,
  getTaggedVideos,
  getSearchedVideos,
};
