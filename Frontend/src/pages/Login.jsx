import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAppContext } from '../context/AppContext';
import { loginSchema } from '../utils/validationSchemas';
import GoogleButton from '../components/GoogleButton';
import API_BASE from '../utils/api';

const fieldState = (touched, error, value) => {
    if (touched && error)           return 'border-red-400 focus:ring-red-100 focus:border-red-400';
    if (touched && !error && value) return 'border-emerald-400 focus:ring-emerald-100 focus:border-emerald-400';
    return 'border-slate-200 focus:ring-indigo-100 focus:border-indigo-400';
};

const inputBase = 'w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all duration-200';

const Login = () => {
    const [serverError, setServerError] = useState('');
    const navigate = useNavigate();
    const { login } = useAppContext();

    const formik = useFormik({
        initialValues: { email: '', password: '' },
        validationSchema: loginSchema,
        onSubmit: async (values, { setSubmitting }) => {
            setServerError('');
            try {
                const response = await fetch(`${API_BASE}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(values),
                });
                const data = await response.json();
                if (!response.ok) { setServerError(data.error || 'Login failed'); return; }
                localStorage.setItem('token', data.token);
                localStorage.setItem('customId', data.customId);
                login();
                navigate(data.redirectTo === '/complete-profile' ? '/complete-profile' : '/');
            } catch {
                setServerError('Server error. Please try again later.');
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <>
            <Navbar />

            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-14"
                 style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #fdf4ff 100%)' }}>

                {/* decorative blobs */}
                <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
                    <div style={{ width: 480, height: 480, top: '-120px', left: '-120px', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', position: 'absolute', borderRadius: '50%' }} />
                    <div style={{ width: 400, height: 400, bottom: '-100px', right: '-80px', background: 'radial-gradient(circle, rgba(168,85,247,0.10) 0%, transparent 70%)', position: 'absolute', borderRadius: '50%' }} />
                </div>

                <div className="w-full max-w-md animate-fade-in">

                    {/* brand mark */}
                    <div className="text-center mb-8">
                        <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
                              style={{ fontFamily: 'Clash Display, sans-serif' }}>
                            LinkCart
                        </span>
                        <p className="mt-2 text-slate-500 text-sm">Welcome back — sign in to continue</p>
                    </div>

                    {/* card */}
                    <div className="bg-white/80 backdrop-blur-xl border border-white rounded-2xl p-8 shadow-[0_8px_40px_rgba(99,102,241,0.10)]">

                        {serverError && (
                            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-6 animate-fade-in">
                                <span className="mt-0.5 shrink-0 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] font-bold">!</span>
                                {serverError}
                            </div>
                        )}

                        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4" noValidate>

                            {/* Email */}
                            <div>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email address"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`${inputBase} ${fieldState(formik.touched.email, formik.errors.email, formik.values.email)}`}
                                    />
                                </div>
                                {formik.touched.email && formik.errors.email && (
                                    <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                        <span className="inline-block w-1 h-1 rounded-full bg-red-400" />{formik.errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`${inputBase} ${fieldState(formik.touched.password, formik.errors.password, formik.values.password)}`}
                                    />
                                </div>
                                {formik.touched.password && formik.errors.password && (
                                    <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                        <span className="inline-block w-1 h-1 rounded-full bg-red-400" />{formik.errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={formik.isSubmitting}
                                className="mt-1 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm
                                    bg-gradient-to-r from-indigo-500 to-purple-600 text-white
                                    hover:shadow-xl hover:shadow-indigo-200 hover:-translate-y-0.5 active:translate-y-0
                                    transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                                    disabled:hover:shadow-none disabled:hover:translate-y-0"
                            >
                                {formik.isSubmitting
                                    ? <><Loader2 size={16} className="animate-spin" />Signing in…</>
                                    : <><span>Sign In</span><ArrowRight size={16} /></>
                                }
                            </button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-3">
                            {/* Google SSO */}
                            <GoogleButton label="Continue with Google" />

                            <p className="text-center text-sm text-slate-500">
                                Don't have an account?{' '}
                                <Link to="/signup" className="font-semibold text-indigo-600 hover:text-purple-600 transition-colors">
                                    Create one
                                </Link>
                            </p>
                        </div>
                    </div>

                    <p className="mt-5 text-center text-[11px] text-slate-400">
                        By signing in you agree to our{' '}
                        <span className="text-indigo-500 cursor-pointer hover:underline">Terms</span> &amp;{' '}
                        <span className="text-indigo-500 cursor-pointer hover:underline">Privacy Policy</span>
                    </p>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default Login;
