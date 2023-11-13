import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
  },
  reducers: {
    register: (state, action) => {
      // console.log("authslice reg")
      state.user = action.payload.others;
      state.token = action.payload.token;
    },
    login: (state, action) => {
      //  console.log("authslice logi");

      state.user = action.payload.others;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },

    toggleSubscription: (state, action) => {
      if (state.user.subscribedUsers.includes(action.payload)) {
        state.user.subscribedUsers = state.user.subscribedUsers.filter(
          (value) => value !== action.payload
        );
      } else {
        state.user.subscribedUsers = [
          ...new Set([...state.user.subscribedUsers, action.payload]),
        ];
      }
    },
  },
});

export const { register, login, logout, toggleSubscription } =
  authSlice.actions;

export default authSlice.reducer;
