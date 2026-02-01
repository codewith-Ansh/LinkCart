import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Moon, Sun, Menu, X } from 'lucide-react';

const Navbar = () => {
    const { theme, toggleTheme, user } = useAppContext();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="logo">
                    Link<span>Cart</span>
                </Link>

                {/* Desktop Menu */}
                <div className="nav-links">
                    <Link to="/explore">Visit Others</Link>
                    {user.loggedIn ? (
                        <span className="user-welcome">Hi, {user.name}</span>
                    ) : (
                        <>
                            <Link to="/login" className="login-btn">Login</Link>
                            <Link to="/signup" className="signup-btn">Sign Up</Link>
                        </>
                    )}
                    <button onClick={toggleTheme} className="theme-toggle">
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="mobile-toggle">
                    <button onClick={toggleTheme} className="theme-toggle">
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="menu-btn">
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu Content */}
                {isMenuOpen && (
                    <div className="mobile-menu">
                        <Link to="/explore" onClick={() => setIsMenuOpen(false)}>Visit Others</Link>
                        {user.loggedIn ? (
                            <span>Hi, {user.name}</span>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
                                <Link to="/signup" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
