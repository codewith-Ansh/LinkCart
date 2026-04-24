import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Camera, LayoutList, Loader2, LogOut, Mail, MapPin, PencilLine, Phone, Save, Link2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import UserAvatar from '../components/UserAvatar';
import { useAppContext } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import API_BASE from '../utils/api';
import { getProfileCompletionDetails, isProfileComplete } from '../utils/profileCompletion';

const detailCards = [
    { key: 'email', label: 'Email', icon: Mail },
    { key: 'phone', label: 'Phone', icon: Phone },
    { key: 'city', label: 'City', icon: MapPin },
    { key: 'state', label: 'State', icon: MapPin },
];

const DetailCard = ({ icon, label, value }) => {
    const IconComponent = icon;

    return (
        <div className="theme-surface rounded-xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                    <IconComponent size={18} />
                </div>
                <span className="theme-text-muted text-[11px] font-semibold uppercase tracking-[0.18em]">{label}</span>
            </div>
            <p className="theme-text-primary text-base font-semibold">{value || 'Not added yet'}</p>
        </div>
    );
};

const Account = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [stats, setStats] = useState(null);
    const [statsLoading, setStatsLoading] = useState(true);
    const [statsError, setStatsError] = useState(false);
    const [form, setForm] = useState({ name: '', tagline: '', phone: '' });
    const fileInputRef = useRef(null);

    const { isLoggedIn, logout, currentUser, profileLoading, updateCurrentUser } = useAppContext();
    const navigate = useNavigate();
    const toast = useToast();
    const profileDetails = getProfileCompletionDetails(currentUser);
    const profileComplete = isProfileComplete(currentUser);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        if (!token) {
            return;
        }

        if (role === 'admin') {
            navigate('/admin');
            return;
        }

        fetchStats(token);
    }, [navigate]);

    useEffect(() => {
        setForm({
            name: currentUser?.full_name || '',
            tagline: currentUser?.tagline || '',
            phone: currentUser?.phone || '',
        });
    }, [currentUser]);

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

    const handleChange = (field) => (event) => {
        const nextValue = field === 'tagline'
            ? event.target.value.slice(0, 50)
            : event.target.value;

        setForm((prev) => ({ ...prev, [field]: nextValue }));
    };

    const hasUnsavedChanges = useMemo(
        () =>
            form.name !== (currentUser?.full_name || '') ||
            form.tagline !== (currentUser?.tagline || '') ||
            form.phone !== (currentUser?.phone || ''),
        [form, currentUser]
    );

    const resetEditingState = () => {
        setForm({
            name: currentUser?.full_name || '',
            tagline: currentUser?.tagline || '',
            phone: currentUser?.phone || '',
        });
        setIsEditing(false);
    };

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        setSaving(true);

        try {
            const response = await fetch(`${API_BASE}/api/users/update-profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: form.name,
                    tagline: form.tagline,
                    phone: form.phone,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error || 'Failed to update profile.');
                return;
            }

            updateCurrentUser(data.user);
            setIsEditing(false);
            toast.success('Profile updated.');
        } catch {
            toast.error('Profile update failed.');
        } finally {
            setSaving(false);
        }
    };

    const handleImageSelection = async (event) => {
        const file = event.target.files?.[0];
        const token = localStorage.getItem('token');

        if (!file || !token) {
            return;
        }

        const previousImage = currentUser?.profile_pic || '';
        const optimisticUrl = URL.createObjectURL(file);
        updateCurrentUser({ profile_pic: optimisticUrl });
        setUploadingImage(true);

        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch(`${API_BASE}/api/users/upload-profile-pic`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                updateCurrentUser({ profile_pic: previousImage });
                toast.error(data.error || 'Failed to upload profile picture.');
                return;
            }

            updateCurrentUser(data.user);
            toast.success('Profile picture updated.');
        } catch {
            updateCurrentUser({ profile_pic: previousImage });
            toast.error('Profile picture upload failed.');
        } finally {
            URL.revokeObjectURL(optimisticUrl);
            setUploadingImage(false);
            event.target.value = '';
        }
    };

    if (profileLoading) {
        return (
            <div className="theme-page min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-purple-600" />
            </div>
        );
    }

    if (!isLoggedIn) {
        navigate('/login');
        return null;
    }

    const statsItems = [
        { label: 'Links', value: stats?.totalLinksCreated ?? '0', icon: Link2 },
        { label: 'Listings', value: stats?.activeListings ?? '0', icon: LayoutList },
        { label: 'Profile Status', value: stats?.profileStatus ?? 'Pending', icon: Activity },
    ];

    return (
        <div className="theme-page min-h-screen">
            <Navbar />

            <div className="mx-auto max-w-6xl px-6 py-12 md:px-8">
                <div className="theme-hero rounded-2xl p-6 shadow-sm md:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                            <div className="group relative w-fit">
                                <UserAvatar
                                    user={currentUser}
                                    size="lg"
                                    className="h-[108px] w-[108px] text-3xl transition-transform duration-200 group-hover:scale-[1.02]"
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploadingImage}
                                    className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full bg-purple-600 text-white shadow-sm transition-all duration-200 hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-70"
                                    aria-label="Upload profile picture"
                                >
                                    {uploadingImage ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp"
                                    className="hidden"
                                    onChange={handleImageSelection}
                                />
                            </div>

                            <div className="min-w-0">
                                {isEditing ? (
                                    <input
                                        value={form.name}
                                        onChange={handleChange('name')}
                                        className="theme-input w-full rounded-xl border border-gray-200 px-4 py-3 text-2xl font-bold focus:border-purple-400 focus:outline-none focus:ring-4 focus:ring-purple-100 md:text-3xl"
                                        placeholder="Your name"
                                    />
                                ) : (
                                    <h1 className="theme-text-primary text-3xl font-bold" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                                        {currentUser?.full_name || 'Your profile'}
                                    </h1>
                                )}

                                {isEditing ? (
                                    <div className="mt-3 max-w-xl">
                                        <textarea
                                            value={form.tagline}
                                            onChange={handleChange('tagline')}
                                            maxLength={50}
                                            rows={2}
                                            placeholder="Add a short tagline (e.g. Tech Enthusiast)"
                                            className="theme-input w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-purple-400 focus:outline-none focus:ring-4 focus:ring-purple-100"
                                        />
                                        <div className="theme-text-muted mt-2 text-right text-xs">{form.tagline.length}/50</div>
                                    </div>
                                ) : (
                                    <p className="theme-text-muted mt-2 text-sm">
                                        {currentUser?.tagline || 'Add a short tagline (e.g. Tech Enthusiast)'}
                                    </p>
                                )}

                                <div className="mt-4 flex flex-wrap gap-2">
                                    <span className="theme-pill rounded-full px-3 py-1.5 text-xs">
                                        {currentUser?.email}
                                    </span>
                                    <span className="theme-pill rounded-full px-3 py-1.5 text-xs">
                                        {currentUser?.custom_id}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {!isEditing ? (
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                    className="theme-btn-secondary inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-colors"
                                >
                                    <PencilLine size={16} />
                                    Edit Profile
                                </button>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={resetEditingState}
                                        className="theme-btn-secondary inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSave}
                                        disabled={saving || !hasUnsavedChanges}
                                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 px-5 py-3 text-sm font-semibold text-white transition-all hover:from-purple-700 hover:to-purple-600 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                        Save Changes
                                    </button>
                                </>
                            )}
                            <button
                                onClick={handleLogout}
                                className="theme-btn-secondary inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-colors"
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    </div>

                    {!profileComplete && (
                        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800">
                            <p className="font-semibold">Complete your profile to increase trust.</p>
                            <p className="mt-1 text-xs text-amber-700">
                                Completion: {profileDetails.completionPercentage}%. Missing: {profileDetails.missingFields.map((field) => {
                                    if (field === 'phoneNumber') return 'Phone';
                                    if (field === 'location') return 'Location';
                                    return 'Email';
                                }).join(', ')}
                            </p>
                            <button
                                type="button"
                                onClick={() => navigate('/profile')}
                                className="mt-3 inline-flex items-center rounded-lg bg-amber-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-amber-700"
                            >
                                Complete Profile
                            </button>
                        </div>
                    )}
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_0.9fr]">
                    <div className="theme-surface rounded-2xl p-6">
                        <div className="mb-6 flex items-center justify-between gap-4">
                            <div>
                                <h2 className="theme-text-primary text-lg font-semibold">Profile Essentials</h2>
                                <p className="theme-text-muted mt-1 text-sm">Your core profile details at a glance.</p>
                            </div>
                        </div>

                        {isEditing && (
                            <div className="theme-subtle-panel mb-6 rounded-xl p-5">
                                <label className="block">
                                    <span className="theme-text-muted mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em]">Phone</span>
                                    <input
                                        value={form.phone}
                                        onChange={handleChange('phone')}
                                        className="theme-input w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-purple-400 focus:outline-none focus:ring-4 focus:ring-purple-100"
                                        placeholder="Add your phone number"
                                    />
                                </label>
                            </div>
                        )}

                        <div className="grid gap-6 sm:grid-cols-2">
                            {detailCards.map(({ key, label, icon }) => (
                                <DetailCard key={key} icon={icon} label={label} value={currentUser?.[key]} />
                            ))}
                        </div>
                    </div>

                    <div className="theme-surface rounded-2xl p-6">
                        <h3 className="theme-text-primary text-lg font-semibold">Activity Snapshot</h3>
                        <p className="theme-text-muted mt-1 text-sm">A quick summary of your account activity.</p>

                        <div className="mt-6 grid gap-4">
                            {statsError && <p className="text-sm text-red-500">Failed to load stats.</p>}
                            {!statsError && statsItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                <div key={item.label} className="theme-surface rounded-xl p-5">
                                    <p className="theme-text-muted text-[11px] font-semibold uppercase tracking-[0.18em]">{item.label}</p>
                                    <div className="mt-3 flex items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                                            <Icon size={16} />
                                        </div>
                                        <p className="theme-text-primary text-2xl font-bold">
                                            {statsLoading ? <span className="inline-block h-8 w-20 animate-pulse rounded-lg bg-gray-200" /> : item.value}
                                        </p>
                                    </div>
                                </div>
                            );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Account;
