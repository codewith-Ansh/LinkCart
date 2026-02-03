import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { initializeTheme, saveTheme } from '../utils/theme';

const Navbar = () => {
    const location = useLocation();
    const isVisitOthersPage = location.pathname === '/explore';
    
    // Initialize theme from localStorage
    const [theme, setTheme] = useState(() => initializeTheme());

    // Toggle between light and dark theme
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        saveTheme(newTheme);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="logo">
                    Link<span>Cart</span>
                </Link>

                <div className="nav-center">
                    {/* Empty center */}
                </div>

                <div className="nav-right">
                    {isVisitOthersPage && (
                        <Link to="/" className="nav-link">Home</Link>
                    )}
                    {!isVisitOthersPage && (
                        <Link to="/explore" className="nav-link">Visit Others</Link>
                    )}
                    <Link to="/login" className="login-link">Login</Link>
                    <Link to="/signup" className="signup-button">Sign up</Link>
                    <button onClick={toggleTheme} className="theme-toggle">
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;