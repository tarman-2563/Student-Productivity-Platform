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

const getStudyStats=async(req,res)=>{
    try{
        const {dateRange}=req.body;
        const userId=req.user.id;
        if(!dateRange || !dateRange.start || !dateRange.end){
            return res.status(400).json({message:"Date range is required"});
        }
        const startDate=new Date(dateRange.start);
        const endDate=new Date(dateRange.end);
        const stats=await StudySession.aggregate([
            {
                $match:{
                    userId:new mongoose.Types.ObjectId(userId),
                    startTime:{$gte:startDate,$lte:endDate}
                }
            },
            {
                $group:{
                    _id:null,
                    totalTime:{$sum:"$duration"},
                    averageSession:{$avg:"$duration"},
                    totalSessions:{$sum:1},
                    averageEfficiency:{$avg:"$efficiency"},
                    averageFocus:{$avg:"$focusRating"}
                }
            }
        ]);
        const completedTasks=await StudyTask.countDocuments({
            userId:new mongoose.Types.ObjectId(userId),
            status:"Completed",
            completedAt:{$gte:startDate,$lte:endDate}
        });
        const subjectBreakdown=await StudySession.aggregate([
            {
                $match:{
                    userId:new mongoose.Types.ObjectId(userId),
                    startTime:{$gte:startDate,$lte:endDate}
                }
            },
            {
                $group:{
                    _id:"$subject",
                    time:{$sum:"$duration"},
                    sessions:{$sum:1}
                }
            },
            {$sort:{time:-1}}
        ]);
        const result=stats[0] || {
            totalTime:0,
            averageSession:0,
            totalSessions:0,
            averageEfficiency:0,
            averageFocus:0
        };
        result.completedTasks=completedTasks;
        result.subjects=subjectBreakdown.map(s=>({
            name:s._id,
            time:s.time,
            sessions:s.sessions
        }));
        result.productivity=calculateProductivityScore(result);
        res.status(200).json(result);
    }
    catch(err){
        console.error("Get study stats error:", err);
        res.status(500).json({message:"Internal Server Error"});
    }
};

