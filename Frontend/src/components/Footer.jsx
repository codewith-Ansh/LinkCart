import React from 'react';

const Footer = () => {
    return (
        <footer className="w-full border-t border-slate-200 py-16 px-6 md:px-12 lg:px-20 bg-white">
            <div className="w-full flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-center md:text-left">
                    <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                        LinkCart
                    </span>
                    <p className="text-gray-500 text-sm mt-2">© 2026 LinkCart Inc. All rights reserved.</p>
                </div>
                <div className="flex gap-8">
                    <a href="#" className="text-gray-600 text-sm hover:text-indigo-600 transition-colors">About</a>
                    <a href="#" className="text-gray-600 text-sm hover:text-indigo-600 transition-colors">Privacy</a>
                    <a href="#" className="text-gray-600 text-sm hover:text-indigo-600 transition-colors">Terms</a>
                    <a href="#" className="text-gray-600 text-sm hover:text-indigo-600 transition-colors">Contact</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
