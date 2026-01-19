const mongoose=require("mongoose");

const connectDB=async()=>{
    try{
        if(!process.env.MONGOURI){
            throw new Error("MONGOURI is not defined in environment variables");
        }
        await mongoose.connect(process.env.MONGOURI);
        console.log("Connected to database successfully");
    }
    catch(err){
        console.log("Error connecting to database:",err)
        process.exit(1);
    }
}

module.exports=connectDB;