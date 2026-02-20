import { useState } from 'react';
import { loginUser } from '../api/auth';

const Login = ({ onLogin }) => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        
        try {
            const response = await loginUser(formData);
            const token = response.data.token;
            localStorage.setItem("token", token);
            
            if (response.status === 200) {
                onLogin();
            }
        } catch (err) {
            setError("Login failed. Please check your credentials and try again.");
            console.error("Login error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="card w-full max-w-md animate-scaleIn">
            <div className="card-header text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
                    <span className="text-white font-bold text-2xl">S</span>
                </div>
                <h1 className="card-title text-2xl mb-2">Welcome back</h1>
                <p className="card-description">Sign in to your account to continue your learning journey</p>
            </div>
            
            <div className="card-content">
                <form className="space-y-5" onSubmit={handleSubmit}>
                    {error && (
                        <div className="p-3 rounded-xl bg-red-50/80 border border-red-200/60 text-red-700 text-sm font-medium animate-slideDown">
                            {error}
                        </div>
                    )}
                    
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            className="input"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="input"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className={`btn btn-primary btn-lg w-full ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Signing in...</span>
                            </div>
                        ) : (
                            "Sign in to StudySphere"
                        )}
                    </button>
                </form>
                
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{" "}
                        <button 
                            onClick={() => window.location.reload()}
                            className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                        >
                            Sign up for free
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
