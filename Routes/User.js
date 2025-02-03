
const express = require("express");
const router = express.Router();
const { RegisterUser, LoginUser, UserProfile, GetAllUser, ChangePassword } = require("../Controllers/User");
const user_auth = require("../Middleware/userAuth");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("file from router",file);
        console.log("req.file from router",req);
        cb(null, "uploads/"); // Save files in the 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname); // Unique filename
    },
});
const upload = multer({ storage });

router.post("/register",upload.single('profilePic'), RegisterUser);
router.post("/login", LoginUser);
router.get("/profile",user_auth, UserProfile);
router.get("/alluser",user_auth, GetAllUser);
router.post("/changepassword",user_auth, ChangePassword);

module.exports = router;