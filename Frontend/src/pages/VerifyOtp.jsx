import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Brand from '../components/Brand';
import API_BASE from '../utils/api';
import AuthCard from '../components/auth/AuthCard';
import InputField from '../components/auth/InputField';
import PrimaryButton from '../components/auth/PrimaryButton';
import { useToast } from '../context/ToastContext';

const getEmailFromLocation = (location) => {
    const params = new URLSearchParams(location.search);
    return (location.state?.email || params.get('email') || '').trim().toLowerCase();
};

const VerifyOtp = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const toast = useToast();

    const email = useMemo(() => getEmailFromLocation(location), [location]);
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const otpError = useMemo(() => {
        if (!error) return '';
        return error;
    }, [error]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email) {
            setError('Email is missing. Please restart the flow.');
            return;
        }

        const sanitizedOtp = otp.replace(/\D/g, '').slice(0, 6);
        if (sanitizedOtp.length !== 6) {
            setError('Enter the 6-digit OTP.');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp: sanitizedOtp }),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'OTP verification failed.');
                return;
            }

            const message = data.message || 'OTP verified successfully.';
            toast.success(message);
            navigate(`/reset-password?email=${encodeURIComponent(email)}`, { state: { email } });
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
                        <Brand withText className="justify-center" logoClassName="h-12 w-auto" textClassName="text-3xl" ariaLabel="LinkCart home" />
                        <p className="theme-text-secondary mt-2 text-sm">
                            {email ? `Enter the 6-digit code sent to ${email}` : 'Enter the 6-digit code'}
                        </p>
                    </div>

                    <AuthCard title="OTP Verification" subtitle="This code expires in a few minutes.">
                        {otpError ? (
                            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                {otpError}
                            </div>
                        ) : null}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                            <InputField
                                icon={ShieldCheck}
                                type="text"
                                name="otp"
                                placeholder="6-digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                inputMode="numeric"
                                maxLength={6}
                                autoComplete="one-time-code"
                            />

                            <PrimaryButton type="submit" loading={loading}>
                                Verify OTP
                            </PrimaryButton>
                        </form>

                        <div className="mt-6 border-t pt-6">
                            <p className="theme-text-secondary text-center text-sm">
                                Didn't get the code?{' '}
                                <Link to="/forgot-password" className="font-semibold text-indigo-600">
                                    Resend OTP
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

export default VerifyOtp;
