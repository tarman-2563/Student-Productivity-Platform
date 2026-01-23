import React, { useState } from 'react';
import {Link,useNavigate} from "react-router-dom";
import { registerUser } from '../api/auth';


const Register = () => {

    const [formData,setFormData]=useState({
        name:"",
        email:"",
        password:""
    })

    const navigate=useNavigate();

    const handleChange=(e)=>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        })
    }

    const handleSubmit=async(e)=>{
        e.preventDefault();
        try{
            const response=await registerUser(formData);
            if(response.status===201){
                console.log("Response:",response.data);
                alert("Registration successful!");
                navigate("/login");
            }
        }
        catch(err){
            console.log("Registration error:",err);
            alert("Registration falied.Please try again.");
        }
    }

    return(
        <div>
          <div>
            <h1>Regsiter</h1>
            <form>
                <div>
                    <label>Name</label>
                    <input 
                     type="text"
                     name="name"
                     value={formData.name}
                     onChange={handleChange}
                     required
                    />
                </div>
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
                    <p>Already have an account? <Link to="/login" >Login</Link></p>
                </div>
                <div>
                    <button type="submit" >Register</button>
                </div>
            </form>
          </div>
        </div>
    )
}

export default Register;