import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const EditListing = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock data based on ID
    const mockListings = {
        1: { title: 'Vintage Leather Jacket', price: 299, location: 'New York, NY', description: 'Beautiful vintage leather jacket in excellent condition.' },
        2: { title: 'iPhone 13 Pro', price: 799, location: 'Los Angeles, CA', description: 'Barely used iPhone 13 Pro with all accessories.' },
        3: { title: 'Gaming Laptop', price: 1299, location: 'Chicago, IL', description: 'High-performance gaming laptop with RTX graphics.' },
        4: { title: 'Wireless Headphones', price: 149, location: 'Houston, TX', description: 'Premium wireless headphones with noise cancellation.' }
    };

    const [formData, setFormData] = useState({
        title: '',
        price: '',
        location: '',
        description: ''
    });

    useEffect(() => {
        // Load from localStorage first
        const savedListings = JSON.parse(localStorage.getItem('myListings') || '[]');
        const savedProduct = savedListings.find(p => p.id === parseInt(id));
        
        if (savedProduct) {
            setFormData({
                title: savedProduct.title || '',
                price: savedProduct.price || '',
                location: savedProduct.location || '',
                description: savedProduct.description || ''
            });
        } else if (mockListings[id]) {
            setFormData(mockListings[id]);
        }
    }, [id]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Get all listings from localStorage
        const savedListings = JSON.parse(localStorage.getItem('myListings') || '[]');
        
        // Find and update the matching product
        const updatedListings = savedListings.map(listing => {
            if (listing.id === parseInt(id)) {
                return {
                    ...listing,
                    title: formData.title,
                    price: parseFloat(formData.price),
                    location: formData.location,
                    description: formData.description
                };
            }
            return listing;
        });
        
        // Save back to localStorage
        localStorage.setItem('myListings', JSON.stringify(updatedListings));
        
        // Navigate to My Listings
        navigate('/my-listings');
    };

    const handleCancel = () => {
        navigate('/my-listings');
    };

    return (
        <div>
            <Navbar />
            <div className="edit-listing-page">
                <div className="edit-listing-container">
                    <h1 className="edit-listing-title">Edit Listing</h1>
                    
                    <form className="edit-listing-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Title</label>
                            <input
                                type="text"
                                name="title"
                                className="form-input"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Price</label>
                            <input
                                type="number"
                                name="price"
                                className="form-input"
                                value={formData.price}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Location</label>
                            <input
                                type="text"
                                name="location"
                                className="form-input"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                name="description"
                                className="form-textarea"
                                rows="5"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="edit-listing-actions">
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="update-btn"
                            >
                                Update Listing
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditListing;
