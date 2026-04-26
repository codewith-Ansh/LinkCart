import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { User, Mail, Lock, ShieldCheck, ArrowRight, Loader2, CheckCircle2, RefreshCw } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Brand from '../components/Brand';
import { signupSchema } from '../utils/validationSchemas';
import GoogleButton from '../components/GoogleButton';
import API_BASE from '../utils/api';
import { useToast } from '../context/ToastContext';
import IndianDoodleBg from '../components/auth/IndianDoodleBg';

const fieldState = (touched, error, value) => {
    if (touched && error) return 'border-red-400 ring-red-100 focus:ring-red-200 focus:border-red-400';
    if (touched && !error && value) return 'border-emerald-400 ring-emerald-100 focus:ring-emerald-200 focus:border-emerald-400';
    return 'border-slate-200 ring-transparent focus:ring-indigo-100 focus:border-indigo-400';
};

const inputBase = 'theme-input w-full rounded-xl py-3 pr-4 pl-10 text-sm focus:outline-none focus:ring-4 transition-all duration-200';

const Field = ({ icon: Icon, touched, error, children }) => (
    <div className="relative">
        <Icon size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 theme-text-muted" />
        {children}
        {touched && error ? (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
                <span className="inline-block h-1 w-1 rounded-full bg-red-400" />
                {error}
            </p>
        ) : null}
    </div>
);

