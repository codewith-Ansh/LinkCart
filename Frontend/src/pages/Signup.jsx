import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { User, Mail, Lock, ShieldCheck, ArrowRight, Loader2, CheckCircle2, RefreshCw } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { signupSchema } from '../utils/validationSchemas';
import GoogleButton from '../components/GoogleButton';
import API_BASE from '../utils/api';
import { useToast } from '../context/ToastContext';

/* ─── field border/ring state ─────────────────────────────────────────────── */
const fieldState = (touched, error, value) => {
    if (touched && error)        return 'border-red-400 ring-red-100   focus:ring-red-200   focus:border-red-400';
    if (touched && !error && value) return 'border-emerald-400 ring-emerald-100 focus:ring-emerald-200 focus:border-emerald-400';
    return 'border-slate-200 ring-transparent focus:ring-indigo-100 focus:border-indigo-400';
};

const inputBase = 'w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all duration-200';

/* ─── reusable labelled input wrapper ─────────────────────────────────────── */
const Field = ({ icon: Icon, touched, error, value, children }) => (
    <div className="relative">
        <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        {children}
        {touched && error && (
            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <span className="inline-block w-1 h-1 rounded-full bg-red-400" />
                {error}
            </p>
        )}
    </div>
);

const Signup = () => {
    const [serverError, setServerError]   = useState('');
    const [otpSent, setOtpSent]           = useState(false);
    const [otpVerified, setOtpVerified]   = useState(false);
    const [otpValue, setOtpValue]         = useState('');
    const [otpError, setOtpError]         = useState('');
    const [otpLoading, setOtpLoading]     = useState(false);
    const [otpSuccess, setOtpSuccess]     = useState(false);   // "OTP sent" toast state
    const navigate = useNavigate();
    const toast = useToast();

    /* ── formik (logic unchanged) ── */
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
                if (!response.ok) { setServerError(data.error || 'Signup failed'); return; }
                toast.success('Registration successful! Redirecting to login...');
                navigate('/login');
            } catch {
                setServerError('Server error. Please try again later.');
            } finally {
                setSubmitting(false);
            }
        },
    });

    /* ── OTP handlers (logic unchanged) ── */
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
            const res  = await fetch(`${API_BASE}/api/auth/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formik.values.email }),
            });
            const data = await res.json();
            if (!res.ok) { setServerError(data.error || 'Failed to send OTP'); return; }
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
        if (otpValue.length !== 6) { setOtpError('Enter a valid 6-digit OTP'); return; }
        setOtpLoading(true);
        setOtpError('');
        try {
            const res  = await fetch(`${API_BASE}/api/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formik.values.email, otp: otpValue }),
            });
            const data = await res.json();
            if (!res.ok) { setOtpError(data.error || 'OTP verification failed'); return; }
            setOtpVerified(true);
        } catch {
            setOtpError('Server error. Please try again later.');
        } finally {
            setOtpLoading(false);
        }
    };

    /* ── send-OTP button label ── */
    const otpBtnLabel = () => {
        if (otpLoading && !otpSent) return <><Loader2 size={14} className="animate-spin" />Sending…</>;
        if (otpVerified)            return <><CheckCircle2 size={14} />Verified</>;
        if (otpSent)                return <><RefreshCw size={14} />Resend</>;
        return 'Send OTP';
    };

    return (
        <>
            <Navbar />

            {/* ── page background ── */}
            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-14"
                 style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #fdf4ff 100%)' }}>

                {/* subtle decorative blobs */}
                <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
                    <div style={{ width: 480, height: 480, top: '-120px', left: '-120px', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', position: 'absolute', borderRadius: '50%' }} />
                    <div style={{ width: 400, height: 400, bottom: '-100px', right: '-80px',  background: 'radial-gradient(circle, rgba(168,85,247,0.10) 0%, transparent 70%)', position: 'absolute', borderRadius: '50%' }} />
                </div>

                <div className="w-full max-w-md animate-fade-in">

                    {/* ── brand mark ── */}
                    <div className="text-center mb-8">
                        <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
                              style={{ fontFamily: 'Clash Display, sans-serif' }}>
                            LinkCart
                        </span>
                        <p className="mt-2 text-slate-500 text-sm">Create your free account</p>
                    </div>

                    {/* ── card ── */}
                    <div className="bg-white/80 backdrop-blur-xl border border-white rounded-2xl p-8 shadow-[0_8px_40px_rgba(99,102,241,0.10)]">

                        {/* server error banner */}
                        {serverError && (
                            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-6 animate-fade-in">
                                <span className="mt-0.5 shrink-0 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] font-bold">!</span>
                                {serverError}
                            </div>
                        )}

                        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4" noValidate>

                            {/* Full Name */}
                            <Field icon={User} touched={formik.touched.fullName} error={formik.errors.fullName} value={formik.values.fullName}>
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

                            {/* Email + Send OTP */}
                            <div>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Email address"
                                            value={formik.values.email}
                                            onChange={(e) => {
                                                formik.handleChange(e);
                                                setOtpSent(false); setOtpVerified(false);
                                                setOtpValue(''); setOtpError(''); setOtpSuccess(false);
                                            }}
                                            onBlur={formik.handleBlur}
                                            disabled={otpVerified}
                                            className={`${inputBase} ${fieldState(formik.touched.email, formik.errors.email, formik.values.email)} disabled:bg-slate-50 disabled:text-slate-500`}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleSendOtp}
                                        disabled={otpLoading || otpVerified}
                                        className={`shrink-0 flex items-center gap-1.5 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 disabled:cursor-not-allowed
                                            ${otpVerified
                                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                                : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-px active:translate-y-0 disabled:opacity-60'
                                            }`}
                                    >
                                        {otpBtnLabel()}
                                    </button>
                                </div>

                                {formik.touched.email && formik.errors.email && (
                                    <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                        <span className="inline-block w-1 h-1 rounded-full bg-red-400" />{formik.errors.email}
                                    </p>
                                )}

                                {/* OTP sent confirmation */}
                                {otpSuccess && !otpVerified && (
                                    <p className="mt-1.5 text-xs text-indigo-600 flex items-center gap-1 animate-fade-in">
                                        <CheckCircle2 size={12} />OTP sent to <span className="font-medium">{formik.values.email}</span>
                                    </p>
                                )}
                                {otpVerified && (
                                    <p className="mt-1.5 text-xs text-emerald-600 flex items-center gap-1 animate-fade-in">
                                        <CheckCircle2 size={12} />Email verified successfully
                                    </p>
                                )}
                            </div>

                            {/* OTP input — slides in after send */}
                            {otpSent && !otpVerified && (
                                <div className="animate-slide-up">
                                    {/* OTP box */}
                                    <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-4">
                                        <p className="text-xs font-medium text-indigo-700 mb-3 flex items-center gap-1.5">
                                            <ShieldCheck size={13} />Enter the 6-digit code sent to your email
                                        </p>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={6}
                                                placeholder="• • • • • •"
                                                value={otpValue}
                                                onChange={(e) => { setOtpValue(e.target.value.replace(/\D/g, '')); setOtpError(''); }}
                                                className={`w-full px-4 py-3 bg-white border rounded-xl text-sm text-center tracking-[0.4em] font-mono placeholder-slate-300 focus:outline-none focus:ring-4 transition-all duration-200
                                                    ${otpError
                                                        ? 'border-red-400 focus:ring-red-100 focus:border-red-400'
                                                        : 'border-slate-200 focus:ring-indigo-100 focus:border-indigo-400'
                                                    }`}
                                            />
                                            <button
                                                type="button"
                                                onClick={handleVerifyOtp}
                                                disabled={otpLoading}
                                                className="shrink-0 flex items-center gap-1.5 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-px active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                                            >
                                                {otpLoading
                                                    ? <><Loader2 size={14} className="animate-spin" />Checking…</>
                                                    : 'Verify'}
                                            </button>
                                        </div>
                                        {otpError && (
                                            <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                                                <span className="inline-block w-1 h-1 rounded-full bg-red-400" />{otpError}
                                            </p>
                                        )}
                                        <p className="mt-2 text-[11px] text-slate-400">Code expires in 5 minutes</p>
                                    </div>
                                </div>
                            )}

                            {/* Password */}
                            <Field icon={Lock} touched={formik.touched.password} error={formik.errors.password} value={formik.values.password}>
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

                            {/* Confirm Password */}
                            <Field icon={Lock} touched={formik.touched.confirmPassword} error={formik.errors.confirmPassword} value={formik.values.confirmPassword}>
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

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={formik.isSubmitting || !otpVerified}
                                className="mt-1 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200
                                    bg-gradient-to-r from-indigo-500 to-purple-600 text-white
                                    hover:shadow-xl hover:shadow-indigo-200 hover:-translate-y-0.5 active:translate-y-0
                                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0"
                            >
                                {formik.isSubmitting
                                    ? <><Loader2 size={16} className="animate-spin" />Creating Account…</>
                                    : <><span>Create Account</span><ArrowRight size={16} /></>
                                }
                            </button>

                            {/* OTP gate hint */}
                            {!otpVerified && (
                                <p className="text-center text-[11px] text-slate-400">
                                    Verify your email above to enable account creation
                                </p>
                            )}
                        </form>

                        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-3">
                            {/* Google SSO — skips OTP entirely for Google-verified emails */}
                            <GoogleButton label="Sign up with Google" />

                            <p className="text-center text-sm text-slate-500">
                                Already have an account?{' '}
                                <Link to="/login" className="font-semibold text-indigo-600 hover:text-purple-600 transition-colors">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* trust line */}
                    <p className="mt-5 text-center text-[11px] text-slate-400">
                        By signing up you agree to our{' '}
                        <span className="text-indigo-500 cursor-pointer hover:underline">Terms</span> &amp;{' '}
                        <span className="text-indigo-500 cursor-pointer hover:underline">Privacy Policy</span>
                    </p>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default Signup;
