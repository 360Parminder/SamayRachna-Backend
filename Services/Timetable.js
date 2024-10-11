const { generateTimetable } = require("../Utils/genrateTimetable");
const User = require("../Schema/UserSchema");
const { publishTimetable } = require("../Utils/publishTimeTable");


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
      return{ message: "Invalid input data" };
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

    if (!generatedTimetable) {
      return{
        success: false,
        message: "Error generating timetable"
      }
    }

    const currentUser = await User.findByIdAndUpdate(user._id);
    if (!currentUser) {
      return{
        success: false,
        message: "User not found"
      }
    }

    currentUser.timetable.push(generatedTimetable);
    await currentUser.save();

    return{
      success: true,
      message: "Timetable generated and saved successfully",
      timetable:generatedTimetable, // Return the updated timetable array
    };

  } catch (error) {
    return { message: "Server error", error: error.message };
  }
};
const publishTimeTable = async(req,res)=>{
    const {timetable} = req.body;
    // console.log(timetable);
    
    if (!timetable) {
      return{
        success:false,
        message:"unable to get Timetable"
      }
    }
   try {
    const resp = await publishTimetable(timetable)
    if (resp.success) {
        return{
          success:true,
          message:"TimeTable Publised"
        }
    }
    else {
      return{
        success:false,
        message:"unable to publish Timetable"
      }
    }
    
   } catch (error) {
    console.log(error);
    return{
      success:false,
      message:"unable to publish Timetable"
    }
    
   }
    
}
  
  module.exports={
    configureTimetableAndGenerate,
    publishTimeTable
  }