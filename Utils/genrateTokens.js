require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
 
 
 
 const generateTokens = async (user) => {
    try {
      const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
      // const hashaccessToken = await bcrypt.hash(accessToken, 10)
      const refreshToken = jwt.sign({ id: user._id },process.env.REFRESH_TOKEN_SECRET)
      // const hashrefreshToken = await bcrypt.hash(refreshToken, 10)
      user.refreshToken = refreshToken
      await user.save({ validateBeforeSave: false })
      return {
        accessToken,
        refreshToken
      }
    } catch (error) {
      throw new Error(500, "Something went Wrong with Tokens")
    }
  
  }
  module.exports = generateTokens;