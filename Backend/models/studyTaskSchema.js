const mongoose=require("mongoose");

const studyTaskSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        index:true
    },
    title:{
        type:String,
        required:true,
        trim:true
    },
    subject:{
        type:String,
        required:true,
        trim:true
    },
    scheduledFor:{
        type:Date,
        required:true
    },
    duration:{
        type:Number,
        required:true,
        min:10
    },
    priority:{
        type:String,
        enum:["Low","Medium","High"],
        default:"Medium"
    },
    status:{
        type:String,
        enum:["Pending","Completed"],
        default:"Pending"
    },
    completedAt:{
        type:Date,
        default:null
    },
    actualDuration:{
        type:Number,
        default:null
    }
},{
    timestamps:true
})

const StudyTask=mongoose.model("StudyTask",studyTaskSchema);
module.exports=StudyTask;

