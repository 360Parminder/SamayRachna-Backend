const { generateTimetable } = require("../Utils/genrateTimetable");
const User = require("../Schema/UserSchema");
const { publishTimetable } = require("../Utils/publishTimeTable");
const { prisma } = require("../db/connectDB");
const { generatePDF } = require("../Utils/generatepdf");
const { uploadToCloudinary } = require("../Utils/cloudinary");


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
      timetableId
    } = req.body;
    console.log(req.body);
    

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
      totalTeachers,
      timetableId
    );
  console.log("generatedTimetable",generatedTimetable);
  
    
    if (!generatedTimetable.success) {
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
        timetable: generatedTimetable.timetable, // Save the timetable as a JSON object
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
      message: error.message||"Unable to generate timetable",
    }
  }
};
const publishTimeTable = async (req, res) => {
  const { id } = req.body;
  console.log("id",id);
  
  if (!id) {
    return {
      status: 400,
      success: false,
      message: "unable to get Timetable"
    }
  }
  try {
    const publishStatus = await publishTimetable(id)
    if (publishStatus.success) {
      return {
        status:200,
        success: true,
        message: 'Timetable published successfully',
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
      message: error.message||"Unable to publish timetable",
    }

  }

};
const getAllTimetables = async (req, res) => {
  try {
    const timetables = await prisma.timetable.findMany({
      where: {
        userId: req.user.userid,
      },
    });
    return {
      status: 200,
      success: true,
      timetables,
    }
  } catch (error) {
    return {
      status: 500,
      success: false,
      message: error.message||"Unable to get timetables",
    }
  }
};
const downloadTimetable = async (req, res) => {
  const { id } = req.query;
  if (!id) {
    return {
      status: 400,
      success: false,
      message: "Please provide a timetable ID",
    };
  }
  try {
    const timetable = await prisma.timetable.findUnique({
      where: {
        id,
      },
    });
    if (!timetable) {
      return {
        status: 404,
        success: false,
        message: "Timetable not found",
      };
    }
    const {filePath }= generatePDF(timetable);
    if (!filePath) {
      return {
        status: 500,
        success: false,
        message: "Unable to generate PDF",
      };
      
    }
    const downloadUrl = await uploadToCloudinary(filePath);
    if (!downloadUrl) {
      return {
        status: 500,
        success: false,
        message: "Unable to upload to Cloudinary",
      };
    }
    return {
      status: 200,
      success: true,
      downloadUrl,
    };
  } catch (error) {
    return {
      status: 500,
      success: false,
      message: error.message,
    };
  }
}

module.exports = {
  configureTimetableAndGenerate,
  publishTimeTable,
  getAllTimetables,
  downloadTimetable
}