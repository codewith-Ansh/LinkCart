import React, { createContext, useState, useContext, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [theme, setTheme] = useState('light');
    const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    useEffect(() => {
        const syncAuth = () => setIsLoggedIn(!!localStorage.getItem('token'));
        window.addEventListener('storage', syncAuth);
        return () => window.removeEventListener('storage', syncAuth);
    }, []);

    const login = () => setIsLoggedIn(true);
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('customId');
        setIsLoggedIn(false);
    };

    return (
        <AppContext.Provider value={{ theme, toggleTheme, isLoggedIn, login, logout }}>
            {children}
        </AppContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
