// Authentication Debug Utility

export const checkAuth = () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        console.log('❌ No token found in localStorage');
        return false;
    }
    
    console.log('✅ Token found:', token.substring(0, 20) + '...');
    
    // Decode JWT to check expiration (basic check)
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp * 1000; // Convert to milliseconds
        const now = Date.now();
        
        if (exp < now) {
            console.log('❌ Token expired at:', new Date(exp));
            return false;
        }
        
        console.log('✅ Token valid until:', new Date(exp));
        console.log('✅ User ID:', payload.userId);
        return true;
    } catch (err) {
        console.log('❌ Invalid token format:', err.message);
        return false;
    }
};

export const clearAuth = () => {
    localStorage.removeItem('token');
    console.log('🔄 Token cleared. Please log in again.');
};

// Run this in browser console to debug:
// import { checkAuth, clearAuth } from './utils/authDebug';
// checkAuth();
