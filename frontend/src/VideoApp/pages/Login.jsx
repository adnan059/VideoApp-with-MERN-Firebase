import React, { useEffect, useState } from "react";
import "../assets/style/Login.css";
import axios from "axios";
import { baseUrl } from "../data";
import { useToast } from "@chakra-ui/toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, register } from "../redux/authSlice";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../Firebase";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import app from "../Firebase";

const Login = () => {
  const [loginInputs, setLoginInputs] = useState({ name: "", password: "" });
  const [registerInputs, setRegisterInputs] = useState({
    name: "",
    email: "",
    password: "",
    photoURL: "",
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userImg, setUserImg] = useState(undefined);
  const [imgPerc, setImgPerc] = useState(0);

  ///////////////////////////////////////////////////
  const uploadUserImg = (file) => {
    const fileName = new Date().getTime() + "_" + file.name;

    const storage = getStorage(app);
    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setImgPerc(Math.round(progress));

        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            break;
        }
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log(downloadURL);
          setRegisterInputs({ ...registerInputs, photoURL: downloadURL });
        });
      }
    );
  };

  ///////////////////////////////////////////////////

  useEffect(() => {
    userImg && uploadUserImg(userImg);
  }, [userImg]);

  ///////////////////////////////////////////////////

  const handleRegister = async () => {
    console.log(registerInputs);
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${baseUrl}/auth/register`,
        registerInputs
      );

      const { token, ...others } = data;
      dispatch(register({ token, others }));
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast({
        title: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  ///////////////////////////////////////////////////

  const handleLogin = async (e) => {
    e.preventDefault();
    // console.log("Login Loading");
    try {
      setLoading(true);
      const { data } = await axios.post(`${baseUrl}/auth/login`, loginInputs);
      const { token, ...others } = data;
      dispatch(login({ token, others }));
      navigate("/");

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast({
        title: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  ////////////////////////////////////////////////////

  const loginWgoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      const { displayName, email, photoURL } = result.user;

      const { data } = await axios.post(`${baseUrl}/auth/google`, {
        name: displayName,
        email,
        photoURL,
      });

      const { token, ...others } = data;

      dispatch(login({ token, others }));

      setLoading(false);
      navigate("/");
    } catch (error) {
      console.log(error.response.data);
      setLoading(false);
      toast({
        title: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  ////////////////////////////////////////////////////

  return (
    <div className="authContainer">
      <div className="wrapper">
        <h1 className="title">Log in</h1>
        <h2 className="subTitle">
          to continue to <span className="vidTub">VidTube</span>
        </h2>
        <input
          type="text"
          placeholder="name"
          value={loginInputs.name}
          onChange={(e) =>
            setLoginInputs({ ...loginInputs, name: e.target.value })
          }
        />
        <input
          type="password"
          placeholder="password"
          value={loginInputs.password}
          onChange={(e) =>
            setLoginInputs({ ...loginInputs, password: e.target.value })
          }
        />
        <button onClick={handleLogin} disabled={loading}>
          Log in
        </button>
        <h1 className="title">or</h1>
        <button disabled={loading} onClick={loginWgoogle}>
          Login with Google
        </button>
        <h1 className="title">or</h1>

        <input
          type="text"
          placeholder="name"
          value={registerInputs.name}
          onChange={(e) =>
            setRegisterInputs({ ...registerInputs, name: e.target.value })
          }
          required
        />
        <input
          type="email"
          placeholder="email"
          value={registerInputs.email}
          onChange={(e) =>
            setRegisterInputs({ ...registerInputs, email: e.target.value })
          }
          required
        />
        <input
          type="password"
          placeholder="password; minimum 6 characters"
          value={registerInputs.password}
          onChange={(e) =>
            setRegisterInputs({
              ...registerInputs,
              password: e.target.value,
            })
          }
          required
        />

        <label htmlFor="userPhoto">Profile Pic:</label>

        {imgPerc > 0 ? (
          <p className="uploadPerc">{`Uploading ${imgPerc}%`}</p>
        ) : (
          <input
            type="file"
            id="userPhoto"
            name="userPhoto"
            accept="image/*"
            onChange={(e) => setUserImg(e.target.files[0])}
          />
        )}

        <button disabled={loading} onClick={handleRegister}>
          Register
        </button>
      </div>
    </div>
  );
};

export default Login;
