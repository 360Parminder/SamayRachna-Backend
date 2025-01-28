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

    // Iterate over each lecture in the timetable
    for (const lecture of timetable.timetable) {
      const { day, userid, lecture: lectureNumber, subject } = lecture;

      let teacherTimetable = await prisma.teacherTimetable.findFirst({
        where: { userId: userid },
      });

      if (!teacherTimetable) {
        teacherTimetable = await prisma.teacherTimetable.create({
          data: {
            userId: userid,
            timetable: [],
          },
        });
      }

      // Ensure the timetable has enough days
      const currentTimetable = teacherTimetable.timetable;
      while (currentTimetable.length < day) {
        currentTimetable.push([]);
      }

      // Add the lecture to the correct day
      currentTimetable[day - 1].push({
        day,
        lecture: lectureNumber,
        subject,
      });

      // Save the updated timetable back to the database
      await prisma.teacherTimetable.update({
        where: { id: teacherTimetable.id },
        data: { timetable: currentTimetable },
      });
    }

    // Set all other timetables to inactive
    await prisma.timetable.updateMany({
      where: { id: { not: id } },
      data: { status: false },
    });

    // Set the current timetable to active
    await prisma.timetable.update({
      where: { id },
      data: { status: true },
    });

    return { success: true };
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