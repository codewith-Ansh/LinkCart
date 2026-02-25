import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CompleteProfile = () => {
    const [formData, setFormData] = useState({
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: ''
    });
    const [userId, setUserId] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const customId = localStorage.getItem('customId');
        
        if (!token) {
            navigate('/login');
            return;
        }

        setUserId(customId || '');

        // Fetch existing profile data
        fetch('http://localhost:5000/api/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.profile) {
                setFormData({
                    phone: data.profile.phone || '',
                    address: data.profile.address || '',
                    city: data.profile.city || '',
                    state: data.profile.state || '',
                    pincode: data.profile.pincode || ''
                });
            }
        })
        .catch(err => console.error('Failed to fetch profile'))
        .finally(() => setLoading(false));
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Failed to save profile');
                return;
            }

            navigate('/');
        } catch (err) {
            setError('Server error. Please try again later.');
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-[calc(100vh-72px)] flex items-center justify-center bg-slate-50">
                    <div className="text-xl text-slate-600">Loading...</div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-[calc(100vh-72px)] flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-4 py-12">
                <div className="w-full max-w-2xl">
                    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-2xl">
                        {/* Profile Avatar */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                                {userId.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="mt-3 text-xl font-semibold text-slate-800">{userId}</h2>
                        </div>

                        <h2 className="font-heading text-3xl font-bold text-center mb-2">Complete Your Profile</h2>
                        <p className="text-slate-600 text-center mb-8 text-sm">Please provide your details to continue</p>

                        {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-6 text-center border border-red-200">{error}</div>}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            />

                            <textarea
                                name="address"
                                placeholder="Address"
                                value={formData.address}
                                onChange={handleChange}
                                rows="2"
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                            />

                            <input
                                type="text"
                                name="city"
                                placeholder="City"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            />

                            <input
                                type="text"
                                name="state"
                                placeholder="State"
                                value={formData.state}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            />

                            <input
                                type="text"
                                name="pincode"
                                placeholder="Pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            />

                            <button type="submit" className="bg-primary text-white font-semibold px-4 py-3 rounded-xl hover:bg-primary-dark transition-colors mt-2">
                                Save Profile
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CompleteProfile;
