import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { Mail, Lock, Loader2 } from 'lucide-react';
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

const inputBase = 'theme-input w-full rounded-xl border py-3 pr-4 pl-10 text-sm focus:outline-none focus:ring-4 transition-all duration-200';

const Login = () => {
    const [serverError, setServerError] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const { login } = useAppContext();
    const successMessage = location.state?.successMessage || '';

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

                localStorage.setItem('token', data.token);
                localStorage.setItem('customId', data.customId);
                localStorage.setItem('role', data.role);

                login();

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

            <div className="theme-page min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-14">
                <div className="w-full max-w-md">
                    <div className="mb-8 text-center">
                        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
                            LinkCart
                        </span>
                        <p className="theme-text-secondary mt-2 text-sm">Welcome back - sign in to continue</p>
                    </div>

                    <div className="theme-surface rounded-2xl p-8 backdrop-blur-xl">
                        {successMessage ? (
                            <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                                {successMessage}
                            </div>
                        ) : null}

                        {serverError ? (
                            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                {serverError}
                            </div>
                        ) : null}

                        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4" noValidate>
                            <div>
                                <div className="relative">
                                    <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 theme-text-muted" />
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
                                {formik.touched.email && formik.errors.email ? (
                                    <p className="mt-1 text-xs text-red-500">{formik.errors.email}</p>
                                ) : null}
                            </div>

                            <div>
                                <div className="relative">
                                    <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 theme-text-muted" />
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
                                {formik.touched.password && formik.errors.password ? (
                                    <p className="mt-1 text-xs text-red-500">{formik.errors.password}</p>
                                ) : null}
                                <div className="mt-2 text-right">
                                    <Link to="/forgot-password" className="text-xs font-medium text-purple-500 hover:text-purple-600">
                                        Forgot Password?
                                    </Link>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={formik.isSubmitting}
                                className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-3 text-sm font-semibold text-white"
                            >
                                {formik.isSubmitting ? <Loader2 className="mx-auto animate-spin" /> : 'Sign In'}
                            </button>
                        </form>

                        <div className="mt-6 flex flex-col gap-3 border-t pt-6">
                            <GoogleButton label="Continue with Google" />

                            <p className="theme-text-secondary text-center text-sm">
                                Don't have an account?{' '}
                                <Link to="/signup" className="font-semibold text-indigo-600">
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
