import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="logo">Linkcart</Link>

                <div className="nav-right">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/products" className="nav-link">Products</Link>
                    <Link to="/my-listings" className="nav-link">My Listings</Link>
                    <Link to="/account" className="nav-link">Account</Link>
                    <Link to="/post-ad" className="post-ad-btn">Post Ad</Link>
                </div>

                <button className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {isMenuOpen && (
                <div className="mobile-menu">
                    <Link to="/" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
                    <Link to="/products" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Products</Link>
                    <Link to="/my-listings" className="mobile-link" onClick={() => setIsMenuOpen(false)}>My Listings</Link>
                    <Link to="/account" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Account</Link>
                    <Link to="/post-ad" className="mobile-post-ad-btn" onClick={() => setIsMenuOpen(false)}>Post Ad</Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;