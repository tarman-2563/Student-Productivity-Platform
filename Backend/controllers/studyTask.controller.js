const StudyTask=require("../models/studyTaskSchema");

const createStudyTask=async(req,res)=>{
    try{
        const {title,subject,scheduledFor,duration,priority}=req.body;
        if(!title || !subject || !scheduledFor || !duration){
            return res.status(400).json({message:"Missing required fields"});
        }
        const today=new Date();
        today.setHours(0,0,0,0);
        const scheduledDate=new Date(scheduledFor);
        scheduledDate.setHours(0,0,0,0);

        if(scheduledDate<today){
            return res.status(400).json({message:"Scheduled date cannot be in the past"});
        }
        const newTask=await StudyTask.create({
            userId:req.user.id,
            title,
            subject,
            scheduledFor:scheduledDate,
            duration,
            priority
        })
        res.status(201).json({message:"Study task created successfully",task:newTask});
    }
    catch(err){
        res.status(500).json({message:"Internal Server Error"});
    }
}

const getDailyTasks=async(req,res)=>{
    try{
        const {date}=req.query;
        if(!date){
            return res.status(400).json({message:"Date is required"});
        }

        const start=new Date(date);
        start.setHours(0,0,0,0);
        const end=new Date(date);
        end.setHours(23,59,59,999);

        const tasks=await StudyTask.find({
            userId:req.user.id,
            scheduledFor:{$gte:start,$lte:end}
        }).sort({priority:-1});

        const priorityWeight={low:1,medium:1.5,high:2};

        const totalMinutes=tasks.reduce((acc,task)=>acc+task.duration,0);

        const weightedSum=tasks.reduce((acc,task)=>acc+task.duration*priorityWeight[task.priority.toLowerCase()],0);

        res.status(200).json({
            tasks,
            totalMinutes,
            weightedSum
        })
    }
    catch(err){
        res.status(500).json({message:"Internal Server Error"});
    }
}

const updateStudyTask=async(req,res)=>{
    try{
        const taskId=req.params.id;
        const userId=req.user.id;
        const task=await StudyTask.findOne({_id:taskId,userId});
        if(!task){
            return res.status(404).json({message:"Task not found"});
        }
        if(task.status==="Completed"){
            return res.status(400).json({message:"Completed tasks cannot be updated"});
        }
        Object.assign(task,req.body);
        await task.save();
        res.status(200).json({message:"Task updated successfully",task});
    }
    catch(err){
        res.status(500).json({message:"Internal Server Error"});
    }
}

const deleteStudyTask=async(req,res)=>{
    try{
        const taskId=req.params.id;
        const userId=req.user.id;
        const task=await StudyTask.findOne({
            _id:taskId,
            userId
        })
        if(!task){
            return res.status(404).json({message:"Task not found"});
        }
        if(task.status==="Completed"){
            return res.status(400).json({message:"Completed tasks cannot be deleted"});
        }
        await task.deleteOne();
        res.status(200).json({message:"Task deleted successfully"});
    }
    catch(err){
        res.status(500).json({message:"Internal Server Error"});
    }
}

const markTaskAsCompleted=async(req,res)=>{
    try{
        const taskId=req.params.id;
        const userId=req.user.id;
        const task=await StudyTask.findOne({
            _id:taskId,
            userId
        })
        if(!task){
            return res.status(404).json({message:"Task not found"});
        }
        if(task.status==="Completed"){
            return res.status(400).json({message:"Task is already completed"});
        }

        task.status="Completed";
        task.completedAt=new Date();
        task.actualDuration=req.body.actualDuration || task.duration;

        await task.save();
        res.status(200).json({message:"Task marked as completed",task});
    }
    catch(err){
        res.status(500).json({message:"Internal Server Error"});
    }
}

module.exports={
    createStudyTask,
    getDailyTasks,
    updateStudyTask,
    deleteStudyTask,
    markTaskAsCompleted
}
