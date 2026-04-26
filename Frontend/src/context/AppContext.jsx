import React, { createContext, useState, useContext, useEffect } from 'react';
import API_BASE from '../utils/api';

const AppContext = createContext();
const THEME_KEY = 'theme';

const getInitialTheme = () => {
    const storedTheme = localStorage.getItem(THEME_KEY);
    if (storedTheme === 'light' || storedTheme === 'dark') {
        return storedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const AppProvider = ({ children }) => {
    const [theme, setTheme] = useState(getInitialTheme);
    const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));
    const [currentUser, setCurrentUser] = useState(null);
    const [profileLoading, setProfileLoading] = useState(() => !!localStorage.getItem('token'));
    const [sellerInterestCount, setSellerInterestCount] = useState(0);

    const toggleTheme = () => {
        setTheme((prev) => {
            const newTheme = prev === 'light' ? 'dark' : 'light';
            localStorage.setItem(THEME_KEY, newTheme);
            return newTheme;
        });
    };

    const refreshCurrentUser = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            setCurrentUser(null);
            setProfileLoading(false);
            return null;
        }

        setProfileLoading(true);

        try {
            const response = await fetch(`${API_BASE}/api/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch current user');
            }

            const data = await response.json();
            setCurrentUser(data.profile || null);
            return data.profile || null;
        } catch {
            setCurrentUser(null);
            return null;
        } finally {
            setProfileLoading(false);
        }
    };

    const refreshSellerInterestCount = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            setSellerInterestCount(0);
            return 0;
        }

        try {
            const response = await fetch(`${API_BASE}/api/interests/seller`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch seller interests');
            }

            const data = await response.json();
            const nextCount = Array.isArray(data) ? data.filter((item) => item.status === 'pending').length : 0;
            setSellerInterestCount(nextCount);
            return nextCount;
        } catch {
            setSellerInterestCount(0);
            return 0;
        }
    };

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.style.colorScheme = theme;
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
        document.body.classList.remove('light', 'dark');
        document.body.classList.add(theme);
    }, [theme]);

    useEffect(() => {
        const syncAuth = () => {
            const loggedIn = !!localStorage.getItem('token');
            setIsLoggedIn(loggedIn);

            if (loggedIn) {
                refreshCurrentUser();
                refreshSellerInterestCount();
            } else {
                setCurrentUser(null);
                setProfileLoading(false);
                setSellerInterestCount(0);
            }
        };

        window.addEventListener('storage', syncAuth);
        return () => window.removeEventListener('storage', syncAuth);
    }, []);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            refreshCurrentUser();
            refreshSellerInterestCount();
        } else {
            setProfileLoading(false);
            setSellerInterestCount(0);
        }
    }, []);

    const login = async () => {
        setIsLoggedIn(true);
        await refreshCurrentUser();
        await refreshSellerInterestCount();
    };

    const updateCurrentUser = (nextUser) => {
        setCurrentUser((prev) => ({ ...(prev || {}), ...nextUser }));
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('customId');
        localStorage.removeItem('role');
        setIsLoggedIn(false);
        setCurrentUser(null);
        setProfileLoading(false);
        setSellerInterestCount(0);
    };

    return (
        <AppContext.Provider
            value={{
                theme,
                toggleTheme,
                isLoggedIn,
                currentUser,
                profileLoading,
                sellerInterestCount,
                refreshCurrentUser,
                refreshSellerInterestCount,
                updateCurrentUser,
                login,
                logout,
            }}
        >
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
