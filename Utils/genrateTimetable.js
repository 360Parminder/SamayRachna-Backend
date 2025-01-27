
const { prisma } = require("../db/connectDB");



// };
async function generateTimetable(workingDays, lecturesPerDay, teachers, maxLecturesPerDayPerTeacher, maxLecturesPerWeekPerTeacher, totalTeachers, timetableId) {
    try {
        // Check if teachers is an array
        if (!Array.isArray(teachers)) {
            return {
                status: 400,
                message: "Teachers must be an array",
            }
        }
        let existingTimetable;
        // Fetch existing timetable from DB using Prisma
        if (timetableId) {
            existingTimetable = await prisma.timetable.findUnique({
                where: {
                    id: timetableId,
                },
            });
        }

        if (!existingTimetable) {
            existingTimetable = {
                timetable: [
                    {
                        day: 1,
                        lecture: 1,
                        teacher: "teacherName",
                        subject: "subject",
                        userid: "userid"

                    }

                ],
            };
        }


        // Initialize an empty timetable
        const timetable = [];
        for (let i = 0; i < workingDays; i++) {
            timetable.push(Array(lecturesPerDay).fill(null)); // Each day has 'lecturesPerDay' slots
        }


        // Track the number of lectures assigned to each teacher
        const teacherLectureCount = teachers.reduce((acc, teacher) => {
            acc[teacher.userid] = { daily: 0, weekly: 0 };
            return acc;
        }, {});

        // Randomly assign lectures to teachers
        for (let day = 0; day < workingDays; day++) {
            for (let lecture = 0; lecture < lecturesPerDay; lecture++) {
                let assigned = false;
                while (!assigned) {
                    const randomTeacherIndex = Math.floor(Math.random() * totalTeachers);
                    const teacher = teachers[randomTeacherIndex];

                    // Check if the teacher has remaining lectures for the day and week
                    if (teacherLectureCount[teacher.userid].daily < maxLecturesPerDayPerTeacher && teacherLectureCount[teacher.userid].weekly < maxLecturesPerWeekPerTeacher) {

                        // Check for clashes with existing timetable
                        const existingLecture = existingTimetable.timetable[day][lecture];

                        if (existingLecture && existingLecture.userid === teacher.userid) {
                            continue; // Skip if there's a clash
                        }
                        // Assign the teacher's subject randomly for the lecture
                        const subjectIndex = Math.floor(Math.random() * teacher.subjects.length);
                        const subject = teacher.subjects[subjectIndex];
                        // Assign the subject to the timetable
                        timetable[day][lecture] = {
                            day: day + 1,
                            lecture: lecture + 1,
                            teacher: teacher.teacherName,
                            subject: subject,
                            userid: teacher.userid
                        };

                        // Update the teacher's lecture count
                        teacherLectureCount[teacher.userid].daily += 1;
                        teacherLectureCount[teacher.userid].weekly += 1;
                        assigned = true;
                    }
                }
            }

            // Reset daily count for each teacher after each day
            Object.keys(teacherLectureCount).forEach(teacher => {
                teacherLectureCount[teacher].daily = 0;
            });
        }
        console.log("timetable", timetable);


        return {
            status: 200,
            message: "Timetable generated successfully",
            success: true,
            timetable,
        };
    } catch (error) {
        console.log(error.message);

        return {
            status: 500,
            message: "Unable to generate timetable",
            success: false,
        }
    }
}
module.exports = {
    generateTimetable
}