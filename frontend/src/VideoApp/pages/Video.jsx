import React, { useCallback, useEffect, useMemo, useState } from "react";
import "../assets/style/Video.css";
import Comments from "../components/Comments";
import Card from "../components/Card";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../data";
import { useToast } from "@chakra-ui/toast";
import { dislikeVideo, likeVideo, setNewVideo } from "../redux/videoSlice";
import { format } from "timeago.js";
import { logout, toggleSubscription } from "../redux/authSlice";
import Recommendations from "../components/Recommendations";

const Video = () => {
  const { user, token } = useSelector((store) => store.auth);
  const { currentVideo } = useSelector((store) => store.video);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const toast = useToast();
  const { pathname } = useLocation();
  const videoId = pathname.split("/")[2];
  const [channel, setChannel] = useState({});
  const navigate = useNavigate();
  //console.log(videoId);

  //////////////////////////////////////////////
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);

        await axios.put(`${baseUrl}/videos/addview/${videoId}`);

        const vidRes = await axios.get(`${baseUrl}/videos/find/${videoId}`);

        dispatch(setNewVideo(vidRes.data));

        const channelRes = await axios.get(
          `${baseUrl}/users/find/${vidRes.data.userId}`
        );

        console.log("Vid Page useEffect");

        setChannel(channelRes.data);

        //console.log(currentVideo);

        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast({
          title: error.response.data.message,
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
          status: "error",
        });
      }
    };
    fetchVideo();
  }, [videoId, dispatch, toast]);

  //////////////////////////////////////////////
  //console.log(currentVideo);

  const handleLike = async () => {
    try {
      const { data } = await axios.put(
        `${baseUrl}/users/like/${videoId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(likeVideo(user?._id));
      toast({
        title: data.message,
        duration: 5000,
        isClosable: true,
        status: "info",
        position: "bottom-left",
      });
    } catch (error) {
      console.log(error);

      if (
        error.response.data.message === "jwt expired" ||
        error.response.data.message === "jwt malformed"
      ) {
        dispatch(logout());
        toast({
          title: "You need to login first!",
          duration: 5000,
          isClosable: true,
          status: "error",
          position: "bottom-left",
        });
        navigate("/login");
      } else {
        toast({
          title: error.response.data.message,
          duration: 5000,
          isClosable: true,
          status: "error",
          position: "bottom-left",
        });
      }
    }
  };

  //////////////////////////////////////////////

  const handleDislike = async () => {
    try {
      const { data } = await axios.put(
        `${baseUrl}/users/dislike/${videoId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(dislikeVideo(user?._id));

      toast({
        title: data.message,
        duration: 5000,
        isClosable: true,
        status: "info",
        position: "bottom-left",
      });
    } catch (error) {
      console.log(error);

      if (
        error.response.data.message === "jwt expired" ||
        error.response.data.message === "jwt malformed"
      ) {
        dispatch(logout());
        toast({
          title: "You need to login first! ",
          duration: 5000,
          isClosable: true,
          status: "error",
          position: "bottom-left",
        });

        navigate("/login");
      } else {
        toast({
          title: error.response.data.message,
          duration: 5000,
          isClosable: true,
          status: "error",
          position: "bottom-left",
        });
      }
    }
  };

  ///////////////////////////////////////////////

  const toggleSubscribe = async () => {
    try {
      setLoading(true);

      if (user?.subscribedUsers.includes(channel?._id)) {
        const { data } = await axios.put(
          `${baseUrl}/users/unsub/${channel?._id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        toast({
          title: data.message,
          duration: 5000,
          isClosable: true,
          status: "info",
          position: "bottom-left",
        });

        setChannel({ ...channel, subscribers: channel.subscribers - 1 });
      } else {
        const { data } = await axios.put(
          `${baseUrl}/users/sub/${channel?._id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        toast({
          title: data.message,
          duration: 5000,
          isClosable: true,
          status: "info",
          position: "bottom-left",
        });

        setChannel({ ...channel, subscribers: channel.subscribers + 1 });
      }

      dispatch(toggleSubscription(channel?._id));

      setLoading(false);
    } catch (error) {
      setLoading(false);

      if (
        error.response.data.message === "jwt expired" ||
        error.response.data.message === "jwt malformed"
      ) {
        dispatch(logout());
        toast({
          title: "You need to login first!",
          duration: 5000,
          isClosable: true,
          status: "error",
          position: "bottom-left",
        });
        navigate("/login");
      } else {
        toast({
          title: error.response.data.message,
          duration: 5000,
          isClosable: true,
          status: "error",
          position: "bottom-left",
        });
      }
    }
  };

  // console.log(channel?._id);

  //console.log(user?.subscribedUsers);

  console.log("Video Page Loading");

  //////////////////////////////////////////////

  return (
    <div className="vidPageContainer">
      <div className="content">
        <div className="vidWrapper">
          <video controls src={currentVideo?.videoUrl}></video>
          <h1 className="title">{currentVideo?.title}</h1>
          <div className="details">
            <span className="info">
              {currentVideo?.views} Views | {format(currentVideo?.createdAt)}
            </span>
            <div className="buttons">
              {/* Like */}
              <button onClick={handleLike}>
                {currentVideo?.likes.includes(user?._id) ? (
                  <i className="fa-solid fa-thumbs-up"></i>
                ) : (
                  <i className="fa-regular fa-thumbs-up"></i>
                )}
                {currentVideo?.likes.length}
              </button>

              {/* Dislike */}
              <button onClick={handleDislike}>
                {currentVideo?.dislikes.includes(user?._id) ? (
                  <i className="fa-solid fa-thumbs-down"></i>
                ) : (
                  <i className="fa-regular fa-thumbs-down"></i>
                )}
              </button>
            </div>
          </div>

          <div className="channel">
            <div className="channelInfo">
              <img src={channel?.photoURL} alt="" />
              <div className="channelDetail">
                <span className="channelName">{channel?.name}</span>
                <span className="subscribers">
                  {channel?.subscribers} Subscribers
                </span>
                <span className="channelDesc">{currentVideo?.desc}</span>
              </div>
            </div>

            {/* /////////////////////////////////////////////// */}
            {/* subscribe & unsubscribe */}
            {
              <button
                onClick={toggleSubscribe}
                className="subscribe"
                disabled={loading}
              >
                {user?.subscribedUsers.includes(channel?._id)
                  ? "Unsubscribe"
                  : "Subscribe"}
              </button>
            }
          </div>

          <Comments videoId={currentVideo?._id} />
        </div>
      </div>
      <Recommendations tags={currentVideo?.tags} />
    </div>
  );
};

export default Video;
