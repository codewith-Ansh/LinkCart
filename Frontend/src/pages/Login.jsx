import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            console.log('Login response:', data); // Debug log

            if (!response.ok) {
                setError(data.error || 'Login failed');
                return;
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem("customId", data.customId);
            
            console.log('Redirect to:', data.redirectTo); // Debug log
            
            if (data.redirectTo === '/complete-profile') {
                navigate('/complete-profile');
            } else {
                navigate('/');
            }

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
                        <h2 className="font-heading text-3xl font-bold text-center mb-8">Login</h2>

                        {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-6 text-center border border-red-200">{error}</div>}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                />
                            </div>

                            <div>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                />
                            </div>

                            <button type="submit" className="bg-primary text-white font-semibold px-4 py-3 rounded-xl hover:bg-primary-dark transition-colors mt-2">
                                Login
                            </button>
                        </form>

                        <p className="text-center mt-6 text-slate-600 text-sm">
                            Don't have an account? <Link to="/signup" className="text-primary font-medium hover:underline">Sign Up</Link>
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Login;