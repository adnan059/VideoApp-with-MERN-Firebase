const express = require("express");
const {
  updateUser,
  getUser,
  deleteUser,
  subscribeChannel,
  unsubscribeChannel,
  likeVideo,
  dislikeVideo,
} = require("../controllers/userControllers");
const { verifyToken } = require("../utils/verify");
const router = express.Router();

// get an user
router.get("/find/:id", getUser);

// update an user
router.put("/update/:id", verifyToken, updateUser);

// subscribe a channel
router.put("/sub/:channelId", verifyToken, subscribeChannel);

// unsubscribe a channel
router.put("/unsub/:channelId", verifyToken, unsubscribeChannel);

// like a video
router.put("/like/:videoId", verifyToken, likeVideo);

// dislike a video
router.put("/dislike/:videoId", verifyToken, dislikeVideo);

// delete an user
router.delete("/delete/:id", verifyToken, deleteUser);

module.exports = router;
