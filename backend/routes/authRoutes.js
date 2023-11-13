const { Router } = require("express");
const {
  registerCtrl,
  loginCtrl,
  googleLogin,
} = require("../controllers/authControllers");

const router = Router();

router.post("/register", registerCtrl);

router.post("/login", loginCtrl);

router.post("/google", googleLogin);

module.exports = router;
