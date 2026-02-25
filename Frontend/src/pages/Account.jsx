import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Account = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLogin, setIsLogin] = useState(false);
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
    const [errors, setErrors] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const customId = localStorage.getItem('customId');
        
        if (token && customId) {
            setIsLoggedIn(true);
            fetchUserProfile(token);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUserProfile = async (token) => {
        try {
            const response = await fetch('http://localhost:5000/api/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setProfileData(data.profile);
            }
        } catch (err) {
            console.error('Failed to fetch profile');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('customId');
        setIsLoggedIn(false);
        setProfileData(null);
        navigate('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
                <Navbar />
                <div className="min-h-[calc(100vh-20rem)] flex items-center justify-center">
                    <div className="text-xl text-slate-600">Loading...</div>
                </div>
                <Footer />
            </div>
        );
    }

    if (isLoggedIn && profileData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
                <Navbar />
                <div className="min-h-[calc(100vh-20rem)] px-6 py-16">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-2xl">
                            <div className="flex flex-col md:flex-row gap-8">
                                {/* Profile Image */}
                                <div className="flex flex-col items-center">
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold shadow-lg">
                                        {profileData.user_id.charAt(0).toUpperCase()}
                                    </div>
                                    <h2 className="mt-4 text-xl font-semibold text-slate-800">{profileData.user_id}</h2>
                                </div>

                                {/* Profile Content */}
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-6">
                                        <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                                            My Profile
                                        </h1>
                                        <button
                                            onClick={handleLogout}
                                            className="bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600 transition-colors"
                                        >
                                            Logout
                                        </button>
                                    </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-semibold text-slate-600">User ID</label>
                                        <p className="text-lg text-slate-900 mt-1">{profileData.user_id}</p>
                                    </div>
                                    
                                    <div>
                                        <label className="text-sm font-semibold text-slate-600">Phone</label>
                                        <p className="text-lg text-slate-900 mt-1">{profileData.phone || 'Not provided'}</p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-semibold text-slate-600">City</label>
                                        <p className="text-lg text-slate-900 mt-1">{profileData.city || 'Not provided'}</p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-semibold text-slate-600">State</label>
                                        <p className="text-lg text-slate-900 mt-1">{profileData.state || 'Not provided'}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-semibold text-slate-600">Address</label>
                                        <p className="text-lg text-slate-900 mt-1">{profileData.address || 'Not provided'}</p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-semibold text-slate-600">Pincode</label>
                                        <p className="text-lg text-slate-900 mt-1">{profileData.pincode || 'Not provided'}</p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-semibold text-slate-600">Profile Status</label>
                                        <p className="text-lg mt-1">
                                            <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                                                ✓ Completed
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-200">
                                <button
                                    onClick={() => navigate('/complete-profile')}
                                    className="bg-indigo-500 text-white px-6 py-3 rounded-xl hover:bg-indigo-600 transition-colors"
                                >
                                    Edit Profile
                                </button>
                            </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const validateFullName = (name) => {
        if (!name) return 'Full name is required';
        if (name.trim().length < 2) return 'Full name must be at least 2 characters';
        if (!/^[a-zA-Z\s]+$/.test(name)) return 'Full name can only contain letters and spaces';
        return '';
    };

    const validateEmail = (email) => {
        if (!email) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email format';
        return '';
    };

    const validatePassword = (password) => {
        if (!password) return 'Password is required';
        if (password.length < 8) return 'Password must be at least 8 characters';
        if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
        if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
        if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
        if (!/[!@#$%^&*]/.test(password)) return 'Password must contain at least one special character (!@#$%^&*)';
        return '';
    };

    const validateConfirmPassword = (confirmPassword, password) => {
        if (!confirmPassword) return 'Please confirm your password';
        if (confirmPassword !== password) return 'Passwords do not match';
        return '';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        let error = '';
        if (name === 'fullName') error = validateFullName(value);
        else if (name === 'email') error = validateEmail(value);
        else if (name === 'password') {
            error = isLogin ? '' : validatePassword(value);
            if (!isLogin && formData.confirmPassword) {
                setErrors(prev => ({ ...prev, confirmPassword: validateConfirmPassword(formData.confirmPassword, value) }));
            }
        }
        else if (name === 'confirmPassword') error = validateConfirmPassword(value, formData.password);
        setErrors({ ...errors, [name]: error });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (isLogin) {
            if (!formData.email || !formData.password) {
                setError('Please fill in all fields');
                return;
            }
            try {
                const response = await fetch('http://localhost:5000/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: formData.email, password: formData.password })
                });
                const data = await response.json();
                if (!response.ok) {
                    setError(data.error || 'Login failed');
                    return;
                }
                localStorage.setItem('token', data.token);
                localStorage.setItem('customId', data.customId);
                
                if (data.redirectTo === '/complete-profile') {
                    navigate('/complete-profile');
                } else {
                    navigate('/');
                }
            } catch (err) {
                setError('Server error. Please try again later.');
            }
        } else {
            const fullNameError = validateFullName(formData.fullName);
            const emailError = validateEmail(formData.email);
            const passwordError = validatePassword(formData.password);
            const confirmPasswordError = validateConfirmPassword(formData.confirmPassword, formData.password);
            if (fullNameError || emailError || passwordError || confirmPasswordError) {
                setErrors({ fullName: fullNameError, email: emailError, password: passwordError, confirmPassword: confirmPasswordError });
                return;
            }
            try {
                const response = await fetch('http://localhost:5000/api/auth/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fullName: formData.fullName, email: formData.email, password: formData.password })
                });
                const data = await response.json();
                if (!response.ok) {
                    setError(data.error || 'Signup failed');
                    return;
                }
                setIsLogin(true);
                setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
                setErrors({ fullName: '', email: '', password: '', confirmPassword: '' });
            } catch (err) {
                setError('Server error. Please try again later.');
            }
        }
    };

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
        setErrors({ fullName: '', email: '', password: '', confirmPassword: '' });
        setError('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
            <Navbar />
            <div className="min-h-[calc(100vh-20rem)] flex items-center justify-center px-6 py-16 animate-fade-in">
                <div className="w-full max-w-md">
                    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-2xl">
                        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                            {isLogin ? 'Welcome Back' : 'Create Account'}
                        </h1>
                        {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-6 text-center border border-red-200">{error}</div>}
                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            {!isLogin && (
                                <div>
                                    <input type="text" name="fullName" className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${errors.fullName ? 'border-red-500' : 'border-slate-300'}`} placeholder="Full Name" value={formData.fullName} onChange={handleChange} />
                                    {errors.fullName && <span className="text-red-500 text-xs mt-1 block">{errors.fullName}</span>}
                                </div>
                            )}
                            <div>
                                <input type="email" name="email" className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:bg-slate-100 ${errors.email ? 'border-red-500' : 'border-slate-300'}`} placeholder="Email" value={formData.email} onChange={handleChange} disabled={!isLogin && !!errors.fullName} />
                                {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email}</span>}
                            </div>
                            <div>
                                <input type="password" name="password" className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:bg-slate-100 ${errors.password ? 'border-red-500' : 'border-slate-300'}`} placeholder="Password" value={formData.password} onChange={handleChange} disabled={!isLogin && (!!errors.fullName || !!errors.email)} />
                                {errors.password && <span className="text-red-500 text-xs mt-1 block">{errors.password}</span>}
                            </div>
                            {!isLogin && (
                                <div>
                                    <input type="password" name="confirmPassword" className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:bg-slate-100 ${errors.confirmPassword ? 'border-red-500' : 'border-slate-300'}`} placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} disabled={!!errors.fullName || !!errors.email || !!errors.password} />
                                    {errors.confirmPassword && <span className="text-red-500 text-xs mt-1 block">{errors.confirmPassword}</span>}
                                </div>
                            )}
                            <button type="submit" className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold px-4 py-3 rounded-xl hover:scale-105 hover:shadow-xl transition-all duration-300 mt-2">
                                {isLogin ? 'Login' : 'Create Account'}
                            </button>
                        </form>
                        <div className="text-center mt-6">
                            <p className="text-gray-600 text-sm">
                                {isLogin ? "Don't have an account? " : "Already have an account? "}
                                <span className="text-indigo-600 font-semibold cursor-pointer hover:underline" onClick={toggleForm}>
                                    {isLogin ? 'Sign Up' : 'Login'}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Account;
