require("dotenv").config();
const jwt = require("jsonwebtoken");
const user_model = require("../Schema/UserSchema");

// Middleware for handling auth
async function user_auth(req, res, next) {
  try {
    const tokenHead = req.headers["authorization"];
    if (!tokenHead) {
      return res.status(401).json({ message: "User is not logged in" });
    }

    const token = tokenHead.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "User is not logged in" });
    }

    const jwtPassword = process.env.JWT_SECRET;
    const decode = await jwt.verify(token, jwtPassword);
    let user = await user_model
      .findOne({ _id: decode.id })
      .select("-password -auth_key ")
      .exec();
    if (!user) return res.status(403).json({ msg: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
    });
  }
}

module.exports = user_auth;