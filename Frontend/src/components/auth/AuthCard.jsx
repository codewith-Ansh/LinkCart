import React from 'react';

const AuthCard = ({ title, subtitle, children }) => {
    return (
        <div className="theme-surface rounded-2xl p-8 backdrop-blur-xl">
            <div className="mb-6">
                <h1 className="theme-text-primary text-xl font-semibold">{title}</h1>
                {subtitle ? <p className="theme-text-muted mt-1 text-sm">{subtitle}</p> : null}
            </div>
            {children}
        </div>
    );
};

export default AuthCard;

