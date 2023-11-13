const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const createError = require("../utils/error");

const registerCtrl = async (req, res, next) => {
  try {
    if (!req.body.password) {
      return next(createError(400, "password is required"));
    }

    if (req.body.password.trim().split("").length < 6) {
      return next(createError(400, "Password should be at least 6 characters"));
    }

    const user = await User.findOne({ email: req.body.email });

    if (user) {
      return next(
        createError(400, "Another user with the same email already exists.")
      );
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 8);

    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
    });

    const { _id, password, ...others } = newUser._doc;

    const token = jwt.sign({ id: _id }, process.env.SK, { expiresIn: "1d" });

    res.status(201).json({ _id, token, ...others });
  } catch (error) {
    next(error);
  }
};

const loginCtrl = async (req, res, next) => {
  try {
    const user = await User.findOne({ name: req.body.name });

    if (!user) {
      return next(createError(404, "User not found"));
    }

    const isValidPswd = await bcrypt.compare(req.body.password, user.password);

    if (!isValidPswd) {
      return next(createError(400, "Wrong credentials!"));
    }

    const { _id, password, ...others } = user._doc;

    const token = jwt.sign({ id: _id }, process.env.SK, { expiresIn: "1d" });

    res.status(200).json({ _id, token, ...others });
  } catch (error) {
    next(error);
  }
};

const googleLogin = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const { _id, ...others } = user._doc;
      const token = jwt.sign({ id: _id }, process.env.SK, { expiresIn: "1d" });
      res.status(200).json({ _id, token, ...others });
    } else {
      const newUser = await User.create({ fromGoogle: true, ...req.body });

      const { _id, ...others } = newUser._doc;

      const token = jwt.sign({ id: _id }, process.env.SK, { expiresIn: "1d" });

      res.status(201).json({ token, _id, ...others });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  loginCtrl,
  registerCtrl,
  googleLogin,
};
