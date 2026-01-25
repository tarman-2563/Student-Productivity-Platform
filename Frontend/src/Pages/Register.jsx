import { useState } from 'react';
import { registerUser } from '../api/auth';

const Register = ({ onRegister }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const response = await registerUser(formData);
            if (response.status === 201) {
                console.log("Response:", response.data);
                alert("Registration successful! Please login.");
                onRegister();
            }
        } catch (err) {
            console.log("Registration error:", err);
            alert("Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div>
                <h1>Register</h1>
                <form onSubmit={handleSubmit}>
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
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "Registering..." : "Register"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;