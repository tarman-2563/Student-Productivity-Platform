const express=require("express");
const User=require("../models/userSchema");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");

const registerUser=async(req,res)=>{
    try{
        const {name,email,password}=req.body;
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }
        const newUser=new User({
            name,
            email,
            password
        })
        await newUser.save();
        res.status(201).json({message:"User registered successfully"});
    }
    catch(err){
        res.status(500).json({message:"Internal Server Error"});
    }
}

const loginUser=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await User.findOne({email}).select("+password");
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        const isMatch=await user.comparePassword(password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid email or password"});
        }
        const payload={
            userId:user._id
        }
        const token=jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"48h"});
        res.status(200).json({message:"Login successful","token":token});
    }
    catch(err){
        res.status(500).json({message:"Internal Server Error"});
    }
}

module.exports={
    registerUser,
    loginUser
}