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
    if (touched && error) return 'border-red-400 focus:ring-red-100 focus:border-red-400';
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

                if (!response.ok) {
                    setServerError(data.message || data.error || 'Login failed');
                    return;
                }

                // ✅ store everything
                localStorage.setItem('token', data.token);
                localStorage.setItem('customId', data.customId);
                localStorage.setItem('role', data.role);

                login();

                // ✅ proper redirect logic
                if (data.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate(data.redirectTo || '/');
                }

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

                <div className="w-full max-w-md">

                    <div className="text-center mb-8">
                        <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            LinkCart
                        </span>
                        <p className="mt-2 text-slate-500 text-sm">Welcome back — sign in to continue</p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-xl border border-white rounded-2xl p-8 shadow">

                        {serverError && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-6">
                                {serverError}
                            </div>
                        )}

                        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4" noValidate>

                            <div>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
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
                                    <p className="text-xs text-red-500 mt-1">{formik.errors.email}</p>
                                )}
                            </div>

                            <div>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
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
                                    <p className="text-xs text-red-500 mt-1">{formik.errors.password}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={formik.isSubmitting}
                                className="w-full py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                            >
                                {formik.isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : 'Sign In'}
                            </button>
                        </form>

                        <div className="mt-6 pt-6 border-t flex flex-col gap-3">
                            <GoogleButton label="Continue with Google" />

                            <p className="text-center text-sm text-slate-500">
                                Don't have an account?{' '}
                                <Link to="/signup" className="text-indigo-600 font-semibold">
                                    Create one
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default Login;