const recordStudySession=async(req,res)=>{
    try{
        const {taskId,startTime,endTime,focusRating,notes}=req.body;
        const userId=req.user.id;
        const task=await StudyTask.findOne({_id:taskId,userId});
        if(!task){
            return res.status(404).json({message:"Task not found"});
        }
        const duration=Math.round((new Date(endTime)-new Date(startTime))/(1000*60));
        const session=await StudySession.create({
            userId,
            taskId,
            subject:task.subject,
            startTime:new Date(startTime),
            endTime:new Date(endTime),
            duration,
            plannedDuration:task.duration,
            focusRating,
            notes
        });
        await updateDailyStats(userId,new Date(startTime),duration,task.subject);
        res.status(201).json({message:"Study session recorded successfully",session});
    }
    catch(err){
        console.error("Record study session error:", err);
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

const getActivityHeatmap=async(userId)=>{
    const endDate=new Date();
    endDate.setHours(23,59,59,999);
    const startDate=new Date();
    startDate.setDate(endDate.getDate()-84);
    startDate.setHours(0,0,0,0);
    
    const stats=await DailyStats.find({
        userId:new mongoose.Types.ObjectId(userId),
        date:{$gte:startDate,$lte:endDate}
    });
    
    const heatmapData=[];
    const currentDate=new Date(startDate);
    
    while(currentDate<=endDate){
        const stat=stats.find(s=>s.date.toDateString()===currentDate.toDateString());
        heatmapData.push({
            date:new Date(currentDate).toISOString(),
            value:stat ? stat.totalStudyTime : 0
        });
        currentDate.setDate(currentDate.getDate()+1);
    }
    
    return heatmapData;
};

const getAchievements=async(userId)=>{
    const achievements=[];
    const latestStats=await DailyStats.findOne({
        userId:new mongoose.Types.ObjectId(userId)
    }).sort({date:-1});
    if(latestStats && latestStats.streakCount>=7){
        achievements.push({
            icon:'🔥',
            title:'Study Streak',
            description:`${latestStats.streakCount} days in a row!`
        });
    }
    const thisMonth=new Date();
    thisMonth.setDate(1);
    const completedGoals=await Goal.countDocuments({
        userId:new mongoose.Types.ObjectId(userId),
        status:'completed',
        completedAt:{$gte:thisMonth}
    });
    if(completedGoals>=3){
        achievements.push({
            icon:'🎯',
            title:'Goal Crusher',
            description:`Completed ${completedGoals} goals this month`
        });
    }
    const weekStart=new Date();
    weekStart.setDate(weekStart.getDate()-weekStart.getDay());
    const weeklyTime=await DailyStats.aggregate([
        {
            $match:{
                userId:new mongoose.Types.ObjectId(userId),
                date:{$gte:weekStart}
            }
        },
        {$group:{_id:null,total:{$sum:"$totalStudyTime"}}}
    ]);
    const totalMinutes=weeklyTime[0]?.total || 0;
    if(totalMinutes>=1200){
        achievements.push({
            icon:'⏰',
            title:'Time Master',
            description:`${Math.round(totalMinutes/60)} hours studied this week`
        });
    }
    return achievements;
};

const updateDailyStats=async(userId,date,studyTime,subject)=>{
    const dayStart=new Date(date);
    dayStart.setHours(0,0,0,0);
    let dailyStat=await DailyStats.findOne({userId,date:dayStart});
    if(!dailyStat){
        dailyStat=new DailyStats({
            userId,
            date:dayStart,
            totalStudyTime:0,
            tasksCompleted:0,
            subjectBreakdown:[],
            productivityScore:0
        });
    }
    dailyStat.totalStudyTime+=studyTime;
    const subjectIndex=dailyStat.subjectBreakdown.findIndex(s=>s.subject===subject);
    if(subjectIndex>=0){
        dailyStat.subjectBreakdown[subjectIndex].timeSpent+=studyTime;
    }else{
        dailyStat.subjectBreakdown.push({subject,timeSpent:studyTime});
    }
    dailyStat.productivityScore=calculateDailyProductivityScore(dailyStat);
    await dailyStat.save();
};

const calculatePercentageChange=(current,previous)=>{
    if(previous===0) return current>0 ? 100 : 0;
    return Math.round(((current-previous)/previous)*100);
};

const calculateProductivityScore=(stats)=>{
    let score=0;
    if(stats.averageEfficiency) score+=stats.averageEfficiency*0.4;
    if(stats.averageFocus) score+=(stats.averageFocus/5)*100*0.3;
    if(stats.totalSessions>=3) score+=20;
    if(stats.totalTime>=120) score+=10;
    return Math.min(100,Math.round(score));
};

const calculateDailyProductivityScore=(dailyStat)=>{
    let score=50;
    if(dailyStat.totalStudyTime>=60) score+=20;
    if(dailyStat.totalStudyTime>=120) score+=15;
    if(dailyStat.totalStudyTime>=180) score+=15;
    return Math.min(100,score);
};

const formatDateLabel=(date,timeRange)=>{
    switch(timeRange){
        case 'week':
            return date.toLocaleDateString('en-US',{weekday:'short'});
        case 'month':
            return date.getDate().toString();
        case 'quarter':
        case 'year':
            return date.toLocaleDateString('en-US',{month:'short',day:'numeric'});
        default:
            return date.toLocaleDateString();
    }
};

const seedAnalyticsData=async(req,res)=>{
    try{
        const userId=req.user.id;
        
        const today=new Date();
        const sampleData=[];
        
        for(let i=6;i>=0;i--){
            const date=new Date(today);
            date.setDate(date.getDate()-i);
            date.setHours(0,0,0,0);
            
            const studyTime=Math.floor(Math.random()*120)+30;
            const tasksCompleted=Math.floor(Math.random()*5)+1;
            
            const dailyStat=new DailyStats({
                userId,
                date,
                totalStudyTime:studyTime,
                tasksCompleted,
                subjectBreakdown:[
                    {subject:'Mathematics',timeSpent:Math.floor(studyTime*0.4)},
                    {subject:'Programming',timeSpent:Math.floor(studyTime*0.3)},
                    {subject:'Science',timeSpent:Math.floor(studyTime*0.3)}
                ],
                productivityScore:Math.floor(Math.random()*40)+60,
                streakCount:i===0 ? 7-i : 0
            });
            
            sampleData.push(dailyStat);
        }
        
        await DailyStats.deleteMany({userId});
        
        await DailyStats.insertMany(sampleData);
        
        res.status(200).json({
            message:"Sample analytics data created successfully",
            dataPoints:sampleData.length
        });
    }
    catch(err){
        console.error("Seed analytics data error:", err);
        res.status(500).json({message:"Internal Server Error"});
    }
};

module.exports={
    getAnalyticsData
};