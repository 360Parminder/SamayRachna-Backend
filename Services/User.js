
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
      const userTimetable = [
        [
            {
                "day": 1,
                "lecture": 1,
                
                "subject": "English",
            
            },
            {
                "day": 1,
                "lecture": 2,
               
                "subject": "Geography",
                
            },
            {
                "day": 1,
                "lecture": 3,
              
                "subject": "Physics",
               
            },
            {
                "day": 1,
                "lecture": 4,
               
                "subject": "History",
                
            },
            {
                "day": 1,
                "lecture": 5,
               
                "subject": "Geography",
                
            }
        ],
        [
            {
                "day": 2,
                "lecture": 1,
                
                "subject": "Biology",
               
            },
            {
                "day": 2,
                "lecture": 2,
              
                "subject": "English",
               
            },
            {
                "day": 2,
                "lecture": 3,
                
                "subject": "Biology",
               
            },
            {
                "day": 2,
                "lecture": 4,
               
                "subject": "Physics",
               
            },
            {
                "day": 2,
                "lecture": 5,
               
                "subject": "History",
                
            }
        ],
        [
            {
                "day": 3,
                "lecture": 1,
              
                "subject": "English",
               
            },
            {
                "day": 3,
                "lecture": 2,
              
                "subject": "Art",
               
            },
            {
                "day": 3,
                "lecture": 3,
              
                "subject": "Math",
               
            },
            {
                "day": 3,
                "lecture": 4,
                
                "subject": "Biology",
               
            },
            {
                "day": 3,
                "lecture": 5,
              
                "subject": "Art",
               
            }
        ],
        [
            {
                "day": 4,
                "lecture": 1,
                
                "subject": "Biology",
               
            },
            {
                "day": 4,
                "lecture": 2,
              
                "subject": "Art",
               
            },
            {
                "day": 4,
                "lecture": 3,
               
                "subject": "Geography",
                
            },
            {
                "day": 4,
                "lecture": 4,
              
                "subject": "Physics",
               
            },
            {
                "day": 4,
                "lecture": 5,
              
                "subject": "Math",
               
            }
        ],
        [
            {
                "day": 5,
                "lecture": 1,
              
                "subject": "Art",
               
            },
            {
                "day": 5,
                "lecture": 2,
               
                "subject": "History",
                
            },
            {
                "day": 5,
                "lecture": 3,
               
                "subject": "Geography",
                
            },
            {
                "day": 5,
                "lecture": 4,
              
                "subject": "Math",
               
            },
            {
                "day": 5,
                "lecture": 5,
              
                "subject": "Art",
               
            }
        ],
        [
            {
                "day": 6,
                "lecture": 1,
               
                "subject": "Geography",
                
            },
            {
                "day": 6,
                "lecture": 2,
                
                "subject": "Chemistry",
               
            },
            {
                "day": 6,
                "lecture": 3,
              
                "subject": "Math",
               
            },
            {
                "day": 6,
                "lecture": 4,
              
                "subject": "Math",
               
            },
            {
                "day": 6,
                "lecture": 5,
              
                "subject": "Art",
               
            }
        ]
    ]
  
      const user = await User.create({
        userId: uuidv4(),
        name:userName,
        email:userEmail,
        password: hashedPassword,
        isAdmin: false,
        myTimeTable:userTimetable
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
      const currentUser = await User.findOne({userId:user.userId}).select("-password, -refreshToken");
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
const getallUser = async(req,res)=>{
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