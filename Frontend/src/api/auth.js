import axios from "axios";

const API=axios.create({
    baseURL:"https://student-productivity-platform.onrender.com/api"
})

export const registerUser=async(userData)=>{
    return await API.post("/auth/register",userData);
}

export const loginUser=async(loginData)=>{
    return await API.post("/auth/login",loginData);
}