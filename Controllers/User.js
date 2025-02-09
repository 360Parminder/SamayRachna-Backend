
const { registerUser, loginUser, userProfile, getallUser, changePassword } = require("../Services/User");

// Register a new user
const RegisterUser = async (req, res) => {
 const data = await registerUser(req, res);
 if (data.success) {
     res.status(200).json(data);
 }
 else {
     res.status(400).json(data);
 }
};  
const LoginUser = async (req, res) => {
    const data = await loginUser(req, res);
    if (data.success) {
        res.status(200).json(data);
    }
    else {
        res.status(400).json(data);
    }
};
const UserProfile = async (req, res) => {
    const data = await userProfile(req, res);
    if (data.success) {
        res.status(200).json(data);
    }
    else {
        res.status(400).json(data);
    }
};
const GetAllUser = async (req, res) => {
    const data = await getallUser(req, res);
    if (data.success) {
        res.status(200).json(data);
    }
    else {
        res.status(400).json(data);
    }
};
const ChangePassword = async (req, res) => {
    const data = await changePassword(req, res);
    if (data.success) {
        res.status(200).json(data);
    }
    else {
        res.status(400).json(data);
    }
};
module.exports = {
    RegisterUser,
    LoginUser,
    UserProfile,
    GetAllUser,
    ChangePassword
};
