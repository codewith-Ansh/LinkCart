import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Phone, MapPin, Home, Hash, CheckCircle, LayoutList, Link2, Activity, ArrowRight, Mail, AlertCircle } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAppContext } from '../context/AppContext';
import API_BASE from '../utils/api';

/* ── Stat card ─────────────────────────────────────────────────────────────── */
const StatCard = ({ icon: Icon, label, value, gradient, loading }) => (
    <div className="bg-white/80 backdrop-blur-sm border border-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(99,102,241,0.08)] hover:shadow-[0_8px_30px_rgba(99,102,241,0.14)] transition-all duration-200 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${gradient}`}>
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

/* ── Info field ─────────────────────────────────────────────────────────────── */
const InfoField = ({ icon: Icon, label, value }) => (
    <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all duration-200">
        <div className="flex items-center gap-2 mb-1">
            <Icon size={13} className="text-indigo-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
        </div>
        <p className="text-slate-700 font-semibold text-sm">
            {value || <span className="text-slate-400 font-normal">Not provided</span>}
        </p>
    </div>
);

/* ── Component ──────────────────────────────────────────────────────────────── */
const Account = () => {
    const [profileData, setProfileData]   = useState(null);
    const [stats, setStats]               = useState(null);
    const [statsError, setStatsError]     = useState(false);
    const [loading, setLoading]           = useState(true);
    const [statsLoading, setStatsLoading] = useState(true);
    const { isLoggedIn, logout }          = useAppContext();
    const navigate                        = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { setLoading(false); return; }
        fetchProfile(token);
        fetchStats(token);
    }, []);

    const fetchProfile = async (token) => {
        try {
            const res  = await fetch(`${API_BASE}/api/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
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
            const res  = await fetch(`${API_BASE}/api/dashboard/overview`, {
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

    const handleLogout = () => { logout(); navigate('/'); };

    /* derived display values with fallbacks */
    const displayName   = profileData?.full_name  || 'User';
    const displayEmail  = profileData?.email       || 'No email available';
    const avatarLetter  = displayName.charAt(0).toUpperCase();
    const isComplete    = profileData?.profile_completed;

    if (loading) {
        return (
            <div style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #fdf4ff 100%)' }} className="min-h-screen">
                <Navbar />
                <div className="min-h-[calc(100vh-20rem)] flex items-center justify-center">
                    <Loader2 size={32} className="animate-spin text-indigo-500" />
                </div>
                <Footer />
            </div>
        );
    }

    if (!isLoggedIn) { navigate('/login'); return null; }

    return (
        <div style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #fdf4ff 100%)' }} className="min-h-screen">

            {/* decorative blobs */}
            <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
                <div style={{ width: 500, height: 500, top: '-140px', left: '-140px', background: 'radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)', position: 'absolute', borderRadius: '50%' }} />
                <div style={{ width: 420, height: 420, bottom: '-100px', right: '-80px', background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)', position: 'absolute', borderRadius: '50%' }} />
            </div>

            <Navbar />

            <div className="max-w-5xl mx-auto px-6 py-12 animate-fade-in">

                {/* ── Dashboard stats ── */}
                <div className="mb-8">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Dashboard Overview</p>

                    {statsError ? (
                        <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                            <AlertCircle size={15} />Could not load dashboard stats. Please refresh.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <StatCard
                                icon={Link2}
                                label="Total Links Created"
                                value={stats?.totalLinksCreated ?? '—'}
                                gradient="bg-gradient-to-br from-indigo-500 to-purple-600"
                                loading={statsLoading}
                            />
                            <StatCard
                                icon={LayoutList}
                                label="Public Listings"
                                value={stats?.activeListings ?? '—'}
                                gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
                                loading={statsLoading}
                            />
                            <StatCard
                                icon={Activity}
                                label="Profile Status"
                                value={stats?.profileStatus ?? '—'}
                                gradient={
                                    stats?.profileStatus === 'Active'
                                        ? 'bg-gradient-to-br from-pink-500 to-rose-500'
                                        : 'bg-gradient-to-br from-amber-400 to-orange-500'
                                }
                                loading={statsLoading}
                            />
                        </div>
                    )}
                </div>

                {/* ── Profile card ── */}
                <div className="bg-white/80 backdrop-blur-xl border border-white rounded-2xl shadow-[0_8px_40px_rgba(99,102,241,0.10)] overflow-hidden">

                    {/* header bar */}
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-5 flex justify-between items-center">
                        <h1 className="text-white text-lg font-bold" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                            My Profile
                        </h1>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200"
                        >
                            <LogOut size={14} />Logout
                        </button>
                    </div>

                    <div className="p-8">
                        <div className="flex flex-col md:flex-row gap-8">

                            {/* ── Avatar + identity column ── */}
                            <div className="flex flex-col items-center md:items-start gap-3 md:w-56 shrink-0">

                                {/* avatar */}
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-indigo-200">
                                    {avatarLetter}
                                </div>

                                {/* name + email + badge — the primary identity block */}
                                <div className="text-center md:text-left w-full">
                                    <p className="text-lg font-bold text-slate-800 leading-tight">
                                        {displayName}
                                    </p>
                                    <p className="flex items-center justify-center md:justify-start gap-1 text-sm text-slate-500 mt-0.5 font-medium">
                                        <Mail size={12} className="text-indigo-400 shrink-0" />
                                        <span className="truncate">{displayEmail}</span>
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1 font-mono">
                                        {profileData?.user_id ?? '—'}
                                    </p>
                                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full mt-2
                                        ${isComplete
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : 'bg-amber-100 text-amber-700'
                                        }`}>
                                        <CheckCircle size={11} />
                                        {isComplete ? 'Verified' : 'Incomplete'}
                                    </span>
                                </div>

                                <button
                                    onClick={() => navigate('/complete-profile')}
                                    className="mt-1 flex items-center justify-center gap-1.5 text-sm text-indigo-600 font-semibold border border-indigo-200 px-4 py-2 rounded-xl hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200 w-full"
                                >
                                    Edit Profile <ArrowRight size={13} />
                                </button>
                            </div>

                            {/* ── Info grid ── */}
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <InfoField icon={User}   label="Full Name" value={profileData?.full_name} />
                                <InfoField icon={Mail}   label="Email"     value={profileData?.email} />
                                <InfoField icon={Hash}   label="User ID"   value={profileData?.user_id} />
                                <InfoField icon={Phone}  label="Phone"     value={profileData?.phone} />
                                <InfoField icon={MapPin} label="City"      value={profileData?.city} />
                                <InfoField icon={MapPin} label="State"     value={profileData?.state} />
                                <InfoField icon={Home}   label="Address"   value={profileData?.address} />
                                <InfoField icon={Hash}   label="Pincode"   value={profileData?.pincode} />

                                {/* profile status row */}
                                <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100 sm:col-span-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <CheckCircle size={13} className="text-indigo-400" />
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Profile Status</span>
                                    </div>
                                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full
                                        ${isComplete
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : 'bg-amber-100 text-amber-700'
                                        }`}>
                                        <CheckCircle size={12} />
                                        {isComplete ? 'Completed' : 'Incomplete — please fill in your profile'}
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
