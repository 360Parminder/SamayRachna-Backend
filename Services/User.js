
const User = require("../Schema/UserSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');
const generateTokens = require("../Utils/genrateTokens");
const client = require('../db/databasepg');
const { query } = require("express");

// Register a new user
const registerUser = async (req, res) => {
  const { userName, userEmail, password,role,phone } = req.body;
  try {

    // Check if user already exists
    const user = `SELECT * FROM users WHERE email = '${userEmail}';`;
    const userData = await client.query(user);
    if (userData.rows.length > 0) {
      return {
        success: false,
        message: "User already exists"
      }
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userQuery = `INSERT INTO users (userid, name, email, password, isadmin,role ,mobile)
                   VALUES ('${uuidv4()}', '${userName}', '${userEmail}', '${hashedPassword}', false,'${role?role:"teacher"}',${phone})
                   RETURNING name, email,mobile,role;`;
    const result = await client.query(userQuery);
    console.log(result.rows[0]);

    // Send success response
    return {
      success: true,
      message: "User registered successfully",
      data: result.rows[0]
    }
  } catch (error) {
    console.error("Registration Error:", error.message);
    return {
      success: false,
      message: error.message
    }
  } finally {
    client.end();
  }
};

const loginUser = async (req, res) => {
  const { userEmail, password } = req.body;
  
  try {
    const user = await client.query(`SELECT * FROM users WHERE email = '${userEmail}'`);
    
    if (user.rows.length === 0) {
      return {
        status: 400,
        message: "User not found",
      };
    }
    const isPasswordMatched = await bcrypt.compare(password, user.rows[0].password);
    if (!isPasswordMatched) {
      return {
        status: 400,
        message: "Password is incorrect",
      };
    }
    const { accessToken, refreshToken } = await generateTokens(user.rows[0])
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
  const user = req.user

  try {
    const currentUser = await user
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
const getallUser = async (req, res) => {
  try {
    const user = await User.find({}).select("-password -auth_key -myTimeTable -updatedAt -createdAt -refreshToken -timetable -__v");
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
}

module.exports = {
  registerUser,
  loginUser,
  userProfile,
  getallUser
};