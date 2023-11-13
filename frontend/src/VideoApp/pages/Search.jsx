import React, { useEffect, useState } from "react";
import "../assets/style/Search.css";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { baseUrl } from "../data";
import { useLocation } from "react-router-dom";
import Card from "../components/Card";

const Search = () => {
  const [videos, setVideos] = useState([]);
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const { search } = useLocation();
  //console.log(search);

  useEffect(() => {
    const fetchSearchedVideos = async () => {
      try {
        setLoading(true);

        const { data } = await axios.get(
          `${baseUrl}/videos/find/search${search}`
        );
        //console.log(data);

        setVideos(data);

        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast({
          title: error.response.data.message,
          duration: 5000,
          isClosable: true,
          status: "error",
          position: "bottom-left",
        });
      }
    };

    fetchSearchedVideos();
  }, [search]);

  if (loading) return <h1>LOADING.....</h1>;

  if (videos.length < 1)
    return (
      <h1
        style={{
          color: "white",
          fontSize: "3rem",
          textAlign: "center",
          marginTop: "10rem",
        }}
      >
        Nothing Found!
      </h1>
    );

  return (
    <div className="searchContainer">
      {videos?.map((video) => (
        <Card key={video?._id} {...video} />
      ))}
    </div>
  );
};

export default Search;
