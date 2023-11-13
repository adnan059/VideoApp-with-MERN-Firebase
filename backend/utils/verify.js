const jwt = require("jsonwebtoken");
const createError = require("./error");

const verifyToken = (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith(`Bearer `)
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.SK);

      req.user = { id: decoded.id };

      next();
    } catch (error) {
      next(error);
    }
  } else {
    return next(createError(401, "You are not Authorized."));
  }
};

module.exports = { verifyToken };
