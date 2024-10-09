
const { TimeTable } = require("../Controllers/Timetable");
const user_auth = require("../Middleware/userAuth");
const router = require("express").Router();

router.post("/timetable",user_auth, TimeTable);

module.exports = router;