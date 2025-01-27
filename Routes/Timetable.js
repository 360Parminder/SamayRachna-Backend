
const { TimeTable, PublishTimetable, GetAllTimetables, DownloadTimetable } = require("../Controllers/Timetable");
const user_auth = require("../Middleware/userAuth");
const router = require("express").Router();

router.post("/timetable",user_auth, TimeTable);
router.post("/publishtimetable",user_auth, PublishTimetable);
router.get("/gettimetables",user_auth, GetAllTimetables);
router.get("/downloadtimetable",user_auth, DownloadTimetable);

module.exports = router;