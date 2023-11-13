import React from "react";
import "../assets/style/Menu.css";
import logo from "../assets/images/vidlogo.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";

const Menu = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    //console.log("logout Loading");
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="menuContainer">
      <div className="wrapper">
        <Link to="/">
          <div className="logo">
            <img src={logo} alt="" />
            VidTube
          </div>
        </Link>

        <div className="itemList">
          <Link to="/">
            <div className="item">
              <i className="fa-solid fa-house"></i> Home
            </div>
          </Link>

          <Link to="/trendy">
            <div className="item">
              <i className="fa-regular fa-compass"></i>
              Explore
            </div>
          </Link>

          <Link to="/subscribed">
            <div className="item">
              <i className="fa-solid fa-layer-group"></i>
              Subscriptions
            </div>
          </Link>
        </div>

        {user ? (
          <div className="currentUserInfo">
            <img
              src={
                user?.photoURL
                  ? user.photoURL
                  : "https://icon-library.com/images/no-user-image-icon/no-user-image-icon-26.jpg"
              }
              alt=""
            />
            <p>{user?.name}</p>
          </div>
        ) : null}

        <Link className="uploadBtn" to="/create">
          <i className="fa-solid fa-arrow-up-from-bracket"></i>Upload
        </Link>

        {user ? (
          <>
            <button onClick={handleLogout} className="logout">
              <i className="fa-solid fa-right-from-bracket"></i>Logout
            </button>
          </>
        ) : (
          <Link to="/login">
            <button className="login">Login</button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Menu;
