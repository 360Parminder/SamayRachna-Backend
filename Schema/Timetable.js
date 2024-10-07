
const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
    timeTableTitle: {
        type: String,
        required: true,
    },
    createdBy: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    timeTable:[] 

   
});

module.exports = mongoose.model('timetable', timetableSchema);