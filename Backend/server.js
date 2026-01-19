const express=require("express");
const dotenv=require("dotenv").config();
const connectDB=require("./config/db");

const app=express();
const PORT=process.env.PORT || 3838;

app.use(express.json());
connectDB();

app.get("/health",(req,res)=>{
    res.status(200).send("Server is up and running");
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})
