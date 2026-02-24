import React, { useState, useEffect } from 'react';
import { Star, MapPin, Flag, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

const ProductDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [selectedImage, setSelectedImage] = useState(0);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [reportDescription, setReportDescription] = useState('');
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewComment, setReviewComment] = useState('');
    const [reviews, setReviews] = useState([
        {
            id: 1,
            reviewerName: 'Sarah Johnson',
            rating: 5,
            comment: 'Great seller! Product exactly as described. Fast shipping and excellent communication.'
        },
        {
            id: 2,
            reviewerName: 'Mike Chen',
            rating: 4,
            comment: 'Good quality product. Seller was responsive and helpful.'
        },
        {
            id: 3,
            reviewerName: 'Emily Davis',
            rating: 5,
            comment: 'Highly recommend! The item was in perfect condition and arrived quickly.'
        }
    ]);

    // Mock data
    const mockProducts = {
        1: {
            title: 'Vintage Leather Jacket',
            price: 299,
            location: 'New York, NY',
            status: 'Active',
            images: ['https://via.placeholder.com/600x400'],
            description: 'This is a beautiful vintage leather jacket in excellent condition.',
            seller: { name: 'John Doe', rating: 4 }
        },
        2: {
            title: 'iPhone 13 Pro',
            price: 799,
            location: 'Los Angeles, CA',
            status: 'Sold',
            images: ['https://via.placeholder.com/600x400/0D9488'],
            description: 'Barely used iPhone 13 Pro with all accessories.',
            seller: { name: 'John Doe', rating: 4 }
        },
        3: {
            title: 'Gaming Laptop',
            price: 1299,
            location: 'Chicago, IL',
            status: 'Active',
            images: ['https://via.placeholder.com/600x400/065F46'],
            description: 'High-performance gaming laptop with RTX graphics.',
            seller: { name: 'John Doe', rating: 4 }
        },
        4: {
            title: 'Wireless Headphones',
            price: 149,
            location: 'Houston, TX',
            status: 'Active',
            images: ['https://via.placeholder.com/600x400/10B981'],
            description: 'Premium wireless headphones with noise cancellation.',
            seller: { name: 'John Doe', rating: 4 }
        }
    };

    const [product, setProduct] = useState(null);

    useEffect(() => {
        // Load from localStorage first
        const savedListings = JSON.parse(localStorage.getItem('myListings') || '[]');
        const savedProduct = savedListings.find(p => p.id === parseInt(id));
        
        if (savedProduct) {
            setProduct({
                title: savedProduct.title,
                price: savedProduct.price,
                location: savedProduct.location || 'Location not specified',
                status: savedProduct.status,
                images: [savedProduct.image],
                description: savedProduct.description || 'No description available.',
                seller: { name: 'John Doe', rating: 4 }
            });
        } else if (mockProducts[id]) {
            setProduct(mockProducts[id]);
        } else {
            setProduct(mockProducts[1]); // Default fallback
        }
    }, [id]);

    if (!product) {
        return (
            <div>
                <Navbar />
                <div className="product-detail-page">
                    <div className="product-detail-container">
                        <div className="product-not-found">
                            <h2 className="not-found-title">Product not found or has been removed.</h2>
                            <button 
                                className="back-to-products-btn"
                                onClick={() => navigate('/products')}
                            >
                                Back to Products
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const isSold = product.status === 'Sold';

    const averageRating = reviews.length > 0 
        ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
        : 0;

    const handleReportSubmit = () => {
        const newReport = {
            id: Date.now(),
            productId: product.id || parseInt(id),
            productTitle: product.title,
            reason: reportReason,
            description: reportDescription
        };
        
        const existingReports = JSON.parse(localStorage.getItem('reports') || '[]');
        existingReports.push(newReport);
        localStorage.setItem('reports', JSON.stringify(existingReports));
        
        setShowReportModal(false);
        setReportReason('');
        setReportDescription('');
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
    };

    const handleReviewSubmit = () => {
        if (reviewRating > 0 && reviewComment.trim()) {
            const newReview = {
                id: reviews.length + 1,
                reviewerName: 'You',
                rating: reviewRating,
                comment: reviewComment
            };
            setReviews([newReview, ...reviews]);
            setShowReviewModal(false);
            setReviewRating(0);
            setReviewComment('');
        }
    };

    return (
        <div>
            <Navbar />
            <div className="product-detail-page">
                <div className="product-detail-container">
                    {/* Success Message */}
                    {showSuccessMessage && (
                        <div className="success-message">
                            Report submitted successfully
                        </div>
                    )}

                    {/* Two Column Layout */}
                    <div className="product-detail-grid">
                        {/* Left: Image Gallery */}
                        <div className="product-gallery">
                            <div className="main-image-wrapper">
                                <img 
                                    src={product.images[selectedImage]} 
                                    alt={product.title} 
                                    className="main-product-image" 
                                />
                            </div>
                            <div className="thumbnail-grid">
                                {product.images.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt={`Thumbnail ${index + 1}`}
                                        className={`thumbnail-image ${selectedImage === index ? 'active' : ''}`}
                                        onClick={() => setSelectedImage(index)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Right: Product Info */}
                        <div className="product-info-card">
                            <div className="product-header">
                                <h1 className="product-detail-title">{product.title}</h1>
                                <span className={`product-status-badge ${isSold ? 'sold' : 'active'}`}>
                                    {product.status}
                                </span>
                            </div>

                            <p className="product-detail-price">${product.price}</p>

                            <div className="product-meta">
                                <div className="meta-item">
                                    <MapPin size={18} color="#6B7280" />
                                    <span>{product.location}</span>
                                </div>
                            </div>

                            <div className="seller-info-card">
                                <div className="seller-details">
                                    <p className="seller-label">Seller</p>
                                    <p 
                                        className="seller-detail-name clickable"
                                        onClick={() => navigate('/seller/1')}
                                    >
                                        {product.seller.name}
                                    </p>
                                    <div className="seller-detail-rating">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={16}
                                                fill={i < product.seller.rating ? '#FCD34D' : 'none'}
                                                color={i < product.seller.rating ? '#FCD34D' : '#D1D5DB'}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="action-buttons">
                                <button 
                                    className="contact-seller-btn" 
                                    disabled={isSold}
                                >
                                    {isSold ? 'Sold Out' : 'Contact Seller'}
                                </button>
                                <button 
                                    className="report-btn"
                                    onClick={() => setShowReportModal(true)}
                                >
                                    <Flag size={18} />
                                    Report
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="description-section">
                        <h2 className="description-title">Description</h2>
                        <p className="description-text">{product.description}</p>
                    </div>

                    {/* Reviews Section */}
                    <div className="reviews-section">
                        <div className="reviews-header">
                            <div>
                                <h2 className="reviews-title">Reviews</h2>
                                <div className="reviews-summary">
                                    <span className="average-rating">{averageRating}</span>
                                    <Star size={20} fill="#FCD34D" color="#FCD34D" />
                                    <span className="review-count">({reviews.length} reviews)</span>
                                </div>
                            </div>
                            <button 
                                className="write-review-btn"
                                onClick={() => setShowReviewModal(true)}
                            >
                                Write a Review
                            </button>
                        </div>

                        <div className="reviews-list">
                            {reviews.map((review) => (
                                <div key={review.id} className="review-card">
                                    <div className="review-header">
                                        <span className="reviewer-name">{review.reviewerName}</span>
                                        <div className="review-stars">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={16}
                                                    fill={i < review.rating ? '#FCD34D' : 'none'}
                                                    color={i < review.rating ? '#FCD34D' : '#D1D5DB'}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="review-comment">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Review Modal */}
            {showReviewModal && (
                <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">Write a Review</h2>
                            <button 
                                className="modal-close-btn"
                                onClick={() => setShowReviewModal(false)}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Rating</label>
                                <div className="star-selector">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            size={32}
                                            fill={star <= reviewRating ? '#FCD34D' : 'none'}
                                            color={star <= reviewRating ? '#FCD34D' : '#D1D5DB'}
                                            onClick={() => setReviewRating(star)}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Comment</label>
                                <textarea 
                                    className="form-textarea"
                                    placeholder="Share your experience"
                                    rows="4"
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button 
                                className="modal-cancel-btn"
                                onClick={() => setShowReviewModal(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="modal-submit-review-btn"
                                onClick={handleReviewSubmit}
                            >
                                Submit Review
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Report Modal */}
            {showReportModal && (
                <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">Report Listing</h2>
                            <button 
                                className="modal-close-btn"
                                onClick={() => setShowReportModal(false)}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Reason</label>
                                <select 
                                    className="form-select"
                                    value={reportReason}
                                    onChange={(e) => setReportReason(e.target.value)}
                                >
                                    <option value="">Select a reason</option>
                                    <option value="spam">Spam</option>
                                    <option value="fake">Fake Product</option>
                                    <option value="inappropriate">Inappropriate Content</option>
                                    <option value="scam">Scam</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea 
                                    className="form-textarea"
                                    placeholder="Describe the issue"
                                    rows="4"
                                    value={reportDescription}
                                    onChange={(e) => setReportDescription(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button 
                                className="modal-cancel-btn"
                                onClick={() => setShowReportModal(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="modal-submit-btn"
                                onClick={handleReportSubmit}
                            >
                                Submit Report
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;
