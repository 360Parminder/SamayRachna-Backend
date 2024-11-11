require("dotenv").config();
const jwt = require("jsonwebtoken");
const user_model = require("../Schema/UserSchema");
const client = require("../db/databasepg");

// Middleware for handling auth
async function user_auth(req, res, next) {
  try {
    const tokenHead = req.headers["authorization"];
    if (!tokenHead) {
      return res.status(401).json({ 
        message: "User is not logged in",
        success: false, 
      });
    }

    const token = tokenHead.split(" ")[1];
    if (!token) {
      return res.status(401).json({ 
        message: "User is not logged in",
        success: false,
      });
    }

    const jwtPassword = process.env.JWT_SECRET;
    const decode = await jwt.verify(token, jwtPassword);
    let user = await client.query(`SELECT * FROM users WHERE userid = '${decode.id}';`);  
    if (!user) return res.status(404).json({ 
      message: "User not found",
      success: false,
     });

    req.user = user.rows[0];
    next();
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
    });
  }
}

module.exports = user_auth;