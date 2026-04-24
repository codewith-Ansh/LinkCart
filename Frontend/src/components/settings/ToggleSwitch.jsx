import React from 'react';

const ToggleSwitch = ({ label, description, checked, onChange, disabled }) => {
    return (
        <div className="flex items-start justify-between gap-4">
            <div>
                <p className="theme-text-primary text-sm font-medium">{label}</p>
                {description ? <p className="theme-text-muted mt-1 text-xs">{description}</p> : null}
            </div>
            <button
                type="button"
                disabled={disabled}
                onClick={() => onChange(!checked)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-purple-100 ${checked ? 'bg-purple-600' : 'theme-switch-track'} ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
                aria-pressed={checked}
                aria-label={label}
            >
                <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-1'}`}
                />
            </button>
        </div>
    );
};

export default ToggleSwitch;

