
const { TimeTable, PublishTimetable, GetAllTimetables } = require("../Controllers/Timetable");
const user_auth = require("../Middleware/userAuth");
const router = require("express").Router();

router.post("/timetable",user_auth, TimeTable);
router.post("/publishtimetable",user_auth, PublishTimetable);
router.get("/gettimetables",user_auth, GetAllTimetables);

module.exports = router;