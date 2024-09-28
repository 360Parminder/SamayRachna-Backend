const { generateTimetable } = require("../Utils/genrateTimetable");



const configureTimetableAndGenerate = async(req, res) => {
    console.log("from service",req.body);
    
    const {
      workingDays,
      lecturesPerDay,
      totalTeachers,
      maxLecturesPerDayPerTeacher,
      maxLecturesPerWeekPerTeacher,
      teachers
    } = req.body;
//   console.log(teachers);
  
    // Validate input data
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
  
    // Respond with the generated timetable
    return {
        success: true,
      message: "Timetable generated successfully",
      timetable: generatedTimetable
    };
  };
  
  module.exports={
    configureTimetableAndGenerate
  }