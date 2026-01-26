const Goal=require("../models/goalSchema");
const {validationResult}=require("express-validator");
const mongoose=require("mongoose");

const createGoal=async(req,res)=>{
    try{
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({message:"Validation failed",errors:errors.array()});
        }
        const {title,description,category,priority,targetDate,milestones,tags}=req.body;
        const newGoal=await Goal.create({
            userId:req.user.id,
            title,
            description,
            category,
            priority,
            targetDate,
            milestones:milestones || [],
            tags:tags || []
        });
        res.status(201).json({message:"Goal created successfully",goal:newGoal});
    }
    catch(err){
        console.error("Create goal error:", err);
        res.status(500).json({message:"Internal Server Error"});
    }
};

const getGoals=async(req,res)=>{
    try{
        const {status,category,priority}=req.query;
        const filter={userId:req.user.id};
        if(status) filter.status=status;
        if(category) filter.category=category;
        if(priority) filter.priority=priority;
        const goals=await Goal.find(filter).sort({createdAt:-1});
        res.status(200).json({goals,count:goals.length});
    }
    catch(err){
        console.error("Get goals error:", err);
        res.status(500).json({message:"Internal Server Error"});
    }
};

const getGoalById=async(req,res)=>{
    try{
        const goalId=req.params.id;
        const goal=await Goal.findOne({_id:goalId,userId:req.user.id});
        if(!goal){
            return res.status(404).json({message:"Goal not found"});
        }
        res.status(200).json({goal});
    }
    catch(err){
        console.error("Get goal by ID error:", err);
        res.status(500).json({message:"Internal Server Error"});
    }
};

const updateGoal=async(req,res)=>{
    try{
        const goalId=req.params.id;
        const goal=await Goal.findOne({_id:goalId,userId:req.user.id});
        if(!goal){
            return res.status(404).json({message:"Goal not found"});
        }
        Object.assign(goal,req.body);
        if(req.body.milestones){
            goal.updateProgress();
        }
        await goal.save();
        res.status(200).json({message:"Goal updated successfully",goal});
    }
    catch(err){
        console.error("Update goal error:", err);
        res.status(500).json({message:"Internal Server Error"});
    }
};

const deleteGoal=async(req,res)=>{
    try{
        const goalId=req.params.id;
        const goal=await Goal.findOne({_id:goalId,userId:req.user.id});
        if(!goal){
            return res.status(404).json({message:"Goal not found"});
        }
        await goal.deleteOne();
        res.status(200).json({message:"Goal deleted successfully"});
    }
    catch(err){
        console.error("Delete goal error:", err);
        res.status(500).json({message:"Internal Server Error"});
    }
};

const updateMilestone=async(req,res)=>{
    try{
        const {goalId,milestoneId}=req.params;
        const {completed}=req.body;
        const goal=await Goal.findOne({_id:goalId,userId:req.user.id});
        if(!goal){
            return res.status(404).json({message:"Goal not found"});
        }
        const milestone=goal.milestones.id(milestoneId);
        if(!milestone){
            return res.status(404).json({message:"Milestone not found"});
        }
        milestone.completed=completed;
        if(completed){
            milestone.completedAt=new Date();
        }else{
            milestone.completedAt=null;
        }
        goal.updateProgress();
        await goal.save();
        res.status(200).json({message:"Milestone updated successfully",goal});
    }
    catch(err){
        console.error("Update milestone error:", err);
        res.status(500).json({message:"Internal Server Error"});
    }
};

const getGoalStats=async(req,res)=>{
    try{
        const userId=req.user.id;
        const stats=await Goal.aggregate([
            {$match:{userId:new mongoose.Types.ObjectId(userId)}},
            {
                $group:{
                    _id:null,
                    totalGoals:{$sum:1},
                    completedGoals:{$sum:{$cond:[{$eq:["$status","completed"]},1,0]}},
                    activeGoals:{$sum:{$cond:[{$eq:["$status","active"]},1,0]}},
                    averageProgress:{$avg:"$progress"},
                    overdueGoals:{
                        $sum:{
                            $cond:[
                                {
                                    $and:[
                                        {$eq:["$status","active"]},
                                        {$lt:["$targetDate",new Date()]}
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    }
                }
            }
        ]);
        const result=stats[0] || {
            totalGoals:0,
            completedGoals:0,
            activeGoals:0,
            averageProgress:0,
            overdueGoals:0
        };
        res.status(200).json({stats:result});
    }
    catch(err){
        console.error("Get goal stats error:", err);
        res.status(500).json({message:"Internal Server Error"});
    }
};

const addProgressLog=async(req,res)=>{
    try{
        const goalId=req.params.id;
        const {description,timeSpent,newProgress,mood}=req.body;
        
        if(!description || description.trim().length===0){
            return res.status(400).json({message:"Progress description is required"});
        }
        
        const goal=await Goal.findOne({_id:goalId,userId:req.user.id});
        if(!goal){
            return res.status(404).json({message:"Goal not found"});
        }
        
        if(goal.status==='completed'){
            return res.status(400).json({message:"Cannot add progress to completed goal"});
        }
        
        const progressLog=goal.addProgressLog(
            description.trim(),
            timeSpent || 0,
            newProgress,
            mood || 'neutral'
        );
        
        await goal.save();
        
        res.status(201).json({
            message:"Progress log added successfully",
            goal,
            progressLog
        });
    }
    catch(err){
        console.error("Add progress log error:", err);
        res.status(500).json({message:"Internal Server Error"});
    }
};

module.exports={
    createGoal,
    getGoals,
    getGoalById,
    updateGoal,
    deleteGoal,
    updateMilestone,
    getGoalStats,
    addProgressLog
};