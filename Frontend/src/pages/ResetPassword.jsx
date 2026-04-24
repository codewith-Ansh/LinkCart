import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API_BASE from '../utils/api';
import AuthCard from '../components/auth/AuthCard';
import InputField from '../components/auth/InputField';
import PrimaryButton from '../components/auth/PrimaryButton';
import { useToast } from '../context/ToastContext';

const getEmailFromLocation = (location) => {
    const params = new URLSearchParams(location.search);
    return (location.state?.email || params.get('email') || '').trim().toLowerCase();
};

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const toast = useToast();

    const email = useMemo(() => getEmailFromLocation(location), [location]);

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const validate = () => {
        if (!email) return 'Email is missing. Please restart the flow.';
        if (!newPassword || newPassword.length < 8) return 'Password must be at least 8 characters.';
        if (newPassword !== confirmPassword) return 'Passwords do not match.';
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, newPassword }),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Password reset failed.');
                return;
            }

            const message = data.message || 'Password reset successful.';
            setSuccess(message);
            toast.success(message);

            setTimeout(() => {
                navigate('/login', { state: { successMessage: 'Password updated. Please sign in.' } });
            }, 900);
        } catch {
            setError('Server error. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />

            <div className="theme-page min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-14">
                <div className="w-full max-w-md">
                    <div className="mb-8 text-center">
                        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
                            LinkCart
                        </span>
                        <p className="theme-text-secondary mt-2 text-sm">Create a new password for your account</p>
                    </div>

                    <AuthCard title="Reset Password" subtitle={email ? `Account: ${email}` : 'Account email required'}>
                        {error ? (
                            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                {error}
                            </div>
                        ) : null}
                        {success ? (
                            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                                {success} Redirecting...
                            </div>
                        ) : null}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                            <InputField
                                icon={Lock}
                                type="password"
                                name="newPassword"
                                placeholder="New password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                autoComplete="new-password"
                            />

                            <InputField
                                icon={Lock}
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                autoComplete="new-password"
                            />

                            <PrimaryButton type="submit" loading={loading}>
                                Reset Password
                            </PrimaryButton>
                        </form>

                        <div className="mt-6 border-t pt-6">
                            <p className="theme-text-secondary text-center text-sm">
                                Changed your mind?{' '}
                                <Link to="/login" className="font-semibold text-indigo-600">
                                    Back to login
                                </Link>
                            </p>
                        </div>
                    </AuthCard>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default ResetPassword;
