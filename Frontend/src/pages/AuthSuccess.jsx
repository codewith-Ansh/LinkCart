import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const AuthSuccess = () => {
    const [searchParams]  = useSearchParams();
    const [error, setError] = useState('');
    const navigate        = useNavigate();
    const { login }       = useAppContext();

    useEffect(() => {
        const token    = searchParams.get('token');
        const customId = searchParams.get('customId');
        const authError = searchParams.get('error');

        if (authError || !token) {
            setError('Google sign-in failed. Please try again.');
            return;
        }

        // Persist auth state — same keys used by the rest of the app
        localStorage.setItem('token', token);
        if (customId) localStorage.setItem('customId', customId);

        // Update global context so Navbar + protected routes react immediately
        login();

        // Small delay so the spinner is visible (avoids flash)
        const t = setTimeout(() => navigate('/'), 800);
        return () => clearTimeout(t);
    }, []);  // eslint-disable-line react-hooks/exhaustive-deps

    if (error) {
        return (
            <div style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #fdf4ff 100%)' }}
                 className="min-h-screen flex items-center justify-center px-4">
                <div className="bg-white/80 backdrop-blur-xl border border-white rounded-2xl p-10 shadow-[0_8px_40px_rgba(99,102,241,0.10)] text-center max-w-sm w-full">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-100 mb-4">
                        <AlertCircle size={28} className="text-red-500" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-800 mb-2">Sign-in Failed</h2>
                    <p className="text-sm text-slate-500 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all duration-200"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #fdf4ff 100%)' }}
             className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <Loader2 size={36} className="animate-spin text-indigo-500 mx-auto mb-4" />
                <p className="text-slate-600 font-medium text-sm">Signing you in…</p>
            </div>
        </div>
    );
};

export default AuthSuccess;
