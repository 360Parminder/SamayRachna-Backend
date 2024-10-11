
const { TimeTable, PublishTimetable } = require("../Controllers/Timetable");
const user_auth = require("../Middleware/userAuth");
const router = require("express").Router();

router.post("/timetable",user_auth, TimeTable);
router.post("/publishtimetable",user_auth, PublishTimetable);

module.exports = router;