const Signup = () => {
    const [serverError, setServerError] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [otpValue, setOtpValue] = useState('');
    const [otpError, setOtpError] = useState('');
    const [otpLoading, setOtpLoading] = useState(false);
    const [otpSuccess, setOtpSuccess] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    const formik = useFormik({
        initialValues: { fullName: '', email: '', password: '', confirmPassword: '' },
        validationSchema: signupSchema,
        onSubmit: async (values, { setSubmitting }) => {
            if (!otpVerified) {
                setServerError('Please verify your email with OTP before signing up.');
                setSubmitting(false);
                return;
            }
            setServerError('');
            try {
                const response = await fetch(`${API_BASE}/api/auth/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fullName: values.fullName, email: values.email, password: values.password }),
                });
                const data = await response.json();
                if (!response.ok) {
                    setServerError(data.error || 'Signup failed');
                    return;
                }
                toast.success('Registration successful! Redirecting to login...');
                navigate('/login');
            } catch {
                setServerError('Server error. Please try again later.');
            } finally {
                setSubmitting(false);
            }
        },
    });

    const handleSendOtp = async () => {
        if (!formik.values.email || formik.errors.email) {
            formik.setFieldTouched('email', true);
            return;
        }
        setOtpLoading(true);
        setOtpError('');
        setServerError('');
        setOtpSuccess(false);
        try {
            const res = await fetch(`${API_BASE}/api/auth/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formik.values.email }),
            });
            const data = await res.json();
            if (!res.ok) {
                setServerError(data.error || 'Failed to send OTP');
                return;
            }
            setOtpSent(true);
            setOtpVerified(false);
            setOtpValue('');
            setOtpSuccess(true);
        } catch {
            setServerError('Server error. Please try again later.');
        } finally {
            setOtpLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (otpValue.length !== 6) {
            setOtpError('Enter a valid 6-digit OTP');
            return;
        }
        setOtpLoading(true);
        setOtpError('');
        try {
            const res = await fetch(`${API_BASE}/api/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formik.values.email, otp: otpValue }),
            });
            const data = await res.json();
            if (!res.ok) {
                setOtpError(data.error || 'OTP verification failed');
                return;
            }
            setOtpVerified(true);
        } catch {
            setOtpError('Server error. Please try again later.');
        } finally {
            setOtpLoading(false);
        }
    };

    const otpBtnLabel = () => {
        if (otpLoading && !otpSent) return <><Loader2 size={14} className="animate-spin" />Sending...</>;
        if (otpVerified) return <><CheckCircle2 size={14} />Verified</>;
        if (otpSent) return <><RefreshCw size={14} />Resend</>;
        return 'Send OTP';
    };

    return (
        <>
            <Navbar />

            <div className="theme-page min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-14" style={{ position: 'relative' }}>
                <IndianDoodleBg />

                <div className="w-full max-w-md animate-fade-in" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="mb-8 text-center">
                        <Brand withText className="justify-center" logoClassName="h-12 w-auto" textClassName="text-3xl" ariaLabel="LinkCart home" />
                        <p className="theme-text-secondary mt-2 text-sm">Create your free account</p>
                    </div>

                    <div className="theme-surface rounded-2xl p-8 backdrop-blur-xl">
                        {serverError ? (
                            <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 animate-fade-in">
                                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">!</span>
                                {serverError}
                            </div>
                        ) : null}

                        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4" noValidate>
                            <Field icon={User} touched={formik.touched.fullName} error={formik.errors.fullName}>
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Full Name"
                                    value={formik.values.fullName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`${inputBase} ${fieldState(formik.touched.fullName, formik.errors.fullName, formik.values.fullName)}`}
                                />
                            </Field>

                            <div>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 theme-text-muted" />
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Email address"
                                            value={formik.values.email}
                                            onChange={(e) => {
                                                formik.handleChange(e);
                                                setOtpSent(false);
                                                setOtpVerified(false);
                                                setOtpValue('');
                                                setOtpError('');
                                                setOtpSuccess(false);
                                            }}
                                            onBlur={formik.handleBlur}
                                            disabled={otpVerified}
                                            className={`${inputBase} ${fieldState(formik.touched.email, formik.errors.email, formik.values.email)} disabled:opacity-70`}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleSendOtp}
                                        disabled={otpLoading || otpVerified}
                                        className={`shrink-0 flex items-center gap-1.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed ${otpVerified
                                                ? 'border border-emerald-200 bg-emerald-50 text-emerald-600'
                                                : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:-translate-y-px hover:shadow-lg hover:shadow-indigo-200 active:translate-y-0 disabled:opacity-60'
                                            }`}
                                    >
                                        {otpBtnLabel()}
                                    </button>
                                </div>

                                {formik.touched.email && formik.errors.email ? (
                                    <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
                                        <span className="inline-block h-1 w-1 rounded-full bg-red-400" />
                                        {formik.errors.email}
                                    </p>
                                ) : null}

                                {otpSuccess && !otpVerified ? (
                                    <p className="mt-1.5 flex items-center gap-1 text-xs text-indigo-600 animate-fade-in">
                                        <CheckCircle2 size={12} />OTP sent to <span className="font-medium">{formik.values.email}</span>
                                    </p>
                                ) : null}
                                {otpVerified ? (
                                    <p className="mt-1.5 flex items-center gap-1 text-xs text-emerald-600 animate-fade-in">
                                        <CheckCircle2 size={12} />Email verified successfully
                                    </p>
                                ) : null}
                            </div>

                            {otpSent && !otpVerified ? (
                                <div className="animate-slide-up">
                                    <div className="theme-subtle-panel rounded-xl p-4">
                                        <p className="mb-3 flex items-center gap-1.5 text-xs font-medium text-indigo-700">
                                            <ShieldCheck size={13} />Enter the 6-digit code sent to your email
                                        </p>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={6}
                                                placeholder="• • • • • •"
                                                value={otpValue}
                                                onChange={(e) => {
                                                    setOtpValue(e.target.value.replace(/\D/g, ''));
                                                    setOtpError('');
                                                }}
                                                className={`theme-input w-full rounded-xl border px-4 py-3 text-center text-sm font-mono tracking-[0.4em] placeholder:text-slate-300 focus:outline-none focus:ring-4 transition-all duration-200 ${otpError
                                                        ? 'border-red-400 focus:ring-red-100 focus:border-red-400'
                                                        : 'border-slate-200 focus:ring-indigo-100 focus:border-indigo-400'
                                                    }`}
                                            />
                                            <button
                                                type="button"
                                                onClick={handleVerifyOtp}
                                                disabled={otpLoading}
                                                className="shrink-0 flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:shadow-lg hover:shadow-indigo-200 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {otpLoading ? <><Loader2 size={14} className="animate-spin" />Checking...</> : 'Verify'}
                                            </button>
                                        </div>
                                        {otpError ? (
                                            <p className="mt-2 flex items-center gap-1 text-xs text-red-500">
                                                <span className="inline-block h-1 w-1 rounded-full bg-red-400" />
                                                {otpError}
                                            </p>
                                        ) : null}
                                        <p className="theme-text-muted mt-2 text-[11px]">Code expires in 5 minutes</p>
                                    </div>
                                </div>
                            ) : null}

                            <Field icon={Lock} touched={formik.touched.password} error={formik.errors.password}>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`${inputBase} ${fieldState(formik.touched.password, formik.errors.password, formik.values.password)}`}
                                />
                            </Field>

                            <Field icon={Lock} touched={formik.touched.confirmPassword} error={formik.errors.confirmPassword}>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={formik.values.confirmPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`${inputBase} ${fieldState(formik.touched.confirmPassword, formik.errors.confirmPassword, formik.values.confirmPassword)}`}
                                />
                            </Field>

                            <button
                                type="submit"
                                disabled={formik.isSubmitting || !otpVerified}
                                className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-200 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                            >
                                {formik.isSubmitting ? <><Loader2 size={16} className="animate-spin" />Creating Account...</> : <><span>Create Account</span><ArrowRight size={16} /></>}
                            </button>

                            {!otpVerified ? (
                                <p className="theme-text-muted text-center text-[11px]">
                                    Verify your email above to enable account creation
                                </p>
                            ) : null}
                        </form>

                        <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-6">
                            <GoogleButton label="Sign up with Google" />

                            <p className="theme-text-secondary text-center text-sm">
                                Already have an account?{' '}
                                <Link to="/login" className="font-semibold text-indigo-600 hover:text-purple-600 transition-colors">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>

                    <p className="theme-text-muted mt-5 text-center text-[11px]">
                        By signing up you agree to our <span className="cursor-pointer text-indigo-500 hover:underline">Terms</span> &amp;{' '}
                        <span className="cursor-pointer text-indigo-500 hover:underline">Privacy Policy</span>
                    </p>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default Signup;
