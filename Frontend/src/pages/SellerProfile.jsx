import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import Navbar from '../components/Navbar';

const SellerProfile = () => {
    const navigate = useNavigate();
    // Mock data
    const seller = {
        id: 1,
        name: 'John Doe',
        avatar: 'https://via.placeholder.com/120',
        rating: 4.5,
        totalReviews: 28
    };

    const listings = [
        {
            id: 1,
            title: 'Vintage Leather Jacket',
            price: 299,
            status: 'Active',
            image: 'https://via.placeholder.com/300x200'
        },
        {
            id: 2,
            title: 'Gaming Laptop',
            price: 1299,
            status: 'Active',
            image: 'https://via.placeholder.com/300x200/0D9488'
        },
        {
            id: 3,
            title: 'Wireless Headphones',
            price: 149,
            status: 'Active',
            image: 'https://via.placeholder.com/300x200/065F46'
        },
        {
            id: 4,
            title: 'Smart Watch',
            price: 399,
            status: 'Active',
            image: 'https://via.placeholder.com/300x200/10B981'
        },
        {
            id: 5,
            title: 'Camera Lens',
            price: 599,
            status: 'Active',
            image: 'https://via.placeholder.com/300x200/EF4444'
        },
        {
            id: 6,
            title: 'Mechanical Keyboard',
            price: 179,
            status: 'Active',
            image: 'https://via.placeholder.com/300x200/F59E0B'
        }
    ];

    return (
        <div>
            <Navbar />
            <div className="seller-profile-page">
                <div className="seller-profile-container">
                    {/* Seller Info Section */}
                    <div className="seller-info-section">
                        <div className="seller-avatar">
                            <img src={seller.avatar} alt={seller.name} />
                        </div>
                        <div className="seller-info-details">
                            <h1 className="seller-profile-name">{seller.name}</h1>
                            <div className="seller-rating-info">
                                <div className="seller-stars">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={20}
                                            fill={i < Math.floor(seller.rating) ? '#FCD34D' : 'none'}
                                            color={i < Math.floor(seller.rating) ? '#FCD34D' : '#D1D5DB'}
                                        />
                                    ))}
                                </div>
                                <span className="seller-rating-text">
                                    {seller.rating} ({seller.totalReviews} reviews)
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Active Listings Section */}
                    <div className="seller-listings-section">
                        <h2 className="seller-listings-title">Active Listings</h2>
                        <div className="seller-listings-grid">
                            {listings.map((listing) => (
                                <div 
                                    key={listing.id} 
                                    className="seller-listing-card"
                                    onClick={() => navigate(`/product/${listing.id}`)}
                                >
                                    <div className="seller-listing-image-wrapper">
                                        <img 
                                            src={listing.image} 
                                            alt={listing.title} 
                                            className="seller-listing-image" 
                                        />
                                        <span className="seller-listing-badge">
                                            {listing.status}
                                        </span>
                                    </div>
                                    <div className="seller-listing-content">
                                        <h3 className="seller-listing-title">{listing.title}</h3>
                                        <p className="seller-listing-price">${listing.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerProfile;
