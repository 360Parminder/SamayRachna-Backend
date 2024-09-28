
const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
    timeTableTitle: {
        type: String,
        required: true,
    },
    
   
});

module.exports = mongoose.model('timetable', timetableSchema);