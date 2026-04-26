import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useToast } from '../context/ToastContext';

const AuthSuccess = () => {
    const [searchParams] = useSearchParams();
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAppContext();
    const toast = useToast();

    useEffect(() => {
        const token = searchParams.get('token');
        const customId = searchParams.get('customId');
        const role = searchParams.get('role');
        const redirectTo = searchParams.get('redirectTo');
        const authError = searchParams.get('error');

        if (authError || !token) {
            setError('Google sign-in failed. Please try again.');
            return;
        }

        localStorage.setItem('token', token);
        if (customId) localStorage.setItem('customId', customId);
        if (role) localStorage.setItem('role', role);
        else {
            // Fallback: decode role from JWT
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                if (payload.role) localStorage.setItem('role', payload.role);
            } catch { /* non-critical */ }
        }

        login();

        const t = setTimeout(() => {
            if (redirectTo === "/account") {
                toast.success('Fill up your profile first');
            }
            navigate(redirectTo || '/products');
        }, 800);
        return () => clearTimeout(t);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (error) {
        return (
            <div className="theme-page min-h-screen flex items-center justify-center px-4">
                <div className="theme-surface w-full max-w-sm rounded-2xl p-10 text-center">
                    <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100">
                        <AlertCircle size={28} className="text-red-500" />
                    </div>
                    <h2 className="theme-text-primary mb-2 text-lg font-bold">Sign-in Failed</h2>
                    <p className="theme-text-secondary mb-6 text-sm">{error}</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-200"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="theme-page min-h-screen flex items-center justify-center">
            <div className="text-center">
                <Loader2 size={36} className="mx-auto mb-4 animate-spin text-indigo-500" />
                <p className="theme-text-secondary text-sm font-medium">Signing you in...</p>
            </div>
        </div>
    );
};

export default AuthSuccess;
