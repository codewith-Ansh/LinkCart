import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Phone, MapPin, Home, Hash, CheckCircle, LayoutList, Link2, Activity, ArrowRight, Mail, AlertCircle } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAppContext } from '../context/AppContext';
import API_BASE from '../utils/api';

const StatCard = ({ icon: Icon, label, value, gradient, loading }) => (
    <div className="bg-white/80 backdrop-blur-sm border border-white rounded-2xl p-5 shadow flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${gradient}`}>
            <Icon size={20} className="text-white" />
        </div>
        <div>
            {loading
                ? <div className="h-7 w-10 bg-slate-200 rounded-lg animate-pulse mb-1" />
                : <p className="text-2xl font-bold text-slate-800">{value}</p>
            }
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
        </div>
    </div>
);

const InfoField = ({ icon: Icon, label, value }) => (
    <div className="bg-slate-50 rounded-xl p-4 border">
        <div className="flex items-center gap-2 mb-1">
            <Icon size={13} />
            <span className="text-xs font-bold text-slate-400 uppercase">{label}</span>
        </div>
        <p className="text-slate-700 font-semibold text-sm">
            {value || 'Not provided'}
        </p>
    </div>
);

const Account = () => {
    const [profileData, setProfileData] = useState(null);
    const [stats, setStats] = useState(null);
    const [statsError, setStatsError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [statsLoading, setStatsLoading] = useState(true);

    const { isLoggedIn, logout } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        if (!token) {
            setLoading(false);
            return;
        }

        // Admin should not access account page
        if (role === 'admin') {
            navigate('/admin');
            return;
        }

        fetchProfile(token);
        fetchStats(token);
    }, []);

    const fetchProfile = async (token) => {
        try {
            const res = await fetch(`${API_BASE}/api/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.status === 401) {
                logout();
                navigate('/login');
                return;
            }

            if (res.ok) {
                const data = await res.json();
                setProfileData(data.profile);
            }
        } catch {
            console.error('Failed to fetch profile');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async (token) => {
        try {
            const res = await fetch(`${API_BASE}/api/dashboard/overview`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                const data = await res.json();
                setStats(data);
            } else {
                setStatsError(true);
            }
        } catch {
            setStatsError(true);
        } finally {
            setStatsLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin" />
            </div>
        );
    }

    if (!isLoggedIn) {
        navigate('/login');
        return null;
    }

    return (
        <div className="min-h-screen">
            <Navbar />

            <div className="max-w-5xl mx-auto px-6 py-12">

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    {statsError ? (
                        <div className="text-red-500">Failed to load stats</div>
                    ) : (
                        <>
                            <StatCard icon={Link2} label="Links" value={stats?.totalLinksCreated} gradient="bg-indigo-500" loading={statsLoading} />
                            <StatCard icon={LayoutList} label="Listings" value={stats?.activeListings} gradient="bg-green-500" loading={statsLoading} />
                            <StatCard icon={Activity} label="Status" value={stats?.profileStatus} gradient="bg-purple-500" loading={statsLoading} />
                        </>
                    )}
                </div>

                {/* Profile */}
                <div className="bg-white p-6 rounded-xl shadow">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-xl font-bold">My Profile</h1>
                        <button onClick={handleLogout} className="text-red-500 flex gap-2 items-center">
                            <LogOut size={16} /> Logout
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InfoField icon={User} label="Name" value={profileData?.full_name} />
                        <InfoField icon={Mail} label="Email" value={profileData?.email} />
                        <InfoField icon={Hash} label="User ID" value={profileData?.user_id} />
                        <InfoField icon={Phone} label="Phone" value={profileData?.phone} />
                        <InfoField icon={MapPin} label="City" value={profileData?.city} />
                        <InfoField icon={MapPin} label="State" value={profileData?.state} />
                        <InfoField icon={Home} label="Address" value={profileData?.address} />
                        <InfoField icon={Hash} label="Pincode" value={profileData?.pincode} />
                    </div>

                    <button
                        onClick={() => navigate('/complete-profile')}
                        className="mt-6 bg-indigo-500 text-white px-4 py-2 rounded"
                    >
                        Edit Profile
                    </button>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Account;