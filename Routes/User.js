
const express = require("express");
const router = express.Router();
const { RegisterUser } = require("../Controllers/User");

router.post("/register", RegisterUser);

module.exports = router;