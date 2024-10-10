const { generateTimetable } = require("../Utils/genrateTimetable");
const User = require("../Schema/UserSchema");


const configureTimetableAndGenerate = async (req, res) => {
  try {
    const user = req.user;
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

    // Ensure the timetable generation was successful
    if (!generatedTimetable) {
      return res.status(500).json({ message: "Error generating timetable" });
    }

    // Find the current user by their ID
    const currentUser = await User.findById(user._id);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add the generated timetable to the user's timetable array in the database
    currentUser.timetable.push(generatedTimetable);
    
    // Save the updated user document with the new timetable
    await currentUser.save();

    return res.status(200).json({
      success: true,
      message: "Timetable generated and saved successfully",
      timetable: currentUser.timetable, // Return the updated timetable array
    });

  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

  
  module.exports={
    configureTimetableAndGenerate
  }