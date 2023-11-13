import React, { useEffect, useState } from "react";
import "../assets/style/CreateVideo.css";
import { TagsInput } from "react-tag-input-component";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import app from "../Firebase";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { baseUrl } from "./../data";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/authSlice";

const CreateVideo = () => {
  const [tags, setTags] = useState([]);
  const [thumbnail, setThumbnail] = useState(undefined);
  const [video, setVideo] = useState(undefined);
  const [vidPerc, setVidPerc] = useState(0);
  const [thumbPerc, setThumbPerc] = useState(0);
  const [vidInputs, setVidInputs] = useState({ title: "", desc: "" });
  const { token } = useSelector((store) => store.auth);
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  ////////////////////////////////////////////////
  const uploadFile = (file, urlType) => {
    if (file.size > 5000000) {
      toast({
        title: "File size should be 1MB or less",
        duration: 5000,
        status: "info",
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
    const fileName = new Date().getTime() + "_" + file.name;

    const storage = getStorage(app);
    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        urlType === "thumbnailUrl"
          ? setThumbPerc(Math.round(progress))
          : setVidPerc(Math.round(progress));

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
          setVidInputs({ ...vidInputs, [urlType]: downloadURL });
        });
      }
    );
  };

  ////////////////////////////////////////////////

  useEffect(() => {
    video && uploadFile(video, "videoUrl");
  }, [video]);

  ////////////////////////////////////////////////

  useEffect(() => {
    thumbnail && uploadFile(thumbnail, "thumbnailUrl");
  }, [thumbnail]);

  ////////////////////////////////////////////////

  const handleChange = (e) => {
    setVidInputs({ ...vidInputs, [e.target.name]: e.target.value });
  };
  ////////////////////////////////////////////////

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${baseUrl}/videos/create`,
        { ...vidInputs, tags },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(data);

      navigate("/video/" + data?._id);

      setLoading(false);
    } catch (error) {
      setLoading(false);

      if (
        error.response.data.message === "jwt expired" ||
        error.response.data.message === "jwt malformed"
      ) {
        dispatch(logout());
        toast({
          title: "You need to login first",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
          status: "error",
        });
        navigate("/login");
      } else {
        toast({
          title: error.response.data.message,
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
          status: "error",
        });
      }
    }
  };

  ////////////////////////////////////////////////

  return (
    <div className="createContainer">
      <div className="wrapper">
        <h1 className="title">Upload a New Video</h1>
        <label htmlFor="vidFile">Video: File size should be under 5 MB</label>
        {vidPerc > 0 ? (
          <p>{`Uploading ${vidPerc}%`}</p>
        ) : (
          <input
            type="file"
            name="vidFile"
            id="vidFile"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files[0])}
          />
        )}
        <input
          type="text"
          name="title"
          placeholder="Video Title"
          value={vidInputs.title}
          onChange={handleChange}
        />
        <textarea
          name="desc"
          placeholder="Video Description"
          value={vidInputs.desc}
          onChange={handleChange}
        ></textarea>
        <TagsInput
          value={tags}
          onChange={setTags}
          name="tags"
          placeHolder="Enter Video Tags: Press 'Enter' button after writing a tag"
        />

        <label htmlFor="thumbnail">
          Thumbnail: File size should be under 1 MB
        </label>
        {thumbPerc > 0 ? (
          <p>{`Uploading ${thumbPerc}%`}</p>
        ) : (
          <input
            type="file"
            name="thumbnail"
            id="thumbnail"
            accept="images/*"
            onChange={(e) => setThumbnail(e.target.files[0])}
          />
        )}

        <button disabled={loading} onClick={handleUpload} className="uploadBtn">
          Upload
        </button>
      </div>
    </div>
  );
};

export default CreateVideo;
