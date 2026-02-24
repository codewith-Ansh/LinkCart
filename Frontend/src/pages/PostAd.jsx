import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X } from 'lucide-react';
import Navbar from '../components/Navbar';

const PostAd = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        location: '',
        description: '',
        image: null
    });

    const [imagePreview, setImagePreview] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                image: file
            });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setFormData({
            ...formData,
            image: null
        });
        setImagePreview(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate required fields
        if (!formData.title || !formData.price || !formData.location) {
            alert('Please fill in all required fields');
            return;
        }

        // Create new listing
        const newListing = {
            id: Date.now(),
            title: formData.title,
            price: parseFloat(formData.price),
            location: formData.location,
            description: formData.description,
            status: 'Active',
            image: imagePreview || 'https://via.placeholder.com/300x200'
        };

        // Get existing listings from localStorage
        const existingListings = JSON.parse(localStorage.getItem('myListings') || '[]');
        
        // Add new listing
        existingListings.push(newListing);
        
        // Save to localStorage
        localStorage.setItem('myListings', JSON.stringify(existingListings));

        // Navigate to My Listings
        navigate('/my-listings');
    };

    return (
        <div>
            <Navbar />
            <div className="post-ad-page">
                <div className="post-ad-container">
                    <h1 className="post-ad-title">Post New Ad</h1>
                    
                    <form className="post-ad-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Title</label>
                            <input
                                type="text"
                                name="title"
                                className="form-input"
                                placeholder="Enter product title"
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
                                placeholder="Enter price"
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
                                placeholder="Enter location"
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
                                placeholder="Describe your product"
                                rows="5"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Product Image</label>
                            {!imagePreview ? (
                                <label className="image-upload-box">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{ display: 'none' }}
                                    />
                                    <Upload size={32} color="#6B7280" />
                                    <p>Click to upload image</p>
                                    <span>or drag and drop</span>
                                </label>
                            ) : (
                                <div className="image-preview-container">
                                    <img src={imagePreview} alt="Preview" className="image-preview" />
                                    <button
                                        type="button"
                                        className="remove-image-btn"
                                        onClick={removeImage}
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            )}
                        </div>

                        <button type="submit" className="publish-btn">
                            Publish Listing
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PostAd;
