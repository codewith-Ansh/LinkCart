import React from 'react';

const Hero = () => {
    return (
        <section className="w-full bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-6 md:px-12 lg:px-20 py-20 md:py-32 animate-fade-in">
            <div className="w-full grid md:grid-cols-2 gap-16 items-center">
                <div className="animate-slide-up">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 tracking-tight bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                        One Link for Everything You Share
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
                        Share products, profiles, content, and links — all from one powerful page.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold px-10 py-4 rounded-xl text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                            Create Your OneLink
                        </button>
                        <button className="border-2 border-indigo-500 text-indigo-600 font-semibold px-10 py-4 rounded-xl text-lg hover:bg-indigo-50 transition-all duration-300">
                            View Demo
                        </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-6">✨ Get started free — No credit card required</p>
                </div>
                <div className="relative h-[400px] md:h-[500px] flex justify-center items-center">
                    <div className="absolute bg-white border border-slate-200 rounded-3xl p-8 w-72 shadow-2xl transition-all hover:scale-105 hover:rotate-[-2deg] rotate-[-8deg] translate-x-[-40px] z-10">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 mb-4 shadow-lg"></div>
                        <div className="h-3 bg-slate-200 rounded-full w-4/5 mb-2"></div>
                        <div className="h-3 bg-slate-200 rounded-full w-1/2"></div>
                    </div>
                    <div className="absolute bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-3xl p-8 w-72 shadow-2xl transition-all hover:scale-110 -translate-y-8 z-20">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-4 shadow-lg"></div>
                        <div className="h-3 bg-indigo-200 rounded-full w-4/5 mb-2"></div>
                        <div className="h-3 bg-indigo-200 rounded-full w-1/2"></div>
                    </div>
                    <div className="absolute bg-white border border-slate-200 rounded-3xl p-8 w-72 shadow-2xl transition-all hover:scale-105 hover:rotate-[2deg] rotate-[8deg] translate-x-[40px] z-10">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-red-500 mb-4 shadow-lg"></div>
                        <div className="h-3 bg-slate-200 rounded-full w-4/5 mb-2"></div>
                        <div className="h-3 bg-slate-200 rounded-full w-1/2"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
