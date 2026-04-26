import React from 'react';
import { Link } from 'react-router-dom';
import Brand from './Brand';

const Footer = () => {
    return (
        <footer
            className="w-full border-t px-6 py-16 md:px-12 lg:px-20"
            style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}
        >
            <div className="flex w-full flex-col items-center justify-between gap-8 md:flex-row">
                <div className="text-center md:text-left">
                    <Brand withText logoClassName="h-9 w-auto" textClassName="text-2xl" ariaLabel="LinkCart home" />
                    <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                        © 2026 LinkCart Inc. All rights reserved.
                    </p>
                </div>
                <div className="flex gap-8">
                    <Link
                        to="/about"
                        className="text-sm transition-all duration-200 hover:scale-110 hover:text-purple-500"
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        About
                    </Link>
                    <Link
                        to="/privacy"
                        className="text-sm transition-all duration-200 hover:scale-110 hover:text-purple-500"
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        Privacy
                    </Link>
                    <Link
                        to="/terms"
                        className="text-sm transition-all duration-200 hover:scale-110 hover:text-purple-500"
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        Terms
                    </Link>
                    <Link
                        to="/contact"
                        className="text-sm transition-all duration-200 hover:scale-110 hover:text-purple-500"
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        Contact
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
