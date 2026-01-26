const mongoose=require("mongoose");

const dailyStatsSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        index:true
    },
    date:{
        type:Date,
        required:true
    },
    totalStudyTime:{
        type:Number,
        default:0
    },
    tasksCompleted:{
        type:Number,
        default:0
    },
    tasksPlanned:{
        type:Number,
        default:0
    },
    subjectBreakdown:[{
        subject:String,
        timeSpent:Number
    }],
    productivityScore:{
        type:Number,
        min:0,
        max:100,
        default:0
    },
    streakCount:{
        type:Number,
        default:0
    }
},{
    timestamps:true
});

dailyStatsSchema.index({userId:1,date:-1});

const studySessionSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        index:true
    },
    taskId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"StudyTask",
        required:true
    },
    subject:{
        type:String,
        required:true
    },
    startTime:{
        type:Date,
        required:true
    },
    endTime:{
        type:Date,
        required:true
    },
    duration:{
        type:Number,
        required:true
    },
    plannedDuration:{
        type:Number,
        required:true
    },
    efficiency:{
        type:Number,
        min:0,
        max:100
    },
    focusRating:{
        type:Number,
        min:1,
        max:5
    },
    notes:{
        type:String,
        trim:true
    }
},{
    timestamps:true
});

studySessionSchema.pre('save',function(){
    if(this.duration && this.plannedDuration){
        this.efficiency=Math.min(100,Math.round((this.plannedDuration/this.duration)*100));
    }
});

studySessionSchema.index({userId:1,startTime:-1});

const goalProgressSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        index:true
    },
    goalId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Goal",
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    progressPercentage:{
        type:Number,
        min:0,
        max:100,
        required:true
    },
    milestonesCompleted:{
        type:Number,
        default:0
    },
    totalMilestones:{
        type:Number,
        default:0
    }
},{
    timestamps:true
});

goalProgressSchema.index({userId:1,goalId:1,date:-1});

const DailyStats=mongoose.model("DailyStats",dailyStatsSchema);
const StudySession=mongoose.model("StudySession",studySessionSchema);
const GoalProgress=mongoose.model("GoalProgress",goalProgressSchema);

module.exports={
    DailyStats,
    StudySession,
    GoalProgress
};