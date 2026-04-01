import React, { createContext, useState, useContext, useEffect } from 'react';
import API_BASE from '../utils/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [theme, setTheme] = useState('light');
    const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));
    const [currentUser, setCurrentUser] = useState(null);
    const [profileLoading, setProfileLoading] = useState(() => !!localStorage.getItem('token'));

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
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

    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    useEffect(() => {
        const syncAuth = () => {
            const loggedIn = !!localStorage.getItem('token');
            setIsLoggedIn(loggedIn);

            if (loggedIn) {
                refreshCurrentUser();
            } else {
                setCurrentUser(null);
                setProfileLoading(false);
            }
        };

        window.addEventListener('storage', syncAuth);
        return () => window.removeEventListener('storage', syncAuth);
    }, []);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            refreshCurrentUser();
        } else {
            setProfileLoading(false);
        }
    }, []);

    const login = async () => {
        setIsLoggedIn(true);
        await refreshCurrentUser();
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
    };

    return (
        <AppContext.Provider
            value={{
                theme,
                toggleTheme,
                isLoggedIn,
                currentUser,
                profileLoading,
                refreshCurrentUser,
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
