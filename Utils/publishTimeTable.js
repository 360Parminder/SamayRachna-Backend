const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const publishTimetable = async (timetable,id) => {
  try {
    // const { id, timetable } = timetableData;

    // Iterate through the timetable by day
    for (const dayLectures of timetable) {
      for (const lecture of dayLectures) {
        const { day, userId, lecture: lectureNumber, subject } = lecture;

        // Find the teacher by their userid
        const teacher = await prisma.user.findUnique({
          where: { userid: userId },
        });

        if (!teacher) {
          return {
            success: false,
            message: `Teacher with userid ${userId} not found`,
          };
        }

        // Retrieve or initialize the teacher's timetable
        const currentTimetable = teacher.mytimetable || [];

        // Ensure the timetable has the correct number of days
        while (currentTimetable.length < day) {
          currentTimetable.push([]);
        }

        // Add the lecture details to the appropriate day
        currentTimetable[day - 1].push({
          day,
          lecture: lectureNumber,
          subject,
        });

        // Update the teacher's timetable in the database
        await prisma.user.update({
          where: { userid: userId },
          data: { mytimetable: currentTimetable },
        });
      }
    }

    // Update the timetable's status to true
    await prisma.timetable.update({
      where: { id },
      data: { status: true },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: `Error occurred: ${error.message}`,
    };
  }
};

module.exports = {
  publishTimetable,
};
