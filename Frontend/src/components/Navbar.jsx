import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
            <div className="w-full px-6 md:px-12 lg:px-20 h-20 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                    LinkCart
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <Link to="/" className="text-slate-700 font-medium hover:text-indigo-600 transition-colors relative group">
                        Home
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                    <Link to="/products" className="text-slate-700 font-medium hover:text-indigo-600 transition-colors relative group">
                        Products
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                    <Link to="/my-listings" className="text-slate-700 font-medium hover:text-indigo-600 transition-colors relative group">
                        My Listings
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                    <Link to="/account" className="text-slate-700 font-medium hover:text-indigo-600 transition-colors relative group">
                        Account
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                    <Link to="/post-ad" className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:scale-105 hover:shadow-lg transition-all duration-300">
                        Create Link
                    </Link>
                </div>

                <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {isMenuOpen && (
                <div className="md:hidden w-full bg-white border-t border-slate-200 shadow-lg p-6 flex flex-col gap-4 animate-fade-in">
                    <Link to="/" className="text-slate-700 font-medium p-3 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Home</Link>
                    <Link to="/products" className="text-slate-700 font-medium p-3 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Products</Link>
                    <Link to="/my-listings" className="text-slate-700 font-medium p-3 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors" onClick={() => setIsMenuOpen(false)}>My Listings</Link>
                    <Link to="/account" className="text-slate-700 font-medium p-3 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Account</Link>
                    <Link to="/post-ad" className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold p-3 rounded-xl text-center hover:scale-105 transition-all" onClick={() => setIsMenuOpen(false)}>Create Link</Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
