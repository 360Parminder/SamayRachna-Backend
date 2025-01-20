const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const publishTimetable = async (id) => {
  try {
    const timetable = await prisma.timetable.findUnique({
      where: { id },
    });

    if (!timetable) {
      return {
        success: false,
        message: `Timetable with id ${id} not found`,
      };
    }

    // Iterate through the timetable by day
    for (const dayLectures of timetable.timetable) {
      for (const lecture of dayLectures) {
        const { day, userid, lecture: lectureNumber, subject } = lecture;

        // Find the teacher by their userid
        const teacher = await prisma.user.findUnique({
          where: { userid: userid },
        });

        if (!teacher) {
          return {
            success: false,
            message: `Teacher with userid ${userid} not found`,
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
          where: { userid: userid },
          data: { mytimetable: currentTimetable },
        });
      }
    }

    // Set the status of all other timetables to false
    await prisma.timetable.updateMany({
      where: {
        id: { not: id },
      },
      data: { status: false },
    });

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
