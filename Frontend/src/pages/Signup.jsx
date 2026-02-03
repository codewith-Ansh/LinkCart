import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Signup = () => {
    // Form state
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    // Handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('Please fill in all fields');
            return;
        }
        
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        
        setError('');
        console.log('Signup attempt:', formData);
        // Here you would normally handle signup
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
                                    className="form-input"
                                />
                            </div>
                            
                            <div className="form-group">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="form-input"
                                />
                            </div>
                            
                            <div className="form-group">
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="form-input"
                                />
                            </div>
                            
                            <div className="form-group">
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="form-input"
                                />
                            </div>
                            
                            <button type="submit" className="auth-button">
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