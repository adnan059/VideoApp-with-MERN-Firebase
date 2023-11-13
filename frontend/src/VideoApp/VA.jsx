import React from "react";
import "./VA.css";
import Menu from "./components/Menu";
import Navbar from "./components/Navbar";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Video from "./pages/Video";
import Login from "./pages/Login";
import CreateVideo from "./pages/CreateVideo";
import Search from "./pages/Search";
import { useSelector } from "react-redux";

const VA = () => {
  const { user } = useSelector((store) => store.auth);
  return (
    <div className="videoApp">
      <div className="container">
        <Menu />
        <div className="main">
          <Navbar />
          <div className="wrapper">
            <Routes>
              <Route path="/" element={<Home type="random" />} />
              <Route path="/trendy" element={<Home type="trendy" />} />
              <Route
                path="/subscribed"
                element={
                  user ? <Home type="subscribed" /> : <Navigate to="/login" />
                }
              />

              <Route
                path="/login"
                element={!user ? <Login /> : <Navigate to="/" />}
              />
              <Route path="/video/:id" element={<Video />} />
              <Route
                path="/create"
                element={user ? <CreateVideo /> : <Navigate to="/login" />}
              />
              <Route path="/search" element={<Search />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VA;
