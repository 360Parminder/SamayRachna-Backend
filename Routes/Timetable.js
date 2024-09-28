
const { TimeTable } = require("../Controllers/Timetable");
const router = require("express").Router();

router.post("/timetable", TimeTable);

module.exports = router;