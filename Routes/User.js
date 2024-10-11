
const express = require("express");
const router = express.Router();
const { RegisterUser, LoginUser, UserProfile, GetAllUser } = require("../Controllers/User");
const user_auth = require("../Middleware/userAuth");

router.post("/register", RegisterUser);
router.post("/login", LoginUser);
router.get("/profile",user_auth, UserProfile);
router.get("/alluser",user_auth, GetAllUser);

module.exports = router;