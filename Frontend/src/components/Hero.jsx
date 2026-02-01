import React from 'react';
import { ChevronRight } from 'lucide-react';

const Hero = () => {
    return (
        <section className="hero">
            <div className="hero-content">
                <h1>One Link for Everything You Share</h1>
                <p>Share products, profiles, content, and links — all from one powerful page.</p>
                <div className="hero-cta">
                    <button className="primary-btn">Create Your OneLink</button>
                    <span>Get started free</span>
                </div>
            </div>
            <div className="hero-visual">
                <div className="mock-card card-1">
                    <div className="mock-avatar"></div>
                    <div className="mock-line-long"></div>
                    <div className="mock-line-short"></div>
                </div>
                <div className="mock-card card-2">
                    <div className="mock-avatar"></div>
                    <div className="mock-line-long"></div>
                    <div className="mock-line-short"></div>
                </div>
                <div className="mock-card card-3">
                    <div className="mock-avatar"></div>
                    <div className="mock-line-long"></div>
                    <div className="mock-line-short"></div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
