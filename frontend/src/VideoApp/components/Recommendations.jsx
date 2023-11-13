import React, { useEffect, useState } from "react";
import "../assets/style/Recommendations.css";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { baseUrl } from "./../data";
import Card from "../components/Card";

const Recommendations = ({ tags }) => {
  const [videos, setVideos] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const fetchTaggedVideos = async () => {
      try {
        const { data } = await axios.get(
          `${baseUrl}/videos/find/tags?tags=${tags}`
        );
        //console.log(data);
        setVideos(data);
      } catch (error) {
        toast({
          title: error.response.data.message,
          status: "error",
          position: "bottom-left",
          duration: 5000,
          isClosable: true,
        });
      }
    };
    fetchTaggedVideos();
  }, [tags]);

  return (
    <div className="recomContainer">
      {videos.map((video) => (
        <Card key={video?._id} {...video} type="sm" />
      ))}
    </div>
  );
};

export default Recommendations;
