import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAppContext } from '../context/AppContext';
import { loginSchema } from '../utils/validationSchemas';

const fieldClass = (touched, error, value) => {
    const base = 'w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all';
    if (touched && error) return `${base} border-red-400 focus:ring-red-300`;
    if (touched && !error && value) return `${base} border-green-400 focus:ring-green-300`;
    return `${base} border-slate-300 focus:ring-primary`;
};

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
                const response = await fetch('http://localhost:5000/api/auth/login', {
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
            <div className="min-h-[calc(100vh-72px)] flex items-center justify-center bg-slate-50 px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-lg">
                        <h2 className="font-heading text-3xl font-bold text-center mb-8">Login</h2>

                        {serverError && (
                            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-6 text-center border border-red-200">
                                {serverError}
                            </div>
                        )}

                        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4" noValidate>
                            <div>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={fieldClass(formik.touched.email, formik.errors.email, formik.values.email)}
                                />
                                {formik.touched.email && formik.errors.email && (
                                    <span className="text-red-500 text-xs mt-1 block">{formik.errors.email}</span>
                                )}
                            </div>

                            <div>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={fieldClass(formik.touched.password, formik.errors.password, formik.values.password)}
                                />
                                {formik.touched.password && formik.errors.password && (
                                    <span className="text-red-500 text-xs mt-1 block">{formik.errors.password}</span>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={formik.isSubmitting}
                                className="bg-primary text-white font-semibold px-4 py-3 rounded-xl hover:bg-primary-dark transition-colors mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {formik.isSubmitting ? 'Logging in...' : 'Login'}
                            </button>
                        </form>

                        <p className="text-center mt-6 text-slate-600 text-sm">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-primary font-medium hover:underline">Sign Up</Link>
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Login;
