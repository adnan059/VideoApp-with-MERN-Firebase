import React from "react";
import "../assets/style/Home.css";
import Card from "../components/Card";
import axios from "axios";
import { baseUrl } from "../data";

import { useToast } from "@chakra-ui/toast";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

const Home = ({ type }) => {
  const { token } = useSelector((store) => store.auth);
  const [videos, setVideos] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //////////////////////////////////////////////

  React.useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${baseUrl}/videos/find/${type}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setVideos(data);

        console.log("RELOADING HOME PAGE");

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
          navigate("/");
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

    fetchVideos();
  }, [type]);

  if (loading)
    return (
      <h1
        style={{
          color: "White",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        LOADING ....
      </h1>
    );
  return (
    <div className="homeContainer">
      {videos.map((video) => {
        //    console.log(video);
        return <Card key={video._id} {...video} />;
      })}
    </div>
  );
};

export default Home;
