import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [theme, setTheme] = useState('light');
    const [user, setUser] = useState({ loggedIn: false });

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    const login = () => setUser({ loggedIn: true, name: 'John Doe' });
    const logout = () => setUser({ loggedIn: false });

    return (
        <AppContext.Provider value={{ theme, toggleTheme, user, login, logout }}>
            <div className={theme}>
                {children}
            </div>
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
