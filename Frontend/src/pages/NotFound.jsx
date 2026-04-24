import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="theme-page flex min-h-screen flex-col">
            <Navbar />
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
                <h1 className="text-8xl font-black text-indigo-600 mb-4" style={{ fontFamily: 'Clash Display, sans-serif' }}>404</h1>
                <h2 className="theme-text-primary mb-6 text-3xl font-bold" style={{ fontFamily: 'Clash Display, sans-serif' }}>Page Not Found</h2>
                <p className="theme-text-secondary mx-auto mb-10 max-w-md leading-relaxed">
                    Oops! The item or page you are trying to access is not available, or the link may be broken.
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold px-8 py-4 rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-200 active:translate-y-0 transition-all duration-200"
                >
                    Return to Homepage
                </button>
            </div>
            <Footer />
        </div>
    );
};

export default NotFound;
