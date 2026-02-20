import { useState } from 'react';
import { registerUser } from '../api/auth';

const Register = ({ onRegister }) => {
    const [formData, setFormData] = useState({
        name: "",
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
            const response = await registerUser(formData);
            if (response.status === 201) {
                onRegister();
            }
        } catch (err) {
            setError("Registration failed. Please try again with different information.");
            console.error("Registration error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="card w-full max-w-md animate-scaleIn">
            <div className="card-header text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
                    <span className="text-white font-bold text-2xl">✨</span>
                </div>
                <h1 className="card-title text-2xl mb-2">Create your account</h1>
                <p className="card-description">Start your learning journey with StudySphere today</p>
            </div>
            
            <div className="card-content">
                <form className="space-y-5" onSubmit={handleSubmit}>
                    {error && (
                        <div className="p-3 rounded-xl bg-red-50/80 border border-red-200/60 text-red-700 text-sm font-medium animate-slideDown">
                            {error}
                        </div>
                    )}
                    
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                        <input 
                            type="text"
                            name="name"
                            className="input"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                        />
                    </div>
                    
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
                            placeholder="Create a strong password (min. 6 characters)"
                            required
                            minLength={6}
                        />
                        <p className="text-xs text-gray-500">Must be at least 6 characters long</p>
                    </div>
                    
                    <button 
                        type="submit" 
                        className={`btn btn-success btn-lg w-full ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Creating account...</span>
                            </div>
                        ) : (
                            "Create StudySphere Account"
                        )}
                    </button>
                </form>
                
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <button 
                            onClick={() => window.location.reload()}
                            className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                        >
                            Sign in instead
                        </button>
                    </p>
                </div>
                
                <div className="mt-4 p-4 rounded-xl bg-blue-50/50 border border-blue-200/40">
                    <p className="text-xs text-blue-700 font-medium text-center">
                        🎯 By creating an account, you'll get access to personalized study tracking, goal setting, and progress analytics.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;