import React from 'react';

const SettingsForm = ({ title, description, children, footer }) => {
    return (
        <div className="theme-surface rounded-2xl p-6 backdrop-blur-xl md:p-8">
            <div className="mb-6">
                <h2 className="theme-text-primary text-lg font-semibold">{title}</h2>
                {description ? <p className="theme-text-muted mt-1 text-sm">{description}</p> : null}
            </div>

            <div className="space-y-5">{children}</div>

            {footer ? <div className="mt-7 border-t border-slate-100 pt-6">{footer}</div> : null}
        </div>
    );
};

export default SettingsForm;

