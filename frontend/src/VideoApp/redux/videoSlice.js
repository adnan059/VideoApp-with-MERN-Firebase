import { createSlice } from "@reduxjs/toolkit";

const videoSlice = createSlice({
  name: "video",
  initialState: {
    video: { currentVideo: null },
  },
  reducers: {
    setNewVideo: (state, action) => {
      state.currentVideo = action.payload;
    },

    likeVideo: (state, action) => {
      state.currentVideo.likes = [
        ...new Set([...state.currentVideo.likes, action.payload]),
      ];
      state.currentVideo.dislikes = state.currentVideo.dislikes.filter(
        (value) => value !== action.payload
      );
    },

    dislikeVideo: (state, action) => {
      state.currentVideo.dislikes = [
        ...new Set([...state.currentVideo.dislikes, action.payload]),
      ];
      state.currentVideo.likes = state.currentVideo.likes.filter(
        (value) => value !== action.payload
      );
    },
  },
});

export const { setNewVideo, likeVideo, dislikeVideo } = videoSlice.actions;

export default videoSlice.reducer;
