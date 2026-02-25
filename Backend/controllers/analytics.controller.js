const {DailyStats,StudySession}=require("../models/analyticsSchema");
const Goal=require("../models/goalSchema");
const mongoose=require("mongoose");

const getAnalyticsData=async(req,res)=>{
    try{
        const userId=req.user.id;
        const endDate=new Date();
        const startDate=new Date();
        startDate.setDate(endDate.getDate()-7);
        
        const overview=await getOverviewStats(userId,startDate,endDate);
        const productivityTrends=await getProductivityTrends(userId,startDate,endDate);
        
        res.status(200).json({
            overview,
            productivityTrends,
            timeRange:'week',
            dateRange:{startDate,endDate}
        });
    }
    catch(err){
        console.error("Get analytics data error:", err);
        res.status(500).json({message:"Internal Server Error"});
    }
};

const getOverviewStats=async(userId,startDate,endDate)=>{
    const periodLength=endDate-startDate;
    const prevStartDate=new Date(startDate.getTime()-periodLength);
    const prevEndDate=new Date(startDate);
    
    const currentStats=await DailyStats.aggregate([
        {
            $match:{
                userId:new mongoose.Types.ObjectId(userId),
                date:{$gte:startDate,$lte:endDate}
            }
        },
        {
            $group:{
                _id:null,
                totalStudyTime:{$sum:"$totalStudyTime"},
                tasksCompleted:{$sum:"$tasksCompleted"},
                maxStreak:{$max:"$streakCount"}
            }
        }
    ]);
    
    const prevStats=await DailyStats.aggregate([
        {
            $match:{
                userId:new mongoose.Types.ObjectId(userId),
                date:{$gte:prevStartDate,$lte:prevEndDate}
            }
        },
        {
            $group:{
                _id:null,
                totalStudyTime:{$sum:"$totalStudyTime"}
            }
        }
    ]);
    
    const goalStats=await Goal.aggregate([
        {$match:{userId:new mongoose.Types.ObjectId(userId)}},
        {
            $group:{
                _id:null,
                totalGoals:{$sum:1},
                completedGoals:{$sum:{$cond:[{$eq:["$status","completed"]},1,0]}}
            }
        }
    ]);
    
    const current=currentStats[0] || {totalStudyTime:0,tasksCompleted:0,maxStreak:0};
    const previous=prevStats[0] || {totalStudyTime:0};
    const goals=goalStats[0] || {totalGoals:0,completedGoals:0};
    
    return {
        totalStudyTime:current.totalStudyTime,
        studyTimeChange:calculatePercentageChange(current.totalStudyTime,previous.totalStudyTime),
        goalsCompleted:goals.completedGoals,
        totalGoals:goals.totalGoals,
        goalsChange:0,
        studyStreak:current.maxStreak,
        streakChange:0
    };
};

const getProductivityTrends=async(userId,startDate,endDate)=>{
    const stats=await DailyStats.find({
        userId:new mongoose.Types.ObjectId(userId),
        date:{$gte:startDate,$lte:endDate}
    }).sort({date:1});

    const trends=[];
    
    for(let i=0;i<stats.length;i++){
        const stat=stats[i];
        const prevStat=i>0?stats[i-1]:null;
        
        const completionRate=stat.tasksPlanned>0
            ?(stat.tasksCompleted/stat.tasksPlanned)*100
            :0;
        
        const dayStart=new Date(stat.date);
        dayStart.setHours(0,0,0,0);
        const dayEnd=new Date(stat.date);
        dayEnd.setHours(23,59,59,999);
        
        const sessions=await StudySession.find({
            userId:new mongoose.Types.ObjectId(userId),
            startTime:{$gte:dayStart,$lte:dayEnd}
        });
        
        const avgEfficiency=sessions.length>0
            ?sessions.reduce((sum,s)=>sum+(s.efficiency||0),0)/sessions.length
            :0;
        
        const consistencyScore=Math.min(100,stat.streakCount*10);
        
        const dayGoals=await Goal.find({
            userId:new mongoose.Types.ObjectId(userId),
            status:{$in:['active','completed']},
            updatedAt:{$gte:dayStart,$lte:dayEnd}
        });
        
        const goalProgressScore=dayGoals.length>0
            ?dayGoals.reduce((sum,g)=>sum+(g.progress||0),0)/dayGoals.length
            :0;
        
        const taskCompletionImpact=prevStat
            ?completionRate-(prevStat.tasksPlanned>0?(prevStat.tasksCompleted/prevStat.tasksPlanned)*100:0)
            :0;
        
        const timeManagementImpact=prevStat
            ?avgEfficiency-50
            :0;
        
        const consistencyImpact=prevStat
            ?(stat.streakCount-prevStat.streakCount)*10
            :0;
        
        trends.push({
            date:stat.date.toISOString(),
            score:stat.productivityScore,
            factors:[
                {
                    name:'Task Completion',
                    impact:Math.round(taskCompletionImpact)
                },
                {
                    name:'Time Management',
                    impact:Math.round(timeManagementImpact)
                },
                {
                    name:'Consistency',
                    impact:Math.round(consistencyImpact)
                }
            ],
            breakdown:{
                completion:Math.round(completionRate),
                timeManagement:Math.round(avgEfficiency),
                goalProgress:Math.round(goalProgressScore),
                consistency:Math.round(consistencyScore)
            }
        });
    }
    
    return trends;
};

const calculatePercentageChange=(current,previous)=>{
    if(previous===0) return current>0 ? 100 : 0;
    return Math.round(((current-previous)/previous)*100);
};

module.exports={
    getAnalyticsData
};