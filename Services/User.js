
const User  = require("../Schema/UserSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');

// Register a new user
const registerUser = async (req, res) => {
    const { userName, userEmail, password } = req.body;
    try {
      const userExists = await User.findOne({ userEmail });
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
        id: uuidv4(),
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
          _id: user._id,
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
      const token = generateToken(user._id);
      return {
        status: 200,
        success: true,
        message: "User logged in",
        token,
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
    const { userId } = req.params;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return {
          status: 400,
          message: "User not found",
        };
      }
      return {
        status: 200,
        success: true,
        message: "User profile fetched",
        user,
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