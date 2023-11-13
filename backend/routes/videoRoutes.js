const express = require("express");
const { verifyToken } = require("../utils/verify");
const {
  createVideo,
  getVideo,
  updateVideo,
  deleteVideo,
  getTrendyVideos,
  getRandomVideos,
  getSubscribedVideos,
  addView,
  getTaggedVideos,
  getSearchedVideos,
} = require("../controllers/videoControllers");

const router = express.Router();

// create a video
router.post("/create", verifyToken, createVideo);

// get trendy videos
router.get("/find/trendy", getTrendyVideos);

// get random videos
router.get("/find/random", getRandomVideos);

// get subscribed videos
router.get("/find/subscribed", verifyToken, getSubscribedVideos);

// get tagged videos
router.get("/find/tags", getTaggedVideos);

// get searched videos
router.get("/find/search", getSearchedVideos);

// get a video
router.get("/find/:id", getVideo);

// add view
router.put("/addview/:id", addView);

// update a video
router.put("/update/:id", verifyToken, updateVideo);

// delete a video
router.delete("/delete/:id", verifyToken, deleteVideo);

module.exports = router;
