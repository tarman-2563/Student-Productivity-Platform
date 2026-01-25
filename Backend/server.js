const express=require("express");
const cors=require("cors");
const dotenv=require("dotenv").config();
const connectDB=require("./config/db");
const userRouter=require("./routes/user.routes");
const studyTaskRouter=require("./routes/studyTask.routes");

const app=express();
const PORT=process.env.PORT || 5858;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
connectDB();

app.use("/api/auth",userRouter);
app.use("/api/study-tasks",studyTaskRouter);

app.get("/api/health",(req,res)=>{
    res.status(200).send("Server is up and running");
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})
