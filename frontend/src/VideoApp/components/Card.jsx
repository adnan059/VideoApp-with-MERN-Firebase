import React, { useEffect, useState } from "react";
import "../assets/style/Card.css";
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { baseUrl } from "../data";

const Card = ({ type, ...video }) => {
  const [channel, setChannel] = useState({});
  const toast = useToast();

  ///////////////////////////////////////

  useEffect(() => {
    const fetchChannelInfo = async () => {
      try {
        const { data } = await axios.get(
          `${baseUrl}/users/find/${video?.userId}`
        );

        setChannel(data);
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

    fetchChannelInfo();
  }, [video?.userId]);

  ///////////////////////////////////////

  const truncate = (txt) => {
    if (type === "sm" && txt.length > 25) {
      return txt.slice(0, 25) + "....";
    } else {
      return txt;
    }
  };

  /////////////////////////////////////
  return (
    <Link to={`/video/${video._id}`}>
      <div className={type === "sm" ? "cardContainer sm" : "cardContainer"}>
        <img
          src={video?.thumbnailUrl}
          alt=""
          className={type === "sm" ? "smThumbnail" : null}
        />
        <div className={type === "sm" ? "details smtype" : "details"}>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAHXPluq6GtTRPDIHRv5kJPy86uFjp5sO7hg&usqp=CAU"
            alt=""
            className={type === "sm" ? "channelImg sm" : "channelImg"}
          />
          <div className="texts">
            <h1 className="title">{truncate(video?.title)}</h1>
            <h2
              className={type === "sm" ? "channelName smtype" : "channelName"}
            >
              {channel?.name}
            </h2>
            <div className="info">
              {video?.views} views | {format(video?.createdAt)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Card;
