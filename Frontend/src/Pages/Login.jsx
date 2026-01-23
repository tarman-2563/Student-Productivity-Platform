import React, { useState } from 'react'
import {Link,useNavigate} from "react-router-dom";
import { loginUser } from '../api/auth';

const Login = () => {

  const [formData,setFormData]=useState({
        email:"",
        password:""
  })

  const navigate=useNavigate();

  useEffect(()=>{
    const token=localStorage.getItem("token");
    if(token){
        navigate("/",{replace:true});
    }
  },[navigate]);

  const handleChange=(e)=>{
    setFormData({
        ...formData,
        [e.target.name]:e.target.value
    })
  }

  const handleSubmit=async(e)=>{
    e.preventDefault();
    try{
        const response=await loginUser(formData);
        const token=response.data.token;
        localStorage.setItem("token",token);
        if(response.status===200){
            console.log("Response:",response.data);
            alert("Login successful!");
            navigate("/");
        }
    }
    catch(err){
        console.log("Login error:",err);
        alert("Login falied.Please check your credentials.");
    }
  }

  return (
    <div>
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input
                     type="email"
                     name="email"
                     value={formData.email}
                     onChange={handleChange}
                     required
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                     type="password"
                     name="password"
                     value={formData.password}
                     onChange={handleChange}
                     required
                    />
                </div>
                <div>
                    <p>Don't have an account? <Link to="/register" >Register</Link></p>
                </div>
                <button type="submit" >Login</button>
            </form>
        </div>
    </div>
  )
}

export default Login
