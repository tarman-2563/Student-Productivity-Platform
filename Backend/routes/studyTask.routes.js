const express=require("express");
const {createStudyTask,getDailyTasks,updateStudyTask,deleteStudyTask,markTaskAsCompleted}=require("../controllers/studyTask.controller");
const authMiddleware=require("../middleware/auth.middleware");

const studyTaskRouter=express.Router();

studyTaskRouter.use(authMiddleware);

studyTaskRouter.post("/",createStudyTask);
studyTaskRouter.get("/",getDailyTasks);
studyTaskRouter.patch("/:d",updateStudyTask);
studyTaskRouter.delete("/:id",deleteStudyTask);
studyTaskRouter.patch("/:id/complete",markTaskAsCompleted);

module.exports=studyTaskRouter;