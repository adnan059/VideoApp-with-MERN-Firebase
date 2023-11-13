import React, { useEffect, useState } from "react";
import "../assets/style/Comments.css";
import SingleComment from "./SingleComment";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { baseUrl } from "../data";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/authSlice";

const Comments = ({ videoId }) => {
  const { user, token } = useSelector((store) => store.auth);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toast = useToast();

  ////////////////////////////////////////////
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/comments/${videoId}`);
        setComments(data);
      } catch (error) {
        toast({
          title: error.response.data.message,
          duration: 5000,
          isClosable: true,
          status: "error",
          position: "bottom-left",
        });
      }
    };

    fetchComments();
  }, [videoId]);

  //////////////////////////////////////////

  const submitNewComment = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `${baseUrl}/comments/create`,
        { desc: newComment, videoId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments([data, ...comments]);
      setNewComment("");
    } catch (error) {
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

  /////////////////////////////////////////

  return (
    <div className="commentsContainer">
      <div className="newComment">
        <img
          src={
            user?.photoURL
              ? user?.photoURL
              : "https://firebasestorage.googleapis.com/v0/b/videoapp-d0318.appspot.com/o/user.jpg?alt=media&token=c9647c9b-bdd4-4281-a3f9-c92bd95411af"
          }
          alt=""
        />
        <textarea
          placeholder="Write your comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        ></textarea>
        <button onClick={submitNewComment} className="addCommentBtn">
          Add Comment
        </button>
      </div>
      <div className="allComments">
        {comments.map((comment) => (
          <SingleComment {...comment} key={comment?._id} />
        ))}
      </div>
    </div>
  );
};

export default Comments;
