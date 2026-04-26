import React from 'react';
import { Link } from 'react-router-dom';

const Brand = ({
    to = '/',
    withText = false,
    logoClassName = 'h-10 w-auto',
    className = '',
    textClassName = '',
    ariaLabel = 'Go to homepage',
}) => {
    return (
        <Link to={to} className={`inline-flex items-center gap-2 ${className}`} aria-label={ariaLabel}>
            <img src="/logo.png" alt="LinkCart" className={logoClassName} />
            {withText ? (
                <span
                    className={`bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text font-bold text-transparent ${textClassName}`}
                    style={{ fontFamily: 'Clash Display, sans-serif' }}
                >
                    LinkCart
                </span>
            ) : (
                <span className="sr-only">LinkCart</span>
            )}
        </Link>
    );
};

export default Brand;

