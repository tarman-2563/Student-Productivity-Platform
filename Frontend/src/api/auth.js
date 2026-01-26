import axios from "axios";

const API=axios.create({
    baseURL:"http://localhost:5757/api"
})

export const registerUser=async(userData)=>{
    return await API.post("/auth/register",userData);
}

export const loginUser=async(loginData)=>{
    return await API.post("/auth/login",loginData);
}