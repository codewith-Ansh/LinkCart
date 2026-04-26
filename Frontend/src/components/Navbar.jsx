import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Menu, X, Plus, User, LogOut, LayoutList, Flag, Settings } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import UserAvatar from './UserAvatar';
import { getDisplayName } from '../utils/profile';
import ThemeToggle from './ThemeToggle';
import Brand from './Brand';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { isLoggedIn, logout, currentUser, sellerInterestCount, theme } = useAppContext();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setIsDropdownOpen(false);
        setIsMenuOpen(false);
        navigate('/');
    };

    const navLink = "theme-text-primary font-medium hover:text-indigo-600 transition-colors duration-200 relative group";
    const UnderlineSpan = () => (
        <span
            className="absolute bottom-0 left-0 h-0.5 bg-indigo-600 w-0 group-hover:w-full"
            style={{ transition: 'width 600ms ease-in-out' }}
        />
    );

    return (
        <nav
            className="sticky top-0 z-50 w-full border-b shadow-sm backdrop-blur-xl"
            style={{ backgroundColor: 'var(--bg-navbar)', borderColor: 'var(--border-primary)', boxShadow: 'var(--shadow-navbar)' }}
        >
            <div className="w-full px-6 md:px-12 lg:px-20 h-20 flex justify-between items-center">
                <Brand
                    withText
                    className="shrink-0"
                    logoClassName="h-10 w-auto"
                    textClassName="text-2xl leading-none"
                    ariaLabel="LinkCart home"
                />

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <Link to="/" className={navLink}>Home<UnderlineSpan /></Link>
                    <Link to="/products" className={navLink}>Products<UnderlineSpan /></Link>

                    {!isLoggedIn ? (
                        <>
                            <Link to="/login" className={navLink}>Login<UnderlineSpan /></Link>
                            <Link to="/signup" className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:scale-105 hover:shadow-lg transition-all duration-300">
                                Sign Up
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/my-listings" className={navLink}>My Listings<UnderlineSpan /></Link>
                            <Link to="/dashboard/interests" className="relative theme-text-primary font-medium hover:text-indigo-600 transition-colors duration-200">
                                <span className="inline-flex items-center gap-2">
                                    <Bell size={16} />
                                    <span>Interests</span>
                                </span>
                                {sellerInterestCount > 0 && (
                                    <span className="ml-2 inline-flex min-w-6 items-center justify-center rounded-full bg-purple-600 px-1.5 py-0.5 text-xs font-bold text-white">
                                        {sellerInterestCount}
                                    </span>
                                )}
                            </Link>
                            <Link to="/post-ad" className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:scale-105 hover:shadow-lg transition-all duration-300">
                                <Plus size={16} />Create Link
                            </Link>

                            {/* Avatar Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="rounded-full transition-all duration-200 hover:scale-105"
                                    aria-label="Open profile menu"
                                >
                                    <UserAvatar user={currentUser} size="sm" className="border-2 shadow-md hover:shadow-lg" style={{ borderColor: 'var(--border-primary)' }} />
                                </button>

                                {isDropdownOpen && (
                                    <div className="theme-surface absolute right-0 mt-2 w-52 rounded-2xl py-2 animate-fade-in">
                                        <div className="px-4 pb-2">
                                            <p className="text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--text-muted)' }}>Signed in as</p>
                                            <p className="truncate text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{getDisplayName(currentUser)}</p>
                                        </div>
                                        <div className="border-t my-1" style={{ borderColor: 'var(--border-primary)' }}></div>
                                        <Link to="/account" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 hover:text-indigo-600 transition-colors text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                                            <User size={15} />My Profile
                                        </Link>
                                        <Link to="/settings" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 hover:text-indigo-600 transition-colors text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                                            <Settings size={15} />Settings
                                        </Link>
                                        <Link to="/dashboard/reports" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 hover:text-indigo-600 transition-colors text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                                            <Flag size={15} />My Reports
                                        </Link>
                                        <div className="border-t my-1" style={{ borderColor: 'var(--border-primary)' }}></div>
                                        <button onClick={handleLogout} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-red-500 hover:bg-red-50 transition-colors text-sm font-medium">
                                            <LogOut size={15} />Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                    <ThemeToggle />
                </div>

                <button className="md:hidden p-2" style={{ color: 'var(--text-primary)' }} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden w-full border-t shadow-lg p-6 flex flex-col gap-3 animate-fade-in" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
                    <Link to="/" className="font-medium p-3 rounded-lg hover:text-indigo-600 transition-colors" style={{ color: 'var(--text-primary)' }} onClick={() => setIsMenuOpen(false)}>Home</Link>
                    <Link to="/products" className="font-medium p-3 rounded-lg hover:text-indigo-600 transition-colors" style={{ color: 'var(--text-primary)' }} onClick={() => setIsMenuOpen(false)}>Products</Link>

                    {!isLoggedIn ? (
                        <>
                            <Link to="/login" className="font-medium p-3 rounded-lg hover:text-indigo-600 transition-colors" style={{ color: 'var(--text-primary)' }} onClick={() => setIsMenuOpen(false)}>Login</Link>
                            <Link to="/signup" className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold p-3 rounded-xl text-center hover:scale-105 transition-all" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/my-listings" className="font-medium p-3 rounded-lg hover:text-indigo-600 transition-colors" style={{ color: 'var(--text-primary)' }} onClick={() => setIsMenuOpen(false)}>My Listings</Link>
                            <Link to="/dashboard/reports" className="font-medium p-3 rounded-lg hover:text-indigo-600 transition-colors" style={{ color: 'var(--text-primary)' }} onClick={() => setIsMenuOpen(false)}>My Reports</Link>
                            <Link to="/dashboard/interests" className="font-medium p-3 rounded-lg hover:text-indigo-600 transition-colors" style={{ color: 'var(--text-primary)' }} onClick={() => setIsMenuOpen(false)}>
                                New Interests {sellerInterestCount > 0 ? `(${sellerInterestCount})` : ''}
                            </Link>
                            <Link to="/account" className="font-medium p-3 rounded-lg hover:text-indigo-600 transition-colors" style={{ color: 'var(--text-primary)' }} onClick={() => setIsMenuOpen(false)}>My Profile</Link>
                            <Link to="/settings" className="font-medium p-3 rounded-lg hover:text-indigo-600 transition-colors" style={{ color: 'var(--text-primary)' }} onClick={() => setIsMenuOpen(false)}>Settings</Link>
                            <Link to="/post-ad" className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold p-3 rounded-xl hover:scale-105 transition-all" onClick={() => setIsMenuOpen(false)}><Plus size={16} />Create Link</Link>
                            <button onClick={handleLogout} className="flex items-center justify-center gap-2 text-red-500 font-medium p-3 rounded-lg hover:bg-red-50 transition-colors"><LogOut size={16} />Logout</button>
                        </>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--border-primary)' }}>
                        <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                            {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                        </span>
                        <ThemeToggle />
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
