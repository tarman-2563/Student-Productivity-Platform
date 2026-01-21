const express=require("express");
const dotenv=require("dotenv").config();
const connectDB=require("./config/db");
const userRouter=require("./routes/user.routes");

const app=express();
const PORT=process.env.PORT || 5858;

app.use(express.json());
connectDB();

app.use("/api/auth",userRouter);

app.get("/api/health",(req,res)=>{
    res.status(200).send("Server is up and running");
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})
