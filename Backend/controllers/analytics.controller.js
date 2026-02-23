const {DailyStats,StudySession}=require("../models/analyticsSchema");
const StudyTask=require("../models/studyTaskSchema");
const Goal=require("../models/goalSchema");
const mongoose=require("mongoose");

const getAnalyticsData=async(req,res)=>{
    try{
        const {timeRange='week'}=req.query;
        const userId=req.user.id;
        const dateRanges=getDateRange(timeRange);
        const {startDate,endDate}=dateRanges;
        
        const overview=await getOverviewStats(userId,startDate,endDate,timeRange);
        const yearlyData=await getYearlyData(userId);
        const goalProgress=await getGoalProgressData(userId);
        const subjectStats=await getSubjectStats(userId,startDate,endDate);
        const productivityTrends=await getProductivityTrends(userId,startDate,endDate);
        
        res.status(200).json({
            overview,
            yearlyData,
            goalProgress,
            subjectStats,
            productivityTrends,
            timeRange,
            dateRange:{startDate,endDate}
        });
    }
    catch(err){
        console.error("Get analytics data error:", err);
        res.status(500).json({message:"Internal Server Error"});
    }
};

const getDateRange=(timeRange)=>{
    const endDate=new Date();
    const startDate=new Date();
    switch(timeRange){
        case 'week':
            startDate.setDate(endDate.getDate()-7);
            break;
        case 'month':
            startDate.setMonth(endDate.getMonth()-1);
            break;
        case 'quarter':
            startDate.setMonth(endDate.getMonth()-3);
            break;
        case 'year':
            startDate.setFullYear(endDate.getFullYear()-1);
            break;
        default:
            startDate.setDate(endDate.getDate()-7);
    }
    return {startDate,endDate};
};

const getOverviewStats=async(userId,startDate,endDate,timeRange)=>{
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

const getYearlyData=async(userId)=>{
    const currentYear=new Date().getFullYear();
    const startDate=new Date(currentYear,0,1);
    const endDate=new Date(currentYear,11,31);
    
    const dailyStats=await DailyStats.find({
        userId:new mongoose.Types.ObjectId(userId),
        date:{$gte:startDate,$lte:endDate}
    }).sort({date:1});
    
    const statsMap=new Map();
    dailyStats.forEach(stat=>{
        const dateStr=stat.date.toISOString().split('T')[0];
        statsMap.set(dateStr,stat.totalStudyTime);
    });
    
    const yearlyData=[];
    const currentDate=new Date(startDate);
    
    while(currentDate<=endDate){
        const dateStr=currentDate.toISOString().split('T')[0];
        const studyTime=statsMap.get(dateStr) || 0;
        
        yearlyData.push({
            date:dateStr,
            studyTime:studyTime
        });
        
        currentDate.setDate(currentDate.getDate()+1);
    }
    
    return yearlyData;
};

const getGoalProgressData=async(userId)=>{
    return await Goal.find({
        userId:new mongoose.Types.ObjectId(userId),
        status:{$in:['active','completed']}
    })
    .select('title progress status category priority targetDate')
    .sort({updatedAt:-1})
    .limit(10);
};

const getSubjectStats=async(userId,startDate,endDate)=>{
    return await DailyStats.aggregate([
        {
            $match:{
                userId:new mongoose.Types.ObjectId(userId),
                date:{$gte:startDate,$lte:endDate}
            }
        },
        {$unwind:"$subjectBreakdown"},
        {
            $group:{
                _id:"$subjectBreakdown.subject",
                time:{$sum:"$subjectBreakdown.timeSpent"}
            }
        },
        {$sort:{time:-1}},
        {$limit:10}
    ]).then(results=>
        results.map(r=>({name:r._id,time:r.time}))
    );
};

const getProductivityTrends=async(userId,startDate,endDate)=>{
    const stats=await DailyStats.find({
        userId:new mongoose.Types.ObjectId(userId),
        date:{$gte:startDate,$lte:endDate}
    }).sort({date:1});
    return stats.map(stat=>({
        date:stat.date.toISOString(),
        score:stat.productivityScore,
        factors:[
            {name:'Task Completion',impact:Math.random()*20-10},
            {name:'Time Management',impact:Math.random()*20-10},
            {name:'Focus Level',impact:Math.random()*20-10}
        ],
        breakdown:{
            completion:Math.round(stat.productivityScore*0.8+Math.random()*20),
            timeManagement:Math.round(stat.productivityScore*0.9+Math.random()*20),
            goalProgress:Math.round(stat.productivityScore*0.7+Math.random()*20),
            consistency:Math.round(stat.productivityScore*0.85+Math.random()*20)
        }
    }));
};

const calculatePercentageChange=(current,previous)=>{
    if(previous===0) return current>0 ? 100 : 0;
    return Math.round(((current-previous)/previous)*100);
};

module.exports={
    getAnalyticsData
};