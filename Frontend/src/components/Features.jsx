import React from 'react';
import { Sparkles, Share2, Smartphone, Link as LinkIcon, BarChart3, ShieldCheck } from 'lucide-react';

const Features = () => {
    const features = [
        { icon: <Sparkles />, title: 'Easy Setup', desc: 'Get your page live in minutes with our intuitive builder.' },
        { icon: <Share2 />, title: 'Share Anywhere', desc: 'One link for Instagram, TikTok, Twitter, and more.' },
        { icon: <Smartphone />, title: 'Mobile Friendly', desc: 'Your OneLink looks great on every device, every time.' },
        { icon: <LinkIcon />, title: 'Custom Links', desc: 'Add products, social profiles, and custom URLs easily.' },
        { icon: <BarChart3 />, title: 'Analytics Ready', desc: 'Track your clicks and understand your audience (Mock).' },
        { icon: <ShieldCheck />, title: 'Secure & Fast', desc: 'Built on modern tech for maximum speed and security.' },
    ];

    return (
        <section className="features-section">
            <div className="section-header">
                <h2>Everything you need to grow</h2>
                <p>Simple tools to manage your digital presence.</p>
            </div>
            <div className="features-grid">
                {features.map((feature, index) => (
                    <div key={index} className="feature-card">
                        <div className="feature-icon">{feature.icon}</div>
                        <h3>{feature.title}</h3>
                        <p>{feature.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Features;
