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
        status: 400,
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
    if (!generatedTimetable) {
      return{
        status: 500,
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
    return{
      success: true,
      message: "Timetable generated successfully",
      timetable: savedTimetableMetadata,
    }
  } catch (error) {
    return{
      status: 500,
      success: false,
      message: "Unable to generate timetable",
    }
  }
};
const publishTimeTable = async (req, res) => {
  const { timetable,id } = req.body;
  console.log("timetable from body",timetable);

  if (!timetable) {
    return {
      status: 400,
      success: false,
      message: "unable to get Timetable"
    }
  }
  try {
    const publishStatus = await publishTimetable(timetable,id)
    if (publishStatus.success) {
      return {
        status:200,
        success: true,
        message: 'Timetable published successfully, and status updated to true',
      }
    }
    else {
      return {
        status: 400,
        success: false,
        message: "unable to publish Timetable"
      }
    }

  } catch (error) {
    console.log(error);
    return {
      status: 500,
      success: false,
      message: "unable to publish Timetable"+error.message
    }

  }

}

module.exports = {
  configureTimetableAndGenerate,
  publishTimeTable
}