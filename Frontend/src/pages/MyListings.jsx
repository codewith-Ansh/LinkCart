import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';

const MyListings = () => {
    const navigate = useNavigate();
    const [listings, setListings] = useState([]);

    useEffect(() => {
        // Load listings from localStorage only
        const savedListings = JSON.parse(localStorage.getItem('myListings') || '[]');
        setListings(savedListings);
    }, []);

    const handleEdit = (id) => {
        navigate(`/edit-listing/${id}`);
    };

    const handleMarkAsSold = (id) => {
        const updatedListings = listings.map(listing => 
            listing.id === id ? { ...listing, status: 'Sold' } : listing
        );
        setListings(updatedListings);
        localStorage.setItem('myListings', JSON.stringify(updatedListings));
    };

    const handleDelete = (id) => {
        const updatedListings = listings.filter(listing => listing.id !== id);
        setListings(updatedListings);
        localStorage.setItem('myListings', JSON.stringify(updatedListings));
    };

    return (
        <div>
            <Navbar />
            <div className="my-listings-page">
                <div className="my-listings-container">
                    <h1 className="my-listings-title">My Listings</h1>
                    
                    {listings.length === 0 ? (
                        <div className="empty-state">
                            <h2 className="empty-state-title">No Listings Yet</h2>
                            <p className="empty-state-message">You have not created any products.</p>
                            <button 
                                className="post-first-ad-btn"
                                onClick={() => navigate('/post-ad')}
                            >
                                Post Your First Ad
                            </button>
                        </div>
                    ) : (
                        <div className="my-listings-grid">
                            {listings.map((listing) => {
                                const isSold = listing.status === 'Sold';
                                
                                return (
                                    <div 
                                        key={listing.id} 
                                        className={`listing-card ${isSold ? 'sold' : ''}`}
                                        onClick={() => navigate(`/product/${listing.id}`)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="listing-image-wrapper">
                                            <img src={listing.image} alt={listing.title} className="listing-image" />
                                            <span className={`listing-status-badge ${isSold ? 'sold' : 'active'}`}>
                                                {listing.status}
                                            </span>
                                        </div>
                                        
                                        <div className="listing-content">
                                            <h3 className="listing-title">{listing.title}</h3>
                                            <p className="listing-price">${listing.price}</p>
                                            
                                            <div className="listing-actions">
                                                <button 
                                                    className="edit-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEdit(listing.id);
                                                    }}
                                                >
                                                    <Edit2 size={16} />
                                                    Edit
                                                </button>
                                                
                                                <button 
                                                    className="mark-sold-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleMarkAsSold(listing.id);
                                                    }}
                                                    disabled={isSold}
                                                >
                                                    <CheckCircle size={16} />
                                                    {isSold ? 'Sold' : 'Mark as Sold'}
                                                </button>
                                                
                                                <button 
                                                    className="delete-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(listing.id);
                                                    }}
                                                >
                                                    <Trash2 size={16} />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyListings;
