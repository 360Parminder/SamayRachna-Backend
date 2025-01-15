const { generateTimetable } = require("../Utils/genrateTimetable");
const User = require("../Schema/UserSchema");
const { publishTimetable } = require("../Utils/publishTimeTable");
const { prisma } = require("../db/connectDB");


const configureTimetableAndGenerate = async (req, res) => {
  try {
    const user = req.user;
    const {
      workingDays,
      lecturesPerDay,
      totalTeachers,
      maxLecturesPerDayPerTeacher,
      maxLecturesPerWeekPerTeacher,
      teachers,
      timetableName, // Name of the timetable from the request body
    } = req.body;

    if (!workingDays || !lecturesPerDay || !teachers || teachers.length === 0 || !timetableName) {
      return{
        success: false,
        message: "Please provide all required fields",
      }
    }

    const generatedTimetable = await generateTimetable(
      workingDays,
      lecturesPerDay,
      teachers,
      maxLecturesPerDayPerTeacher,
      maxLecturesPerWeekPerTeacher,
      totalTeachers
    );
    console.log("Generated Timetable:", generatedTimetable);
    

    if (!generatedTimetable) {
      return{
        success: false,
        message: "Unable to generate timetable",
      }
    }

    // Save timetable metadata to the database
    const savedTimetableMetadata = await prisma.timetable.create({
      data: {
        name: timetableName,
        userId: user.userid,
        timetable: generatedTimetable, // Save the timetable as a JSON object
        status: false, // Default status is "not in use"
      },
    });
    console.log("Timetable Metadata:", savedTimetableMetadata);
    

    return{
      success: true,
      message: "Timetable generated successfully",
      timetable: savedTimetableMetadata,
    }
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
const publishTimeTable = async (req, res) => {
  const { timetable } = req.body;
  console.log(timetable);

  if (!timetable) {
    return {
      success: false,
      message: "unable to get Timetable"
    }
  }
  try {
    const resp = await publishTimetable(timetable)
    if (resp.success) {
      return {
        success: true,
        message: "TimeTable Publised"
      }
    }
    else {
      return {
        success: false,
        message: "unable to publish Timetable"
      }
    }

  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "unable to publish Timetable"
    }

  }

}

module.exports = {
  configureTimetableAndGenerate,
  publishTimeTable
}