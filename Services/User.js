
const User = require("../Schema/UserSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');
const generateTokens = require("../Utils/genrateTokens");
const client = require('../db/databasepg');
const { query } = require("express");
const { prisma } = require("../db/connectDB");
const { uploadToCloudinary, uploadImage } = require("../Utils/cloudinary");

// Register a new user
const registerUser = async (req, res) => {
  const { name, email, password, role, mobile, department, mySubjects, gender } = req.body;
  console.log(req.body);
  
const file = req.file;
console.log(file);

  // console.log(req.body);
  
  try {
    // Check if all required fields are provided
    if (!name || !email || !password || !mobile) {
      return {
        status: 400,
        message: "Please provide all required fields",
      }
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });
    if (existingUser) {
      return {
        status: 400,
        message: "User already exists",
      };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
 const { path: filePath, originalname: fileName } = req.file;
    const imagePath = await uploadImage(filePath, fileName);


    // Create a new user
    const user = await prisma.user.create({
      data: {
        userid: uuidv4(),
        name: name,
        email: email,
        password: hashedPassword,
        isadmin: false,
        role: role || "teacher", // Default to "teacher" if role is not provided
        mobile: mobile,
        department: department || "Management", // Default to "Management" if department is not provided
        mySubjects: mySubjects,
        gender: gender,
        profilePic: imagePath.url,
      },
    });

    // Return success response
    return {
      status: 200,
      success: true,
      message: "User registered",
      user,
    }
  } catch (error) {
    console.error("Registration Error:", error);
    return {
      status: 400,
      message: error.message,
    }
  }
};


const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    if (!user) {
      return { status: 400, message: "User not found" };
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return { status: 400, message: "Password is incorrect" };
    }
    const { accessToken, refreshToken } = await generateTokens(user);
    return {
      status: 200,
      success: true,
      message: "User logged in",
      accessToken,
    };
  } catch (error) {
    console.error("Login error:", error);
    return { status: 400, message: error.message };
  }
};

const userProfile = async (req, res) => {
  try {
    const userId = req.user?.userid;
    if (!userId) {
      return {
        success: false,
        status: 400,
        message: "User not found",
      };
    }

    // Fetch user and timetable data
    const user = await prisma.user.findUnique({
      where: { userid: userId },
      include: {
        mytimetable: {
          select: {
            timetable: true, // Fetch only the timetable JSON
          },
        },
      },
    });

    if (!user) {
      return {
        success: false,
        status: 400,
        message: "User not found",
      };
    }

    return {
      status: 200,
      success: true,
      message: "User profile fetched",
      user,
      timetable: user.mytimetable.map((t) => t.timetable), // Extract timetable JSONs
    };
  } catch (error) {
    console.error("Profile Error:", error);
    return {
      status: 400,
      message: error.message,
    };
  }
};


const getallUser = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const users = await prisma.user.findMany({
      skip: (page - 1) * limit,
      take: Number(limit),
      select: {
        userid: true,
        name: true,
        role: true,
        department: true,
        mySubjects: true,
        mobile: true,
        email: true,
        myClasses: true,
      }
    });
    const totalUsers = await prisma.user.count();
    return {
      status: 200,
      success: true,
      message: "Users fetched",
      allTeachers: users,
      totalPages: Math.ceil(totalUsers / limit),
    };
  } catch (error) {
    console.error("Get all users error:", error);
    return { status: 400, message: error.message };
  }
};
const changePassword = async(req, res) => {
  const { email} = req.user;
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    if (!user) {
      return { status: 400, message: "User not found" };
    }
    const isPasswordMatched = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatched) {
      return { status: 400, message: "Password is incorrect" };
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email: email },
      data: {
        password: hashedPassword,
      },
    });
    const { accessToken, refreshToken } = await generateTokens(user);
    return {
      status: 200,
      success: true,
      message: "Password changed",
      accessToken,
    };
  } catch (error) {
    console.error("Login error:", error);
    return { status: 400, message: error.message };
  }
}


module.exports = {
  registerUser,
  loginUser,
  userProfile,
  getallUser,
  changePassword
};