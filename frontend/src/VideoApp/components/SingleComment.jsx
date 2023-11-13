import React, { useEffect, useState } from "react";
import { format } from "timeago.js";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { baseUrl } from "../data";

const SingleComment = ({ ...comment }) => {
  const [commentMaker, setCommentMaker] = useState({});
  const toast = useToast();

  useEffect(() => {
    const fetchCommentMaker = async () => {
      try {
        const { data } = await axios.get(
          `${baseUrl}/users/find/${comment?.userId}`
        );
        setCommentMaker(data);
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
    fetchCommentMaker();
  }, []);
  return (
    <div className="singleCommentContainer">
      <img src={commentMaker?.photoURL} alt="" />
      <div className="commentDetail">
        <div className="commentInfo">
          <h2 className="commentMaker">{commentMaker?.name}</h2>
          <span className="commentTime">{format(comment?.createdAt)}</span>
        </div>
        <p className="commentDesc">{comment?.desc}</p>
      </div>
    </div>
  );
};

export default SingleComment;
