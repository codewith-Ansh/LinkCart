import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Hero = () => {
    const { isLoggedIn } = useAppContext();
    const navigate = useNavigate();
    const scrollToDemo = () => {
        document.getElementById('demo-video')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <section className="w-full px-6 md:px-12 lg:px-20 py-20 md:py-32 animate-fade-in" style={{ background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 50%, var(--bg-secondary) 100%)' }}>
            <div className="w-full grid md:grid-cols-2 gap-16 items-center">
                <div className="animate-slide-up">
                    <h1 className="hero-title-gradient mb-6 bg-clip-text text-5xl font-extrabold leading-tight tracking-tight text-transparent md:text-6xl lg:text-7xl" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                        One Link for Everything You Share
                    </h1>
                    <p className="text-lg md:text-xl mb-10 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        Share products, profiles, content, and links — all from one powerful page.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => navigate(isLoggedIn ? '/post-ad' : '/login')}
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold px-10 py-4 rounded-xl text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                            Create Your Link
                        </button>
                        <button
                            onClick={scrollToDemo}
                            className="theme-btn-secondary rounded-xl border-2 border-indigo-500 px-10 py-4 text-lg font-semibold text-indigo-600 transition-all duration-300 hover:bg-indigo-50">
                            View Demo
                        </button>
                    </div>
                    <p className="text-sm mt-6" style={{ color: 'var(--text-muted)' }}>Get started free — No credit card required</p>
                </div>
                <div className="relative h-[400px] md:h-[500px] flex justify-center items-center">
                    <div className="absolute border rounded-3xl p-8 w-72 shadow-2xl transition-all hover:scale-105 hover:rotate-[-2deg] rotate-[-8deg] translate-x-[-40px] z-10" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}>
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 mb-4 shadow-lg"></div>
                        <div className="h-3 rounded-full w-4/5 mb-2" style={{ backgroundColor: 'var(--bg-tertiary)' }}></div>
                        <div className="h-3 rounded-full w-1/2" style={{ backgroundColor: 'var(--bg-tertiary)' }}></div>
                    </div>
                    <div className="theme-surface absolute z-20 -translate-y-8 rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-8 shadow-2xl transition-all hover:scale-110 w-72">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-4 shadow-lg"></div>
                        <div className="h-3 bg-indigo-200 rounded-full w-4/5 mb-2"></div>
                        <div className="h-3 bg-indigo-200 rounded-full w-1/2"></div>
                    </div>
                    <div className="absolute border rounded-3xl p-8 w-72 shadow-2xl transition-all hover:scale-105 hover:rotate-[2deg] rotate-[8deg] translate-x-[40px] z-10" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}>
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-red-500 mb-4 shadow-lg"></div>
                        <div className="h-3 rounded-full w-4/5 mb-2" style={{ backgroundColor: 'var(--bg-tertiary)' }}></div>
                        <div className="h-3 rounded-full w-1/2" style={{ backgroundColor: 'var(--bg-tertiary)' }}></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
