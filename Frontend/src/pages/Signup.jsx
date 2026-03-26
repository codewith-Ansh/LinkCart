import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { signupSchema } from '../utils/validationSchemas';

const fieldClass = (touched, error, value) => {
    const base = 'w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all';
    if (touched && error) return `${base} border-red-400 focus:ring-red-300`;
    if (touched && !error && value) return `${base} border-green-400 focus:ring-green-300`;
    return `${base} border-slate-300 focus:ring-primary`;
};

const Signup = () => {
    const [serverError, setServerError] = useState('');
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: { fullName: '', email: '', password: '', confirmPassword: '' },
        validationSchema: signupSchema,
        onSubmit: async (values, { setSubmitting }) => {
            setServerError('');
            try {
                const response = await fetch('http://localhost:5000/api/auth/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        fullName: values.fullName,
                        email: values.email,
                        password: values.password,
                    }),
                });
                const data = await response.json();
                if (!response.ok) { setServerError(data.error || 'Signup failed'); return; }

                alert('Registration successful! Redirecting to login...');
                navigate('/login');
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
                        <h2 className="font-heading text-3xl font-bold text-center mb-8">Sign Up</h2>

                        {serverError && (
                            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-6 text-center border border-red-200">
                                {serverError}
                            </div>
                        )}

                        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4" noValidate>
                            <div>
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Full Name"
                                    value={formik.values.fullName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={fieldClass(formik.touched.fullName, formik.errors.fullName, formik.values.fullName)}
                                />
                                {formik.touched.fullName && formik.errors.fullName && (
                                    <span className="text-red-500 text-xs mt-1 block">{formik.errors.fullName}</span>
                                )}
                            </div>

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

                            <div>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={formik.values.confirmPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={fieldClass(formik.touched.confirmPassword, formik.errors.confirmPassword, formik.values.confirmPassword)}
                                />
                                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                    <span className="text-red-500 text-xs mt-1 block">{formik.errors.confirmPassword}</span>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={formik.isSubmitting}
                                className="bg-primary text-white font-semibold px-4 py-3 rounded-xl hover:bg-primary-dark transition-colors mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {formik.isSubmitting ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>

                        <p className="text-center mt-6 text-slate-600 text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary font-medium hover:underline">Login</Link>
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Signup;
