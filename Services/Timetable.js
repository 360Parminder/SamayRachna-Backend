const { generateTimetable } = require("../Utils/genrateTimetable");
const User = require("../Schema/UserSchema");


const configureTimetableAndGenerate = async(req, res) => { 
  const user = req.user
    const {
      workingDays,
      lecturesPerDay,
      totalTeachers,
      maxLecturesPerDayPerTeacher,
      maxLecturesPerWeekPerTeacher,
      teachers
    } = req.body;

    // Check if all the required fields are present in the request body
    if (!workingDays || !lecturesPerDay || !teachers || teachers.length === 0) {
      return res.status(400).json({ message: "Invalid input data" });
    }
  
    // Generate the timetable using the function
    const generatedTimetable = await generateTimetable(
      workingDays,
      lecturesPerDay,
      teachers,
      maxLecturesPerDayPerTeacher,
      maxLecturesPerWeekPerTeacher,
      totalTeachers

    );
    if (generateTimetable) {
        const currentUser = await User.findById({_id:user._id});
        if (!currentUser) {
            return {
              status: 400,
              message: "User not found",
            };
          }
       
        const userTimetable = await User.findByIdAndUpdate({_id:user._id},{
            timetabe:generatedTimetable
        })
        return {
            success: true,
          message: "Timetable generated successfully",
          timetable: userTimetable
        };
    }
    
  };
  
  module.exports={
    configureTimetableAndGenerate
  }