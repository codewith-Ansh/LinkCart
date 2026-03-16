import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Plus, User, LogOut, LayoutList } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { isLoggedIn, logout } = useAppContext();
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

    const navLink = "text-slate-700 font-medium hover:text-indigo-600 transition-colors duration-200 relative group";
    const underline = "absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300";

    return (
        <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
            <div className="w-full px-6 md:px-12 lg:px-20 h-20 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                    LinkCart
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <Link to="/" className={navLink}>Home<span className={underline}></span></Link>
                    <Link to="/products" className={navLink}>Products<span className={underline}></span></Link>

                    {!isLoggedIn ? (
                        <>
                            <Link to="/login" className={navLink}>Login<span className={underline}></span></Link>
                            <Link to="/signup" className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:scale-105 hover:shadow-lg transition-all duration-300">
                                Sign Up
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/my-listings" className={navLink}>My Listings<span className={underline}></span></Link>
                            <Link to="/post-ad" className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:scale-105 hover:shadow-lg transition-all duration-300">
                                <Plus size={16} />Create Link
                            </Link>

                            {/* Avatar Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
                                >
                                    <User size={18} />
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 animate-fade-in">
                                        <Link to="/account" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors text-sm font-medium">
                                            <User size={15} />My Profile
                                        </Link>
                                        <Link to="/my-listings" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors text-sm font-medium">
                                            <LayoutList size={15} />My Listings
                                        </Link>
                                        <Link to="/post-ad" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors text-sm font-medium">
                                            <Plus size={15} />Create Link
                                        </Link>
                                        <div className="border-t border-slate-100 my-1"></div>
                                        <button onClick={handleLogout} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-red-500 hover:bg-red-50 transition-colors text-sm font-medium">
                                            <LogOut size={15} />Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden w-full bg-white border-t border-slate-200 shadow-lg p-6 flex flex-col gap-3 animate-fade-in">
                    <Link to="/" className="text-slate-700 font-medium p-3 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Home</Link>
                    <Link to="/products" className="text-slate-700 font-medium p-3 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Products</Link>

                    {!isLoggedIn ? (
                        <>
                            <Link to="/login" className="text-slate-700 font-medium p-3 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Login</Link>
                            <Link to="/signup" className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold p-3 rounded-xl text-center hover:scale-105 transition-all" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/my-listings" className="text-slate-700 font-medium p-3 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors" onClick={() => setIsMenuOpen(false)}>My Listings</Link>
                            <Link to="/account" className="text-slate-700 font-medium p-3 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors" onClick={() => setIsMenuOpen(false)}>My Profile</Link>
                            <Link to="/post-ad" className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold p-3 rounded-xl hover:scale-105 transition-all" onClick={() => setIsMenuOpen(false)}><Plus size={16} />Create Link</Link>
                            <button onClick={handleLogout} className="flex items-center justify-center gap-2 text-red-500 font-medium p-3 rounded-lg hover:bg-red-50 transition-colors"><LogOut size={16} />Logout</button>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
