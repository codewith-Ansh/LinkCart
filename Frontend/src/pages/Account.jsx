import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Phone, MapPin, Home, Hash, CheckCircle, LayoutList, Link2, Activity } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAppContext } from '../context/AppContext';

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className={`bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center gap-4`}>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
            <Icon size={22} className="text-white" />
        </div>
        <div>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
            <p className="text-sm text-slate-500">{label}</p>
        </div>
    </div>
);

const InfoField = ({ icon: Icon, label, value }) => (
    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 hover:border-indigo-200 transition-colors duration-200">
        <div className="flex items-center gap-2 mb-1">
            <Icon size={14} className="text-indigo-400" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</span>
        </div>
        <p className="text-slate-800 font-medium text-sm">{value || 'Not provided'}</p>
    </div>
);

const Account = () => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { isLoggedIn, logout } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUserProfile(token);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUserProfile = async (token) => {
        try {
            const response = await fetch('http://localhost:5000/api/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
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
        logout();
        navigate('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
                <Navbar />
                <div className="min-h-[calc(100vh-20rem)] flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!isLoggedIn) {
        navigate('/login');
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
            <Navbar />
            <div className="max-w-5xl mx-auto px-6 py-12">

                {/* Dashboard Stats */}
                <div className="mb-8">
                    <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">Dashboard Overview</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <StatCard icon={Link2} label="Total Links Created" value="12" color="bg-gradient-to-br from-indigo-500 to-purple-600" />
                        <StatCard icon={LayoutList} label="Active Listings" value="5" color="bg-gradient-to-br from-emerald-500 to-teal-600" />
                        <StatCard icon={Activity} label="Profile Status" value="Active" color="bg-gradient-to-br from-pink-500 to-rose-500" />
                    </div>
                </div>

                {/* Profile Card */}
                <div className="bg-white border border-slate-200 rounded-3xl shadow-lg overflow-hidden">
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-6 flex justify-between items-center">
                        <h1 className="text-white text-xl font-bold" style={{ fontFamily: 'Clash Display, sans-serif' }}>My Profile</h1>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200"
                        >
                            <LogOut size={15} />Logout
                        </button>
                    </div>

                    <div className="p-8">
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Left — Avatar */}
                            <div className="flex flex-col items-center md:items-start gap-3 md:w-48 shrink-0">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                                    {profileData?.user_id?.charAt(0).toUpperCase() ?? <User size={36} />}
                                </div>
                                <div className="text-center md:text-left">
                                    <p className="font-bold text-slate-800 text-lg">{profileData?.user_id ?? '—'}</p>
                                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full mt-1">
                                        <CheckCircle size={12} />Verified
                                    </span>
                                </div>
                                <button
                                    onClick={() => navigate('/complete-profile')}
                                    className="mt-2 text-sm text-indigo-600 font-semibold border border-indigo-300 px-4 py-2 rounded-xl hover:bg-indigo-50 transition-colors duration-200 w-full text-center"
                                >
                                    Edit Profile
                                </button>
                            </div>

                            {/* Right — Info Grid */}
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <InfoField icon={Hash} label="User ID" value={profileData?.user_id} />
                                <InfoField icon={Phone} label="Phone" value={profileData?.phone} />
                                <InfoField icon={MapPin} label="City" value={profileData?.city} />
                                <InfoField icon={MapPin} label="State" value={profileData?.state} />
                                <InfoField icon={Home} label="Address" value={profileData?.address} />
                                <InfoField icon={Hash} label="Pincode" value={profileData?.pincode} />
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 sm:col-span-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <CheckCircle size={14} className="text-indigo-400" />
                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Profile Status</span>
                                    </div>
                                    <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 text-sm font-semibold px-3 py-1 rounded-full">
                                        <CheckCircle size={13} />Completed
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Account;
