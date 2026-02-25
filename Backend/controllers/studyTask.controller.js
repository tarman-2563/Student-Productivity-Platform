const StudyTask=require("../models/studyTaskSchema");
const {DailyStats,StudySession}=require("../models/analyticsSchema");

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

        const dayStart=new Date(scheduledDate);
        dayStart.setHours(0,0,0,0);
        const dayEnd=new Date(scheduledDate);
        dayEnd.setHours(23,59,59,999);

        const tasksPlanned=await StudyTask.countDocuments({
            userId:req.user.id,
            scheduledFor:{$gte:dayStart,$lte:dayEnd}
        });

        await DailyStats.findOneAndUpdate(
            {
                userId:req.user.id,
                date:{$gte:dayStart,$lte:dayEnd}
            },
            {
                $setOnInsert:{
                    userId:req.user.id,
                    date:dayStart,
                    totalStudyTime:0,
                    tasksCompleted:0,
                    subjectBreakdown:[],
                    productivityScore:0,
                    streakCount:0
                },
                $set:{tasksPlanned}
            },
            {upsert:true}
        );

        res.status(201).json({message:"Study task created successfully",task:newTask});
    }
    catch(err){
        console.error("Create study task error:",err);
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

        const scheduledDate=task.scheduledFor;
        await task.deleteOne();

        const dayStart=new Date(scheduledDate);
        dayStart.setHours(0,0,0,0);
        const dayEnd=new Date(scheduledDate);
        dayEnd.setHours(23,59,59,999);

        const tasksPlanned=await StudyTask.countDocuments({
            userId,
            scheduledFor:{$gte:dayStart,$lte:dayEnd}
        });

        await DailyStats.findOneAndUpdate(
            {
                userId,
                date:{$gte:dayStart,$lte:dayEnd}
            },
            {$set:{tasksPlanned}},
            {upsert:false}
        );

        res.status(200).json({message:"Task deleted successfully"});
    }
    catch(err){
        console.error("Delete study task error:",err);
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

        const completedAt=new Date();
        const actualDuration=req.body.actualDuration || task.duration;
        
        task.status="Completed";
        task.completedAt=completedAt;
        task.actualDuration=actualDuration;

        await task.save();

        const startTime=new Date(completedAt.getTime()-actualDuration*60000);
        await StudySession.create({
            userId,
            taskId:task._id,
            subject:task.subject,
            startTime,
            endTime:completedAt,
            duration:actualDuration,
            plannedDuration:task.duration,
            focusRating:req.body.focusRating || 3,
            notes:req.body.notes || ""
        });

        const dayStart=new Date(completedAt);
        dayStart.setHours(0,0,0,0);
        const dayEnd=new Date(completedAt);
        dayEnd.setHours(23,59,59,999);

        let dailyStats=await DailyStats.findOne({
            userId,
            date:{$gte:dayStart,$lte:dayEnd}
        });

        if(!dailyStats){
            dailyStats=new DailyStats({
                userId,
                date:dayStart,
                totalStudyTime:0,
                tasksCompleted:0,
                tasksPlanned:0,
                subjectBreakdown:[],
                productivityScore:0,
                streakCount:0
            });
        }

        dailyStats.totalStudyTime+=actualDuration;
        dailyStats.tasksCompleted+=1;

        const subjectIndex=dailyStats.subjectBreakdown.findIndex(s=>s.subject===task.subject);
        if(subjectIndex>=0){
            dailyStats.subjectBreakdown[subjectIndex].timeSpent+=actualDuration;
        }else{
            dailyStats.subjectBreakdown.push({
                subject:task.subject,
                timeSpent:actualDuration
            });
        }

        const tasksToday=await StudyTask.countDocuments({
            userId,
            scheduledFor:{$gte:dayStart,$lte:dayEnd}
        });
        dailyStats.tasksPlanned=tasksToday;
        
        const completionRate=(dailyStats.tasksCompleted/tasksToday)*100;
        const timeEfficiency=Math.min(100,(task.duration/actualDuration)*100);
        const studyTimeScore=Math.min(100,(dailyStats.totalStudyTime/180)*100);
        
        dailyStats.productivityScore=Math.round(
            completionRate*0.4+
            timeEfficiency*0.3+
            studyTimeScore*0.3
        );

        const yesterday=new Date(dayStart);
        yesterday.setDate(yesterday.getDate()-1);
        const yesterdayStats=await DailyStats.findOne({
            userId,
            date:{
                $gte:new Date(yesterday.setHours(0,0,0,0)),
                $lte:new Date(yesterday.setHours(23,59,59,999))
            }
        });

        if(yesterdayStats){
            dailyStats.streakCount=yesterdayStats.streakCount+1;
        }else{
            dailyStats.streakCount=1;
        }

        await dailyStats.save();

        res.status(200).json({message:"Task marked as completed",task});
    }
    catch(err){
        console.error("Mark task as completed error:",err);
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
