import React from 'react';

const SettingsLayout = ({ title, subtitle, children }) => {
    return (
        <div className="theme-page min-h-[calc(100vh-80px)] px-4 py-12">
            <div className="mx-auto w-full max-w-6xl">
                <div className="mb-8">
                    <h1 className="theme-text-primary text-2xl font-bold md:text-3xl">{title}</h1>
                    {subtitle ? <p className="theme-text-muted mt-2 text-sm">{subtitle}</p> : null}
                </div>
                {children}
            </div>
        </div>
    );
};

export default SettingsLayout;

