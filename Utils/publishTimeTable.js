const User = require('../Schema/UserSchema'); 

 const publishTimetable = async (timetable) => {
  try {
    // Loop through the timetable by day
    for (const dayLectures of timetable) {
      // Loop through each lecture in a day
      for (const lecture of dayLectures) {
        const { day, lecture: lectureNumber, subject, userId } = lecture;

        // Find the teacher by their userId
        const teacher = await User.findOne({ userId });

        if (!teacher) {
          return {
            success: false,
            message: `Teacher with userId ${userId} not found`
          };
        }

        // Format the lecture object for the teacher's timetable
        const formattedLecture = {
          day,
          lecture: lectureNumber,
          subject
        };
        // console.log(formattedLecture);
        

        // Initialize myTimetable if it doesn't exist
        if (!teacher.myTimeTable) {
          teacher.myTimeTable = [];
        }

        // Ensure we have the correct number of days in the timetable
        if (!teacher.myTimeTable[day - 1]) {
          teacher.myTimeTable[day - 1] = [];
        }

        // Add the formatted lecture to the correct day
        teacher.myTimeTable[day - 1].push(formattedLecture);

        // Save the updated teacher document
        await teacher.save();
      }
    }

    return {
      success: true,
      message: 'Timetable published successfully'
    };
  } catch (error) {
    return {
      success: false,
      message: `Error occurred: ${error.message}`
    };
  }
};

module.exports = {
    publishTimetable
}

