import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Login = () => {
    // Form state
    const [formData, setFormData] = useState({
        email: '',
        password: ''
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
        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }
        
        setError('');
        console.log('Login attempt:', formData);
        // Here you would normally handle login
    };

    return (
        <>
            <Navbar />
            <div className="auth-page">
                <div className="auth-container">
                    <div className="auth-card">
                        <h2 className="auth-title">Login</h2>
                        
                        {error && <div className="error-message">{error}</div>}
                        
                        <form onSubmit={handleSubmit} className="auth-form">
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
                            
                            <button type="submit" className="auth-button">
                                Login
                            </button>
                        </form>
                        
                        <p className="auth-link">
                            Don't have an account? <Link to="/signup">Sign Up</Link>
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Login;