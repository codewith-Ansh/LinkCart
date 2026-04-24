import React from 'react';

const Footer = () => {
    return (
        <footer className="w-full border-t px-6 py-16 md:px-12 lg:px-20" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
            <div className="flex w-full flex-col items-center justify-between gap-8 md:flex-row">
                <div className="text-center md:text-left">
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                        LinkCart
                    </span>
                    <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>© 2026 LinkCart Inc. All rights reserved.</p>
                </div>
                <div className="flex gap-8">
                    <a href="#" className="text-sm transition-colors hover:text-indigo-600" style={{ color: 'var(--text-secondary)' }}>About</a>
                    <a href="#" className="text-sm transition-colors hover:text-indigo-600" style={{ color: 'var(--text-secondary)' }}>Privacy</a>
                    <a href="#" className="text-sm transition-colors hover:text-indigo-600" style={{ color: 'var(--text-secondary)' }}>Terms</a>
                    <a href="#" className="text-sm transition-colors hover:text-indigo-600" style={{ color: 'var(--text-secondary)' }}>Contact</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
