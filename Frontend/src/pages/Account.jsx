import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const Account = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLogin) {
            console.log('Login:', { email: formData.email, password: formData.password });
        } else {
            console.log('Register:', formData);
        }
    };

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setFormData({
            fullName: '',
            email: '',
            password: '',
            confirmPassword: ''
        });
    };

    return (
        <div>
            <Navbar />
            <div className="account-page">
                <div className="account-container">
                    <div className="account-card">
                        <h1 className="account-title">{isLogin ? 'Login' : 'Register'}</h1>
                        
                        <form className="account-form" onSubmit={handleSubmit}>
                            {!isLogin && (
                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="fullName"
                                        className="form-input"
                                        placeholder="Full Name"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            )}
                            
                            <div className="form-group">
                                <input
                                    type="email"
                                    name="email"
                                    className="form-input"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <input
                                    type="password"
                                    name="password"
                                    className="form-input"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            
                            {!isLogin && (
                                <div className="form-group">
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        className="form-input"
                                        placeholder="Confirm Password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            )}
                            
                            <button type="submit" className="account-button">
                                {isLogin ? 'Login' : 'Register'}
                            </button>
                        </form>
                        
                        <div className="account-toggle">
                            {isLogin ? (
                                <p>
                                    Don't have an account?{' '}
                                    <span className="toggle-link" onClick={toggleForm}>
                                        Register
                                    </span>
                                </p>
                            ) : (
                                <p>
                                    Already have an account?{' '}
                                    <span className="toggle-link" onClick={toggleForm}>
                                        Login
                                    </span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;
