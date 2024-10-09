const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    myTimeTable:{
        type:Array,
        default:[]
    },
    timetabe:{
        type:Array,
        default:[]
    },
    refreshToken:{
        type:String,
        required:true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },



});

module.exports = mongoose.model('User', UserSchema);