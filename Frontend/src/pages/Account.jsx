import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { Activity, Camera, LayoutList, Loader2, LogOut, Mail, MapPin, PencilLine, Phone, Save, Link2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import UserAvatar from '../components/UserAvatar';
import { useAppContext } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import API_BASE from '../utils/api';
import { getProfileCompletionDetails, isProfileComplete } from '../utils/profileCompletion';
import { editProfileSchema } from '../utils/validationSchemas';

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

const fieldState = (touched, error, value) => {
    if (touched && error) return 'border-red-400 focus:ring-red-100 focus:border-red-400';
    if (touched && !error && value) return 'border-emerald-400 focus:ring-emerald-100 focus:border-emerald-400';
    return 'border-gray-200 focus:border-purple-400 focus:ring-purple-100';
};

const FieldError = ({ touched, error }) =>
    touched && error ? (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
            <span className="inline-block h-1 w-1 rounded-full bg-red-400" />
            {error}
        </p>
    ) : null;

const normalizePhoneForForm = (phone) => {
    const raw = String(phone || '').trim();
    if (!raw) return '';
    return raw.startsWith('+91') ? raw.slice(3) : raw;
};

const Account = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [stats, setStats] = useState(null);
    const [statsLoading, setStatsLoading] = useState(true);
    const [statsError, setStatsError] = useState(false);
    const fileInputRef = useRef(null);

    const { isLoggedIn, logout, currentUser, profileLoading, updateCurrentUser } = useAppContext();
    const navigate = useNavigate();
    const toast = useToast();
    const profileDetails = getProfileCompletionDetails(currentUser);
    const profileComplete = isProfileComplete(currentUser);
    const formik = useFormik({
        initialValues: {
            name: currentUser?.full_name || '',
            tagline: currentUser?.tagline || '',
            phone: normalizePhoneForForm(currentUser?.phone),
        },
        enableReinitialize: true,
        validationSchema: editProfileSchema,
        validateOnMount: true,
        onSubmit: async (values) => {
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
                        name: values.name.trim(),
                        tagline: values.tagline.trim(),
                        phone: values.phone ? `+91${values.phone}` : '',
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
        },
    });

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
            : field === 'phone'
                ? event.target.value.replace(/\D/g, '').slice(0, 10)
                : event.target.value;

        formik.setFieldValue(field, nextValue);
        if (formik.touched[field]) {
            formik.validateField(field);
        }
    };

    const hasUnsavedChanges = useMemo(
        () =>
            formik.values.name !== (currentUser?.full_name || '') ||
            formik.values.tagline !== (currentUser?.tagline || '') ||
            formik.values.phone !== normalizePhoneForForm(currentUser?.phone),
        [formik.values, currentUser]
    );

    const resetEditingState = () => {
        formik.resetForm({
            values: {
                name: currentUser?.full_name || '',
                tagline: currentUser?.tagline || '',
                phone: normalizePhoneForForm(currentUser?.phone),
            },
        });
        setIsEditing(false);
    };

    const openEditingState = () => {
        formik.resetForm({
            values: {
                name: currentUser?.full_name || '',
                tagline: currentUser?.tagline || '',
                phone: normalizePhoneForForm(currentUser?.phone),
            },
        });
        setIsEditing(true);
    };

    const handleSave = async () => {
        const errors = await formik.validateForm();
        formik.setTouched({
            name: true,
            tagline: true,
            phone: true,
        });

        if (Object.keys(errors).length > 0) {
            toast.error('Please fix the highlighted fields.');
            return;
        }

        await formik.submitForm();
    };

    const form = {
        name: formik.values.name,
        tagline: formik.values.tagline,
        phone: formik.values.phone,
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
                                        onBlur={formik.handleBlur}
                                        name="name"
                                        className={`theme-input w-full rounded-xl border px-4 py-3 text-2xl font-bold focus:outline-none focus:ring-4 md:text-3xl ${fieldState(formik.touched.name, formik.errors.name, form.name)}`}
                                        placeholder="Your name"
                                    />
                                ) : (
                                    <h1 className="theme-text-primary text-3xl font-bold" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                                        {currentUser?.full_name || 'Your profile'}
                                    </h1>
                                )}
                                {isEditing && <FieldError touched={formik.touched.name} error={formik.errors.name} />}

                                {isEditing ? (
                                    <div className="mt-3 max-w-xl">
                                        <textarea
                                            value={form.tagline}
                                            onChange={handleChange('tagline')}
                                            onBlur={formik.handleBlur}
                                            name="tagline"
                                            maxLength={50}
                                            rows={2}
                                            placeholder="Add a short tagline (e.g. Tech Enthusiast)"
                                            className={`theme-input w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-4 ${fieldState(formik.touched.tagline, formik.errors.tagline, form.tagline)}`}
                                        />
                                        <FieldError touched={formik.touched.tagline} error={formik.errors.tagline} />
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
                                    onClick={openEditingState}
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
                                    <div className={`theme-input flex items-center overflow-hidden rounded-xl border transition-all duration-200 ${
                                        formik.touched.phone && formik.errors.phone
                                            ? 'border-red-400 ring-4 ring-red-100'
                                            : formik.touched.phone && !formik.errors.phone && form.phone
                                                ? 'border-emerald-400 ring-4 ring-emerald-100'
                                                : 'border-gray-200 focus-within:border-purple-400 focus-within:ring-4 focus-within:ring-purple-100'
                                    }`}>
                                        <span className="theme-subtle-panel theme-text-secondary whitespace-nowrap border-r border-slate-200 px-4 py-3 text-sm font-semibold select-none">
                                            +91
                                        </span>
                                        <input
                                            value={form.phone}
                                            onChange={handleChange('phone')}
                                            onBlur={formik.handleBlur}
                                            name="phone"
                                            maxLength={10}
                                            inputMode="numeric"
                                            className="theme-text-primary flex-1 bg-transparent px-4 py-3 text-sm placeholder:text-slate-400 focus:outline-none"
                                            placeholder="10-digit mobile number"
                                        />
                                    </div>
                                    <FieldError touched={formik.touched.phone} error={formik.errors.phone} />
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
