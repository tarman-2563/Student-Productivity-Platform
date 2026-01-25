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
                alert("Welcome to StudySphere! 🎉 Please login to start your adventure.");
                onRegister();
            }
        } catch (err) {
            console.log("Registration error:", err);
            alert("Registration failed. Please try again!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card animate-fadeIn">
                <div className="auth-header">
                    <h1 className="auth-title">🌟 Join StudySphere!</h1>
                    <p className="auth-subtitle">Start your gamified study journey today</p>
                </div>
                
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Name</label>
                        <input 
                            type="text"
                            name="name"
                            className="form-input"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            required
                        />
                    </div>
                    
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
                            placeholder="Create a password"
                            required
                        />
                    </div>
                    
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                        {isLoading ? "Creating Account..." : "🎮 Create Account"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;