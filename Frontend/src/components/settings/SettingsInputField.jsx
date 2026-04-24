import React from 'react';

const base =
    'theme-input w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200';

const SettingsInputField = ({
    label,
    name,
    type = 'text',
    value,
    onChange,
    placeholder,
    disabled,
    readOnly,
    error,
    helper,
    autoComplete,
}) => {
    return (
        <div>
            {label ? (
                <label htmlFor={name} className="theme-label mb-2 block text-sm font-medium">
                    {label}
                </label>
            ) : null}
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                readOnly={readOnly}
                autoComplete={autoComplete}
                className={`${base} ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : 'border-slate-200'} ${readOnly ? 'theme-subtle-panel theme-text-secondary' : ''}`}
            />
            {helper ? <p className="theme-text-muted mt-1 text-xs">{helper}</p> : null}
            {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
        </div>
    );
};

export default SettingsInputField;

