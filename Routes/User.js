
const express = require("express");
const router = express.Router();
const { RegisterUser, LoginUser, UserProfile } = require("../Controllers/User");

router.post("/register", RegisterUser);
router.post("/login", LoginUser);
router.get("/profile/:userId", UserProfile);

module.exports = router;