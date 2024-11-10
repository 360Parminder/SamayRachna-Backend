require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
 
 
 
 const generateTokens = async (user) => {

    try {
      const accessToken = jwt.sign({ id: user.userid }, process.env.JWT_SECRET)
      const refreshToken = jwt.sign({ id: user.userid },process.env.REFRESH_TOKEN_SECRET)
      return {
        accessToken,
        refreshToken
      }
    } catch (error) {
      throw new Error(500, "Something went Wrong with Tokens")
    }
  
  }
  module.exports = generateTokens;