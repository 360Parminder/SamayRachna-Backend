const { configureTimetableAndGenerate, publishTimeTable, getAllTimetables } = require("../Services/Timetable")



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
};
const GetAllTimetables = async (req, res) => {
 const data = await getAllTimetables(req,res);
 if(data.success){
     res.status(data.status).json(data);
 }
   else{
      res.status(data.status).json(data);
   }
};

module.exports={
    TimeTable,
    PublishTimetable,
      GetAllTimetables
}