import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Bell, Shield, User, UserCircle, Trash2, Camera } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API_BASE from '../utils/api';
import { useAppContext } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import SettingsLayout from '../components/settings/SettingsLayout';
import SettingsSidebar from '../components/settings/SettingsSidebar';
import SettingsForm from '../components/settings/SettingsForm';
import SettingsInputField from '../components/settings/SettingsInputField';
import SettingsTextArea from '../components/settings/SettingsTextArea';
import ToggleSwitch from '../components/settings/ToggleSwitch';
import UserAvatar from '../components/UserAvatar';

const TABS = [
    { key: 'account', label: 'Account', icon: User },
    { key: 'profile', label: 'Profile', icon: UserCircle },
    { key: 'security', label: 'Security', icon: Shield },
    { key: 'notifications', label: 'Notifications', icon: Bell },
];

const primaryBtn =
    'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-px active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed';

const dangerBtn =
    'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed';

const cardSubtle = 'theme-surface rounded-2xl p-6 backdrop-blur-xl md:p-8';

const readToken = () => localStorage.getItem('token') || '';

const Settings = () => {
    const { isLoggedIn, currentUser, profileLoading, refreshCurrentUser, updateCurrentUser, logout } = useAppContext();
    const toast = useToast();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const activeTab = useMemo(() => {
        const key = (searchParams.get('tab') || 'account').toLowerCase();
        return TABS.some((t) => t.key === key) ? key : 'account';
    }, [searchParams]);

    const setTab = (key) => setSearchParams({ tab: key });

    const [accountForm, setAccountForm] = useState({ fullName: '', email: '', phone: '' });
    const [profileForm, setProfileForm] = useState({ bio: '', city: '', state: '' });
    const [securityForm, setSecurityForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [notifForm, setNotifForm] = useState({
        emailNotifications: true,
        interestAlerts: true,
        productUpdates: false,
    });

    const [accountSaving, setAccountSaving] = useState(false);
    const [profileSaving, setProfileSaving] = useState(false);
    const [securitySaving, setSecuritySaving] = useState(false);
    const [uploadingPic, setUploadingPic] = useState(false);
    const [errors, setErrors] = useState({});
    const [securityError, setSecurityError] = useState('');
    const [securitySuccess, setSecuritySuccess] = useState('');
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteStep, setDeleteStep] = useState(1);
    const [deleteText, setDeleteText] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        if (!isLoggedIn) return;
        if (!currentUser && !profileLoading) {
            refreshCurrentUser();
        }
    }, [isLoggedIn, currentUser, profileLoading, refreshCurrentUser]);

    useEffect(() => {
        if (!currentUser) return;
        setAccountForm({
            fullName: currentUser.full_name || '',
            email: currentUser.email || '',
            phone: currentUser.phone || '',
        });
        setProfileForm({
            bio: currentUser.tagline || '',
            city: currentUser.city || '',
            state: currentUser.state || '',
        });
    }, [currentUser]);

    useEffect(() => {
        try {
            const stored = localStorage.getItem('settings.notifications');
            if (!stored) return;
            const parsed = JSON.parse(stored);
            setNotifForm((prev) => ({ ...prev, ...parsed }));
        } catch {
            // ignore
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('settings.notifications', JSON.stringify(notifForm));
    }, [notifForm]);

    useEffect(() => {
        setErrors({});
        setSecurityError('');
        setSecuritySuccess('');
        if (activeTab !== 'account') {
            setDeleteOpen(false);
            setDeleteStep(1);
            setDeleteText('');
            setDeleteLoading(false);
        }
    }, [activeTab]);

    const validateAccount = () => {
        const nextErrors = {};
        if (!accountForm.fullName.trim()) nextErrors.fullName = 'Full name is required.';

        const phone = String(accountForm.phone || '').trim();
        if (phone && !/^[6-9][0-9]{9}$/.test(phone)) {
            nextErrors.phone = 'Enter a valid 10-digit mobile number.';
        }

        setErrors((prev) => ({ ...prev, ...nextErrors }));
        return Object.keys(nextErrors).length === 0;
    };

    const validateProfile = () => {
        const nextErrors = {};
        if (String(profileForm.bio || '').length > 50) nextErrors.bio = 'Bio must be 50 characters or fewer.';
        setErrors((prev) => ({ ...prev, ...nextErrors }));
        return Object.keys(nextErrors).length === 0;
    };

    const validateSecurity = () => {
        const nextErrors = {};

        if (!securityForm.currentPassword) nextErrors.currentPassword = 'Current password is required.';
        if (!securityForm.newPassword) nextErrors.newPassword = 'New password is required.';
        if (securityForm.newPassword && securityForm.newPassword.length < 8) nextErrors.newPassword = 'Minimum 8 characters.';
        if (!securityForm.confirmPassword) nextErrors.confirmPassword = 'Please confirm your new password.';
        if (securityForm.newPassword && securityForm.confirmPassword && securityForm.newPassword !== securityForm.confirmPassword) {
            nextErrors.confirmPassword = 'Passwords do not match.';
        }

        setErrors((prev) => ({ ...prev, ...nextErrors }));
        return Object.keys(nextErrors).length === 0;
    };

    const authFetch = async (url, options = {}) => {
        const token = readToken();
        return fetch(url, {
            ...options,
            headers: {
                ...(options.headers || {}),
                Authorization: `Bearer ${token}`,
            },
        });
    };

    const handleSaveAccount = async () => {
        setErrors({});
        if (!validateAccount()) return;

        const token = readToken();
        if (!token) {
            toast.error('Please sign in to update settings.');
            navigate('/login');
            return;
        }

        setAccountSaving(true);
        try {
            const res = await authFetch(`${API_BASE}/api/users/update-profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: accountForm.fullName,
                    phone: String(accountForm.phone || '').trim(),
                }),
            });
            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || 'Failed to save changes.');
                return;
            }

            updateCurrentUser(data.user || {});
            toast.success('Account settings saved.');
        } catch {
            toast.error('Server error. Please try again later.');
        } finally {
            setAccountSaving(false);
        }
    };

    const handleSaveProfile = async () => {
        setErrors({});
        if (!validateProfile()) return;

        const token = readToken();
        if (!token) {
            toast.error('Please sign in to update settings.');
            navigate('/login');
            return;
        }

        setProfileSaving(true);
        try {
            const res1 = await authFetch(`${API_BASE}/api/users/update-profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tagline: profileForm.bio }),
            });
            const data1 = await res1.json();
            if (!res1.ok) {
                toast.error(data1.error || 'Failed to save profile.');
                return;
            }
            updateCurrentUser(data1.user || {});

            const payload = {
                phone: (currentUser?.phone ?? '').toString(),
                address: currentUser?.address ?? '',
                city: profileForm.city,
                state: profileForm.state,
                pincode: (currentUser?.pincode ?? '').toString(),
            };

            const res2 = await authFetch(`${API_BASE}/api/profile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res2.ok) {
                toast.warning('Bio saved. Location update is unavailable right now.');
                return;
            }

            await refreshCurrentUser();
            toast.success('Profile settings saved.');
        } catch {
            toast.error('Server error. Please try again later.');
        } finally {
            setProfileSaving(false);
        }
    };

    const handleUploadPic = async (file) => {
        if (!file) return;
        const token = readToken();
        if (!token) {
            toast.error('Please sign in to update settings.');
            navigate('/login');
            return;
        }

        setUploadingPic(true);
        try {
            const fd = new FormData();
            fd.append('image', file);

            const res = await authFetch(`${API_BASE}/api/users/upload-profile-pic`, {
                method: 'POST',
                body: fd,
            });
            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || 'Failed to upload picture.');
                return;
            }

            updateCurrentUser(data.user || {});
            toast.success('Profile picture updated.');
        } catch {
            toast.error('Server error. Please try again later.');
        } finally {
            setUploadingPic(false);
        }
    };

    const handleChangePassword = async () => {
        setErrors({});
        setSecurityError('');
        setSecuritySuccess('');

        if (!validateSecurity()) return;

        const token = readToken();
        if (!token) {
            toast.error('Please sign in to update settings.');
            navigate('/login');
            return;
        }

        setSecuritySaving(true);
        try {
            const res = await authFetch(`${API_BASE}/api/auth/change-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: securityForm.currentPassword,
                    newPassword: securityForm.newPassword,
                }),
            });
            const data = await res.json();

            if (!res.ok || data?.success === false) {
                const msg = data?.message || 'Failed to change password.';
                setSecurityError(msg);
                toast.error(msg);
                return;
            }

            const msg = data?.message || 'Password updated successfully.';
            setSecuritySuccess(msg);
            toast.success(msg);
            setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch {
            setSecurityError('Server error. Please try again later.');
        } finally {
            setSecuritySaving(false);
        }
    };

    const openDeleteModal = () => {
        setDeleteStep(1);
        setDeleteText('');
        setDeleteOpen(true);
    };

    const closeDeleteModal = () => {
        setDeleteOpen(false);
        setDeleteStep(1);
        setDeleteText('');
        setDeleteLoading(false);
    };

    const handleDeleteAccount = async () => {
        const token = readToken();
        if (!token) {
            toast.error('Please sign in to continue.');
            navigate('/login');
            return;
        }

        setDeleteLoading(true);
        try {
            const res = await authFetch(`${API_BASE}/api/auth/delete-account`, {
                method: 'DELETE',
            });
            const data = await res.json();

            if (!res.ok || data?.success === false) {
                toast.error(data?.message || 'Account deletion failed.');
                return;
            }

            logout();
            toast.success('Your account has been deleted');
            navigate('/', { replace: true });
        } catch {
            toast.error('Server error. Please try again later.');
        } finally {
            setDeleteLoading(false);
            closeDeleteModal();
        }
    };

    if (!isLoggedIn) {
        return (
            <>
                <Navbar />
                <SettingsLayout title="Settings" subtitle="Manage your account preferences.">
                    <div className={cardSubtle}>
                        <p className="theme-text-primary font-medium">You need to be signed in to access settings.</p>
                        <div className="mt-5 flex items-center gap-3">
                            <button className={primaryBtn} type="button" onClick={() => navigate('/login')}>
                                Go to Login
                            </button>
                            <Link className="text-sm font-semibold text-indigo-600 hover:text-indigo-700" to="/signup">
                                Create an account
                            </Link>
                        </div>
                    </div>
                </SettingsLayout>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />

            <SettingsLayout title="Settings" subtitle="Keep your account details and preferences up to date.">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-[280px_1fr]">
                    <SettingsSidebar tabs={TABS} activeKey={activeTab} onChange={setTab} />

                    <div className="space-y-6">
                        {activeTab === 'account' ? (
                            <>
                                <SettingsForm
                                    title="Account"
                                    description="Update your basic account details."
                                    footer={(
                                        <div className="flex items-center justify-end">
                                            <button type="button" className={primaryBtn} onClick={handleSaveAccount} disabled={accountSaving}>
                                                {accountSaving ? 'Saving...' : 'Save Changes'}
                                            </button>
                                        </div>
                                    )}
                                >
                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                        <SettingsInputField
                                            label="Full Name"
                                            name="fullName"
                                            value={accountForm.fullName}
                                            onChange={(e) => {
                                                setAccountForm((p) => ({ ...p, fullName: e.target.value }));
                                                if (errors.fullName) setErrors((p) => ({ ...p, fullName: '' }));
                                            }}
                                            placeholder="Your full name"
                                            error={errors.fullName}
                                            autoComplete="name"
                                        />
                                        <SettingsInputField
                                            label="Email"
                                            name="email"
                                            type="email"
                                            value={accountForm.email}
                                            onChange={() => {}}
                                            readOnly
                                            helper="Email changes are currently not supported."
                                            autoComplete="email"
                                        />
                                    </div>

                                    <SettingsInputField
                                        label="Phone"
                                        name="phone"
                                        value={accountForm.phone}
                                        onChange={(e) => {
                                            setAccountForm((p) => ({ ...p, phone: e.target.value }));
                                            if (errors.phone) setErrors((p) => ({ ...p, phone: '' }));
                                        }}
                                        placeholder="10-digit mobile number"
                                        error={errors.phone}
                                        autoComplete="tel"
                                    />
                                </SettingsForm>

                                <div className="theme-surface rounded-2xl border border-red-100 p-6 backdrop-blur-xl md:p-8">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h3 className="theme-text-primary text-lg font-semibold">Danger Zone</h3>
                                            <p className="theme-text-muted mt-1 text-sm">
                                                Deleting your account is permanent. Your data will be removed.
                                            </p>
                                        </div>
                                        <button type="button" className={dangerBtn} onClick={openDeleteModal}>
                                            <Trash2 size={16} />Delete Account
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : null}

                        {activeTab === 'profile' ? (
                            <SettingsForm
                                title="Profile"
                                description="Personalize how you appear to others."
                                footer={(
                                    <div className="flex items-center justify-end">
                                        <button type="button" className={primaryBtn} onClick={handleSaveProfile} disabled={profileSaving}>
                                            {profileSaving ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                )}
                            >
                                <div className="flex items-center gap-5">
                                    <UserAvatar user={currentUser} size="md" className="border-2 border-white shadow-md" />
                                    <div className="flex-1">
                                        <p className="theme-text-primary text-sm font-semibold">Profile Picture</p>
                                        <p className="theme-text-muted mt-1 text-xs">
                                            Upload a clear photo to help others recognize you.
                                        </p>
                                        <div className="mt-3 flex items-center gap-3">
                                            <label className={`${primaryBtn} w-auto cursor-pointer px-4 py-2.5 ${uploadingPic ? 'pointer-events-none' : ''}`}>
                                                <Camera size={16} />
                                                {uploadingPic ? 'Uploading...' : 'Upload'}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => handleUploadPic(e.target.files?.[0])}
                                                />
                                            </label>
                                            <p className="theme-text-muted text-xs">JPG/PNG/WEBP</p>
                                        </div>
                                    </div>
                                </div>

                                <SettingsTextArea
                                    label="Bio"
                                    name="bio"
                                    value={profileForm.bio}
                                    onChange={(e) => {
                                        setProfileForm((p) => ({ ...p, bio: e.target.value }));
                                        if (errors.bio) setErrors((p) => ({ ...p, bio: '' }));
                                    }}
                                    placeholder="A short bio (max 50 characters)"
                                    helper="This shows up on your profile."
                                    maxLength={50}
                                    error={errors.bio}
                                />

                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                    <SettingsInputField
                                        label="City"
                                        name="city"
                                        value={profileForm.city}
                                        onChange={(e) => setProfileForm((p) => ({ ...p, city: e.target.value }))}
                                        placeholder="e.g. Ahmedabad"
                                    />
                                    <SettingsInputField
                                        label="State"
                                        name="state"
                                        value={profileForm.state}
                                        onChange={(e) => setProfileForm((p) => ({ ...p, state: e.target.value }))}
                                        placeholder="e.g. Gujarat"
                                    />
                                </div>
                            </SettingsForm>
                        ) : null}

                        {activeTab === 'security' ? (
                            <SettingsForm
                                title="Security"
                                description="Manage password and account security."
                                footer={(
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <Link to="/forgot-password" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                                            Forgot your password?
                                        </Link>
                                        <button
                                            type="button"
                                            className={primaryBtn}
                                            onClick={handleChangePassword}
                                            disabled={securitySaving}
                                        >
                                            {securitySaving ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                )}
                            >
                                {securityError ? (
                                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                        {securityError}
                                    </div>
                                ) : null}
                                {securitySuccess ? (
                                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                                        {securitySuccess}
                                    </div>
                                ) : null}
                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                    <SettingsInputField
                                        label="Current Password"
                                        name="currentPassword"
                                        type="password"
                                        value={securityForm.currentPassword}
                                        onChange={(e) => {
                                            setSecurityForm((p) => ({ ...p, currentPassword: e.target.value }));
                                            if (errors.currentPassword) setErrors((p) => ({ ...p, currentPassword: '' }));
                                            if (securityError) setSecurityError('');
                                            if (securitySuccess) setSecuritySuccess('');
                                        }}
                                        error={errors.currentPassword}
                                        autoComplete="current-password"
                                    />
                                    <SettingsInputField
                                        label="New Password"
                                        name="newPassword"
                                        type="password"
                                        value={securityForm.newPassword}
                                        onChange={(e) => {
                                            setSecurityForm((p) => ({ ...p, newPassword: e.target.value }));
                                            if (errors.newPassword) setErrors((p) => ({ ...p, newPassword: '' }));
                                            if (errors.confirmPassword) setErrors((p) => ({ ...p, confirmPassword: '' }));
                                            if (securityError) setSecurityError('');
                                            if (securitySuccess) setSecuritySuccess('');
                                        }}
                                        error={errors.newPassword}
                                        helper="Minimum 8 characters."
                                        autoComplete="new-password"
                                    />
                                    <SettingsInputField
                                        label="Confirm Password"
                                        name="confirmPassword"
                                        type="password"
                                        value={securityForm.confirmPassword}
                                        onChange={(e) => {
                                            setSecurityForm((p) => ({ ...p, confirmPassword: e.target.value }));
                                            if (errors.confirmPassword) setErrors((p) => ({ ...p, confirmPassword: '' }));
                                            if (securityError) setSecurityError('');
                                            if (securitySuccess) setSecuritySuccess('');
                                        }}
                                        error={errors.confirmPassword}
                                        autoComplete="new-password"
                                    />
                                </div>

                                <div className="theme-subtle-panel rounded-xl p-4">
                                    <p className="theme-text-primary text-sm font-semibold">Tip</p>
                                    <p className="theme-text-secondary mt-1 text-sm">
                                        Use a strong password with uppercase, lowercase, a number, and a special character.
                                    </p>
                                </div>
                            </SettingsForm>
                        ) : null}

                        {activeTab === 'notifications' ? (
                            <SettingsForm
                                title="Notifications"
                                description="Choose what you want to be notified about."
                                footer={(
                                    <div className="flex items-center justify-end">
                                        <button type="button" className={primaryBtn} onClick={() => toast.success('Notification preferences saved.')}>
                                            Save Changes
                                        </button>
                                    </div>
                                )}
                            >
                                <div className="space-y-5">
                                    <ToggleSwitch
                                        label="Email Notifications"
                                        description="Product updates and important account messages."
                                        checked={!!notifForm.emailNotifications}
                                        onChange={(next) => setNotifForm((p) => ({ ...p, emailNotifications: next }))}
                                    />
                                    <div className="border-t border-slate-100" />
                                    <ToggleSwitch
                                        label="Interest Alerts"
                                        description="Get notified when someone shows interest in your listings."
                                        checked={!!notifForm.interestAlerts}
                                        onChange={(next) => setNotifForm((p) => ({ ...p, interestAlerts: next }))}
                                    />
                                    <div className="border-t border-slate-100" />
                                    <ToggleSwitch
                                        label="Product Updates"
                                        description="New features, improvements, and announcements."
                                        checked={!!notifForm.productUpdates}
                                        onChange={(next) => setNotifForm((p) => ({ ...p, productUpdates: next }))}
                                    />
                                </div>
                            </SettingsForm>
                        ) : null}
                    </div>
                </div>

                {deleteOpen && activeTab === 'account' ? (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                        <div className="theme-modal-backdrop absolute inset-0" onClick={closeDeleteModal} aria-hidden="true" />
                        <div className="theme-surface relative w-full max-w-md rounded-2xl border p-6 animate-fade-in">
                            {deleteStep === 1 ? (
                                <>
                                    <h4 className="theme-text-primary text-lg font-semibold">Delete account?</h4>
                                    <p className="theme-text-secondary mt-2 text-sm">
                                        Are you sure you want to delete your account? This action can't be undone.
                                    </p>

                                    <div className="mt-6 flex items-center justify-end gap-3">
                                        <button
                                            type="button"
                                            className="theme-btn-secondary rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors"
                                            onClick={closeDeleteModal}
                                            disabled={deleteLoading}
                                        >
                                            Cancel
                                        </button>
                                        <button type="button" className={dangerBtn} onClick={() => setDeleteStep(2)} disabled={deleteLoading}>
                                            Continue
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h4 className="theme-text-primary text-lg font-semibold">Final confirmation</h4>
                                    <p className="theme-text-secondary mt-2 text-sm">
                                        This action is permanent. Type <span className="theme-text-primary font-semibold">DELETE</span> to confirm.
                                    </p>

                                    <div className="mt-5">
                                        <SettingsInputField
                                            label="Confirmation"
                                            name="deleteConfirm"
                                            value={deleteText}
                                            onChange={(e) => setDeleteText(e.target.value)}
                                            placeholder="Type DELETE"
                                        />
                                    </div>

                                    <div className="mt-6 flex items-center justify-end gap-3">
                                        <button
                                            type="button"
                                            className="theme-btn-secondary rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors"
                                            onClick={closeDeleteModal}
                                            disabled={deleteLoading}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            className={dangerBtn}
                                            onClick={handleDeleteAccount}
                                            disabled={deleteLoading || deleteText.trim().toUpperCase() !== 'DELETE'}
                                        >
                                            {deleteLoading ? 'Deleting...' : 'Yes, delete'}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ) : null}
            </SettingsLayout>

            <Footer />
        </>
    );
};

export default Settings;
