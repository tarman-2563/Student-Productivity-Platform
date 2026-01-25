import { useState } from 'react';
import { loginUser } from '../api/auth';

const Login = ({ onLogin }) => {
    const [formData, setFormData] = useState({
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
            const response = await loginUser(formData);
            const token = response.data.token;
            localStorage.setItem("token", token);
            
            if (response.status === 200) {
                console.log("Response:", response.data);
                alert("Welcome back, Scholar! 🎉");
                onLogin();
            }
        } catch (err) {
            console.log("Login error:", err);
            alert("Login failed. Check your credentials and try again!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card animate-fadeIn">
                <div className="auth-header">
                    <h1 className="auth-title">🎮 Welcome Back!</h1>
                    <p className="auth-subtitle">Ready to continue your study adventure?</p>
                </div>
                
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-input"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-input"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                        {isLoading ? "Logging in..." : "🚀 Start Adventure"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
