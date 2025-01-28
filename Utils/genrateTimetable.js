const { prisma } = require("../db/connectDB");

async function generateTimetable(
    workingDays,
    lecturesPerDay,
    totalTeachers,
    teachers,
    maxLecturesPerDayPerTeacher,
    maxLecturesPerWeekPerTeacher,
    totalTeachers,
    timetableId
) {
    console.log(workingDays, lecturesPerDay, teachers, maxLecturesPerDayPerTeacher, maxLecturesPerWeekPerTeacher, timetableId);
    
  try {
    if (!Array.isArray(teachers)) {
      return { status: 400, message: "Teachers must be an array", success: false };
    }

    let existingTimetable;
    if (timetableId) {
      existingTimetable = await prisma.timetable.findUnique({
        where: { id: timetableId },
      });
    }

    // Initialize teacher lecture counts
    const teacherLectureCount = teachers.reduce((acc, teacher) => {
      acc[teacher.userid] = { weekly: 0 };
      return acc;
    }, {});

    // Process existing timetable entries to update counts
    if (existingTimetable?.timetable) {
      existingTimetable.timetable.forEach((entry) => {
        const userId = entry.userid;
        if (teacherLectureCount[userId]) {
          teacherLectureCount[userId].weekly += 1;
        }
      });
    }

    // Initialize timetable structure
    const timetable = Array.from({ length: workingDays }, () =>
      Array(lecturesPerDay).fill(null)
    );

    // Merge existing entries into the timetable
    if (existingTimetable?.timetable) {
      existingTimetable.timetable.forEach((entry) => {
        const dayIndex = entry.day - 1;
        const lectureIndex = entry.lecture - 1;
        if (
          dayIndex >= 0 &&
          dayIndex < workingDays &&
          lectureIndex >= 0 &&
          lectureIndex < lecturesPerDay
        ) {
          timetable[dayIndex][lectureIndex] = entry;
        }
      });
    }

    // Fill remaining slots
    for (let day = 0; day < workingDays; day++) {
      const currentDay = day + 1;
      const dailyCounts = teachers.reduce((acc, teacher) => {
        acc[teacher.userid] = 0;
        return acc;
      }, {});

      // Update daily counts from existing entries for this day
      if (existingTimetable?.timetable) {
        existingTimetable.timetable.forEach((entry) => {
          if (entry.day === currentDay) {
            const userId = entry.userid;
            if (dailyCounts[userId] !== undefined) {
              dailyCounts[userId] += 1;
            }
          }
        });
      }

      for (let lecture = 0; lecture < lecturesPerDay; lecture++) {
        if (timetable[day][lecture] !== null) continue;

        let attempts = 0;
        let assigned = false;
        const currentLecture = lecture + 1;

        while (!assigned && attempts < teachers.length * 2) {
          attempts++;
          const teacher = teachers[Math.floor(Math.random() * teachers.length)];
          const userId = teacher.userid;

          if (
            teacherLectureCount[userId].weekly >= maxLecturesPerWeekPerTeacher ||
            dailyCounts[userId] >= maxLecturesPerDayPerTeacher ||
            !teacher.subjects?.length
          ) {
            continue;
          }

          // Assign teacher and subject
          timetable[day][lecture] = {
            day: currentDay,
            lecture: currentLecture,
            teacher: teacher.teacherName,
            subject: teacher.subjects[Math.floor(Math.random() * teacher.subjects.length)],
            userid: userId,
          };

          teacherLectureCount[userId].weekly += 1;
          dailyCounts[userId] += 1;
          assigned = true;
        }

        if (!assigned) {
          return {
            status: 500,
            message: `Could not assign teacher for Day ${currentDay}, Lecture ${currentLecture}. Constraints may be too tight.`,
            success: false,
          };
        }
      }
    }

    // Flatten the timetable for response
    const flatTimetable = timetable.flat().map((entry, index) => ({
      ...entry,
      id: existingTimetable?.timetable?.[index]?.id || undefined,
    }));

    return {
      status: 200,
      message: "Timetable generated successfully",
      success: true,
      timetable: flatTimetable,
    };
  } catch (error) {
    console.error("Error generating timetable:", error);
    return { status: 500, message: "Unable to generate timetable", success: false };
  }
}

module.exports = { generateTimetable };