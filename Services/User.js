
const User  = require("../Schema/UserSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');
const generateTokens = require("../Utils/genrateTokens");

// Register a new user
const registerUser = async (req, res) => {
    const { userName, userEmail, password } = req.body;
    try {
      const userExists = await User.findOne({ email:userEmail });
      if (userExists) {
        console.log("userexists", userExists);
        return{
            success: true,
            status: 200,
            message: "User already exists"

        }
      }
  
      // const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = await User.create({
        userId: uuidv4(),
        name:userName,
        email:userEmail,
        password: hashedPassword,
        isAdmin: false,
      });
  
      if (user) {
        console.log("user", user);
        return {
          status: 201,
          success: true,
          message:"User Registered",
          userId: user.userId,
          name: user.name,
          email: user.email,
          // token: generateToken(user._id),
        };
      } else {
        return {
          status: 400,
          message: "User not registered",
        };
      }
    } catch (error) {
      console.log("uservali", error);
      return {
        status: 400,
        message: error.message
      }
    }
  
  };
  const loginUser = async (req, res) => {
    const { userEmail, password } = req.body;
    try {
      const user = await User.findOne({ email: userEmail });
      if (!user) {
        return {
          status: 400,
          message: "User not found",
        };
      }
      const isPasswordMatched = await bcrypt.compare(password, user.password);
      if (!isPasswordMatched) {
        return {
          status: 400,
          message: "Password is incorrect",
        };
      }
      const { accessToken,refreshToken} = await generateTokens(user)
      return {
        status: 200,
        success: true,
        message: "User logged in",
        accessToken
      };
    } catch (error) {
      console.log("login error", error);
      return {
        status: 400,
        message: error.message,
      };
    }
  };
  const userProfile = async (req, res) => {
    const user =req.user  
    try {
      const currentUser = await User.findById({_id:user._id});
      if (!currentUser) {
        return {
          status: 400,
          message: "User not found",
        };
      }
      return {
        status: 200,
        success: true,
        message: "User profile fetched",
        currentUser,
      };
    } catch (error) {
      console.log("profile error", error);
      return {
        status: 400,
        message: error.message,
      };
    }
  };

module.exports = {
    registerUser,
    loginUser,
    userProfile
  };