const express=require("express");
const {createStudyTask,getDailyTasks,updateStudyTask,deleteStudyTask,markTaskAsCompleted}=require("../controllers/studyTask.controller");

const studyTaskRouter=express.Router();

studyTaskRouter.post("/",createStudyTask);
studyTaskRouter.get("/",getDailyTasks);
studyTaskRouter.patch("/:d",updateStudyTask);
studyTaskRouter.delete("/:id",deleteStudyTask);
studyTaskRouter.patch("/:id/complete",markTaskAsCompleted);

module.exports=studyTaskRouter;