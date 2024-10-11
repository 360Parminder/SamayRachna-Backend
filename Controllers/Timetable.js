const { configureTimetableAndGenerate, publishTimeTable } = require("../Services/Timetable")



const TimeTable = async(req, res) => {
   //  console.log("from controller",req.body);
     const data = await configureTimetableAndGenerate(req,res);
     if (data.success) {
        console.log("data",data);
        res.status(200).json(data);
     }
     else {
        res.status(400).json(data);
     }
}
const PublishTimetable = async(req,res)=>{
   //  console.log("from controller",req.body);
     const data = await publishTimeTable(req,res);
     if (data.success) {
        res.status(200).json(data);
     }
     else {
        res.status(400).json(data);
     }
}

module.exports={
    TimeTable,
    PublishTimetable
}