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
            <div className="auth-page">
                <div className="auth-container">
                    <div className="auth-card">
                        <h2 className="auth-title">Sign Up</h2>

                        {error && <div className="error-message">{error}</div>}

                        <form onSubmit={handleSubmit} className="auth-form">
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Full Name"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className={`form-input ${errors.fullName ? 'input-error' : ''}`}
                                />
                                {errors.fullName && <span className="field-error">{errors.fullName}</span>}
                            </div>

                            <div className="form-group">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`form-input ${errors.email ? 'input-error' : ''}`}
                                    disabled={!!errors.fullName}
                                />
                                {errors.email && <span className="field-error">{errors.email}</span>}
                            </div>

                            <div className="form-group">
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`form-input ${errors.password ? 'input-error' : ''}`}
                                    disabled={!!errors.fullName || !!errors.email}
                                />
                                {errors.password && <span className="field-error">{errors.password}</span>}
                            </div>

                            <div className="form-group">
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                                    disabled={!!errors.fullName || !!errors.email || !!errors.password}
                                />
                                {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
                            </div>

                            <button 
                                type="submit" 
                                className="auth-button"
                            >
                                Create Account
                            </button>
                        </form>

                        <p className="auth-link">
                            Already have an account? <Link to="/login">Login</Link>
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Signup;