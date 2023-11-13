require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// *******************************************

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const videoRoutes = require("./routes/videoRoutes");
const commentRoutes = require("./routes/commentRoutes");

// *******************************************

const PORT = process.env.PORT || 8000;
const DB_URL = process.env.DB_URL;

// *******************************************

const app = express();
app.use(express.json());
app.use(cors());

// *******************************************

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log("Database Connected Successfully.");
    app.listen(PORT, () => console.log(`Server Listening on Port ${PORT}.`));
  } catch (error) {
    console.log(error);
  }
};

connectDB();

// *******************************************

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/videos", videoRoutes);
app.use("/comments", commentRoutes);

// *******************************************

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";

  return res.status(status).json({
    status,
    message,
    stack: err.stack,
    success: false,
  });
});
