import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Signup = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const validateFullName = (name) => {
        if (!name) return 'Full name is required';
        if (name.trim().length < 2) return 'Full name must be at least 2 characters';
        if (!/^[a-zA-Z\s]+$/.test(name)) return 'Full name can only contain letters and spaces';
        return '';
    };

    const validateEmail = (email) => {
        if (!email) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return 'Invalid email format';
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
        setFormData({
            ...formData,
            [name]: value
        });

        // Validate on change
        let error = '';
        if (name === 'fullName') error = validateFullName(value);
        else if (name === 'email') error = validateEmail(value);
        else if (name === 'password') {
            error = validatePassword(value);
            // Also revalidate confirm password if it exists
            if (formData.confirmPassword) {
                setErrors(prev => ({
                    ...prev,
                    confirmPassword: validateConfirmPassword(formData.confirmPassword, value)
                }));
            }
        }
        else if (name === 'confirmPassword') error = validateConfirmPassword(value, formData.password);

        setErrors({
            ...errors,
            [name]: error
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields
        const fullNameError = validateFullName(formData.fullName);
        const emailError = validateEmail(formData.email);
        const passwordError = validatePassword(formData.password);
        const confirmPasswordError = validateConfirmPassword(formData.confirmPassword, formData.password);

        if (fullNameError || emailError || passwordError || confirmPasswordError) {
            setErrors({
                fullName: fullNameError,
                email: emailError,
                password: passwordError,
                confirmPassword: confirmPasswordError
            });
            return;
        }

        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fullName: formData.fullName,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Signup failed');
                return;
            }

            alert('Registration successful! Redirecting to login...');
            navigate('/login');

        } catch (err) {
            setError('Server error. Please try again later.');
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-[calc(100vh-72px)] flex items-center justify-center bg-slate-50 px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-lg">
                        <h2 className="font-heading text-3xl font-bold text-center mb-8">Sign Up</h2>

                        {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-6 text-center border border-red-200">{error}</div>}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Full Name"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${errors.fullName ? 'border-red-500' : 'border-slate-300'}`}
                                />
                                {errors.fullName && <span className="text-red-500 text-xs mt-1 block">{errors.fullName}</span>}
                            </div>

                            <div>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:bg-slate-100 disabled:cursor-not-allowed ${errors.email ? 'border-red-500' : 'border-slate-300'}`}
                                    disabled={!!errors.fullName}
                                />
                                {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email}</span>}
                            </div>

                            <div>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:bg-slate-100 disabled:cursor-not-allowed ${errors.password ? 'border-red-500' : 'border-slate-300'}`}
                                    disabled={!!errors.fullName || !!errors.email}
                                />
                                {errors.password && <span className="text-red-500 text-xs mt-1 block">{errors.password}</span>}
                            </div>

                            <div>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:bg-slate-100 disabled:cursor-not-allowed ${errors.confirmPassword ? 'border-red-500' : 'border-slate-300'}`}
                                    disabled={!!errors.fullName || !!errors.email || !!errors.password}
                                />
                                {errors.confirmPassword && <span className="text-red-500 text-xs mt-1 block">{errors.confirmPassword}</span>}
                            </div>

                            <button 
                                type="submit" 
                                className="bg-primary text-white font-semibold px-4 py-3 rounded-xl hover:bg-primary-dark transition-colors mt-2"
                            >
                                Create Account
                            </button>
                        </form>

                        <p className="text-center mt-6 text-slate-600 text-sm">
                            Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Login</Link>
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Signup;