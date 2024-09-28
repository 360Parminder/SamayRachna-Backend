
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

const generationConfig = {
    temperature: 2,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
};


const chatSession = model.startChat({
    generationConfig,

});


//  const generateTimetable = async (totalTeachers,workingDays, lecturesPerDay, teachers, maxLecturesPerDayPerTeacher, maxLecturesPerWeekPerTeacher) => {

//   const result = await chatSession.sendMessage(
//    `Generate a detailed school timetable for ${workingDays} working days (excluding Sunday), ${lecturesPerDay} lectures per day, with ${totalTeachers} teachers, each limited to ${maxLecturesPerDayPerTeacher} lectures per day and ${maxLecturesPerWeekPerTeacher} lectures per week. Use the following teachers and subjects: ${teachers}, ensuring a balanced subject distribution across all days, while adhering to the constraints for each teacher.` );

//   // console.log(result.response.text());
//   const data = JSON.parse(result.response.text());
//   console.log(result.response.text());

//    return data.timetable;





// };
function generateTimetable(workingDays,
    lecturesPerDay,
    teachers,
    maxLecturesPerDayPerTeacher,
    maxLecturesPerWeekPerTeacher,
    totalTeachers) {

    try {
        // Check if teachers is an array
        if (!Array.isArray(teachers)) {
            throw new Error("Expected 'teachers' to be an array");
        }

        // Initialize an empty timetable
        const timetable = [];
        for (let i = 0; i < workingDays; i++) {
            timetable.push(Array(lecturesPerDay).fill(null)); // Each day has 'lecturesPerDay' slots
        }

        // Track the number of lectures assigned to each teacher
        const teacherLectureCount = teachers.reduce((acc, teacher) => {
            acc[teacher.teacherName] = { daily: 0, weekly: 0 };
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
                    if (teacherLectureCount[teacher.teacherName].daily < maxLecturesPerDayPerTeacher &&
                        teacherLectureCount[teacher.teacherName].weekly < maxLecturesPerWeekPerTeacher) {

                        // Assign the teacher's subject randomly for the lecture
                        const subjectIndex = Math.floor(Math.random() * teacher.subjects.length);
                        const subject = teacher.subjects[subjectIndex];

                        // Assign the subject to the timetable
                        timetable[day][lecture] = {
                            day: day + 1,
                            lecture: lecture + 1,
                            teacher: teacher.teacherName,
                            subject: subject
                        };

                        // Update the teacher's lecture count
                        teacherLectureCount[teacher.teacherName].daily += 1;
                        teacherLectureCount[teacher.teacherName].weekly += 1;

                        assigned = true;
                    }
                }
            }

            // Reset daily count for each teacher after each day
            Object.keys(teacherLectureCount).forEach(teacher => {
                teacherLectureCount[teacher].daily = 0;
            });
        }

        return timetable;
    } catch (error) {
    return error;
}
}
module.exports = {
    generateTimetable
}