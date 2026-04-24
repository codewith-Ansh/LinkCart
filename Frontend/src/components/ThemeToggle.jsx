import React from 'react';
import { useAppContext } from '../context/AppContext';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useAppContext();
    const isDark = theme === 'dark';

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className="theme-switch-track relative inline-flex h-11 w-[84px] items-center rounded-full px-1.5 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            aria-pressed={isDark}
        >
            <span
                className={`absolute left-3 text-sm transition-all duration-300 ${isDark ? 'opacity-45' : 'opacity-100'}`}
                aria-hidden="true"
            >
                ☀️
            </span>
            <span
                className={`absolute right-3 text-sm transition-all duration-300 ${isDark ? 'opacity-100' : 'opacity-45'}`}
                aria-hidden="true"
            >
                🌙
            </span>
            <span
                className={`theme-switch-thumb relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-sm transition-transform duration-300 ${isDark ? 'translate-x-10' : 'translate-x-0'}`}
                aria-hidden="true"
            >
                {isDark ? '🌙' : '☀️'}
            </span>
        </button>
    );
};

export default ThemeToggle;
