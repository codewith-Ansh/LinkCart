import React from 'react';
import { Sparkles, Share2, Smartphone, Link as LinkIcon, BarChart3, ShieldCheck } from 'lucide-react';

const Features = () => {
    const features = [
        { icon: <Sparkles size={24} />, title: 'Easy Setup', desc: 'Get your page live in minutes with our intuitive builder.' },
        { icon: <Share2 size={24} />, title: 'Share Anywhere', desc: 'One link for Instagram, TikTok, Twitter, and more.' },
        { icon: <Smartphone size={24} />, title: 'Mobile Friendly', desc: 'Your OneLink looks great on every device, every time.' },
        { icon: <LinkIcon size={24} />, title: 'Custom Links', desc: 'Add products, social profiles, and custom URLs easily.' },
        { icon: <BarChart3 size={24} />, title: 'Analytics Ready', desc: 'Track your clicks and understand your audience.' },
        { icon: <ShieldCheck size={24} />, title: 'Secure & Fast', desc: 'Built on modern tech for maximum speed and security.' },
    ];

    return (
        <section className="theme-section w-full px-6 py-24 md:px-12 lg:px-20">
            <div className="text-center mb-20">
                <h2 className="theme-text-primary mb-6 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                    Everything you need to grow
                </h2>
                <p className="theme-text-secondary mx-auto max-w-2xl text-lg md:text-xl">
                    Simple tools to manage your digital presence.
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <div key={index} className="theme-surface group rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl">
                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <div className="flex items-center justify-center">
                                {feature.icon}
                            </div>
                        </div>
                        <h3 className="theme-text-primary mb-3 text-xl font-bold">{feature.title}</h3>
                        <p className="theme-text-secondary leading-relaxed">{feature.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Features;
