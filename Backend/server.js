const express=require("express");
const cors=require("cors");
const dotenv=require("dotenv").config();
const connectDB=require("./config/db");

const userRouter=require("./routes/user.routes");
const studyTaskRouter=require("./routes/studyTask.routes");
const goalRouter=require("./routes/goal.routes");
const noteRouter=require("./routes/note.routes");
const analyticsRouter=require("./routes/analytics.routes");
const resourceRouter=require("./routes/resource.routes");

const app=express();
const PORT=process.env.PORT || 5000;

app.use(cors({
    origin:["http://localhost:5173"],
    credentials:true
}));
app.use(express.json({limit:'10mb'}));
app.use(express.urlencoded({extended:true,limit:'10mb'}));

connectDB();

app.use("/api/auth",userRouter);
app.use("/api/study-tasks",studyTaskRouter);
app.use("/api/goals",goalRouter);
app.use("/api/notes",noteRouter);
app.use("/api/analytics",analyticsRouter);
app.use("/api/resources",resourceRouter);

app.use("/uploads",express.static("uploads"));

app.get("/api/health",(req,res)=>{
    res.status(200).json({
        message:"Server is up and running",
        timestamp:new Date().toISOString(),
        version:"1.0.0"
    });
});

app.use("*",(req,res)=>{
    res.status(404).json({
        message:"Route not found",
        path:req.originalUrl
    });
});

app.use((err,req,res,next)=>{
    console.error("Global error:", err);
    res.status(500).json({
        message:"Internal Server Error",
        error:process.env.NODE_ENV==='development' ? err.message : undefined
    });
});

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});
