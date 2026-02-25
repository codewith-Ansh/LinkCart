import React, { useState, useEffect } from 'react';
import { Star, MapPin, Flag, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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
        { id: 1, reviewerName: 'Sarah Johnson', rating: 5, comment: 'Great seller! Product exactly as described. Fast shipping and excellent communication.' },
        { id: 2, reviewerName: 'Mike Chen', rating: 4, comment: 'Good quality product. Seller was responsive and helpful.' },
        { id: 3, reviewerName: 'Emily Davis', rating: 5, comment: 'Highly recommend! The item was in perfect condition and arrived quickly.' }
    ]);

    const mockProducts = {
        1: { title: 'Vintage Leather Jacket', price: 299, location: 'New York, NY', status: 'Active', images: ['https://via.placeholder.com/800x600/6366f1/ffffff?text=Product+Image'], description: 'This is a beautiful vintage leather jacket in excellent condition.', seller: { name: 'John Doe', rating: 4 } },
        2: { title: 'iPhone 13 Pro', price: 799, location: 'Los Angeles, CA', status: 'Sold', images: ['https://via.placeholder.com/800x600/8b5cf6/ffffff?text=Product+Image'], description: 'Barely used iPhone 13 Pro with all accessories.', seller: { name: 'John Doe', rating: 4 } },
        3: { title: 'Gaming Laptop', price: 1299, location: 'Chicago, IL', status: 'Active', images: ['https://via.placeholder.com/800x600/ec4899/ffffff?text=Product+Image'], description: 'High-performance gaming laptop with RTX graphics.', seller: { name: 'John Doe', rating: 4 } },
        4: { title: 'Wireless Headphones', price: 149, location: 'Houston, TX', status: 'Active', images: ['https://via.placeholder.com/800x600/22c55e/ffffff?text=Product+Image'], description: 'Premium wireless headphones with noise cancellation.', seller: { name: 'John Doe', rating: 4 } }
    };

    const [product, setProduct] = useState(null);

    useEffect(() => {
        const savedListings = JSON.parse(localStorage.getItem('myListings') || '[]');
        const savedProduct = savedListings.find(p => p.id === parseInt(id));
        if (savedProduct) {
            setProduct({ title: savedProduct.title, price: savedProduct.price, location: savedProduct.location || 'Location not specified', status: savedProduct.status, images: [savedProduct.image], description: savedProduct.description || 'No description available.', seller: { name: 'John Doe', rating: 4 } });
        } else if (mockProducts[id]) {
            setProduct(mockProducts[id]);
        } else {
            setProduct(mockProducts[1]);
        }
    }, [id]);

    if (!product) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
                <Navbar />
                <div className="w-full px-6 md:px-12 lg:px-20 py-32 text-center">
                    <h2 className="text-3xl font-bold mb-8">Product not found</h2>
                    <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold px-8 py-4 rounded-xl hover:scale-105 transition-all" onClick={() => navigate('/products')}>
                        Back to Products
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    const isSold = product.status === 'Sold';
    const averageRating = reviews.length > 0 ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : 0;

    const handleReportSubmit = () => {
        const newReport = { id: Date.now(), productId: product.id || parseInt(id), productTitle: product.title, reason: reportReason, description: reportDescription };
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
            const newReview = { id: reviews.length + 1, reviewerName: 'You', rating: reviewRating, comment: reviewComment };
            setReviews([newReview, ...reviews]);
            setShowReviewModal(false);
            setReviewRating(0);
            setReviewComment('');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
            <Navbar />
            <div className="w-full px-6 md:px-12 lg:px-20 py-16 animate-fade-in">
                {showSuccessMessage && (
                    <div className="bg-green-50 text-green-600 px-6 py-4 rounded-xl mb-8 text-center border border-green-200 font-semibold">
                        Report submitted successfully
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-12 mb-16">
                    <div>
                        <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xl mb-6">
                            <img src={product.images[selectedImage]} alt={product.title} className="w-full h-[500px] object-cover" />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xl">
                        <div className="flex justify-between items-start mb-6">
                            <h1 className="text-4xl font-extrabold" style={{ fontFamily: 'Clash Display, sans-serif' }}>{product.title}</h1>
                            <span className={`px-4 py-2 rounded-xl text-sm font-bold text-white ${isSold ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-indigo-500 to-purple-600'}`}>
                                {product.status}
                            </span>
                        </div>

                        <p className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">${product.price}</p>

                        <div className="flex items-center gap-2 text-gray-600 mb-8 pb-8 border-b border-slate-200">
                            <MapPin size={20} />
                            <span className="font-medium">{product.location}</span>
                        </div>

                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 mb-8">
                            <p className="text-sm text-gray-600 mb-2">Seller</p>
                            <p className="text-xl font-bold mb-3 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => navigate('/seller/1')}>{product.seller.name}</p>
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={18} fill={i < product.seller.rating ? '#FCD34D' : 'none'} color={i < product.seller.rating ? '#FCD34D' : '#D1D5DB'} />
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button className={`w-full font-bold px-6 py-4 rounded-xl transition-all ${isSold ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:scale-105 hover:shadow-xl'}`} disabled={isSold}>
                                {isSold ? 'Sold Out' : 'Contact Seller'}
                            </button>
                            <button className="w-full border-2 border-red-500 text-red-500 font-semibold px-6 py-4 rounded-xl hover:bg-red-50 transition-all flex items-center justify-center gap-2" onClick={() => setShowReportModal(true)}>
                                <Flag size={18} /> Report
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xl mb-16">
                    <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'Clash Display, sans-serif' }}>Description</h2>
                    <p className="text-gray-600 leading-relaxed text-lg">{product.description}</p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xl">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Clash Display, sans-serif' }}>Reviews</h2>
                            <div className="flex items-center gap-3">
                                <span className="text-2xl font-bold">{averageRating}</span>
                                <Star size={24} fill="#FCD34D" color="#FCD34D" />
                                <span className="text-gray-600">({reviews.length} reviews)</span>
                            </div>
                        </div>
                        <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold px-6 py-3 rounded-xl hover:scale-105 transition-all" onClick={() => setShowReviewModal(true)}>
                            Write a Review
                        </button>
                    </div>

                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <div key={review.id} className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl p-6">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="font-bold text-lg">{review.reviewerName}</span>
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={16} fill={i < review.rating ? '#FCD34D' : 'none'} color={i < review.rating ? '#FCD34D' : '#D1D5DB'} />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {showReviewModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6" onClick={() => setShowReviewModal(false)}>
                    <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center p-6 border-b border-slate-200">
                            <h2 className="text-2xl font-bold" style={{ fontFamily: 'Clash Display, sans-serif' }}>Write a Review</h2>
                            <button onClick={() => setShowReviewModal(false)}><X size={24} /></button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-bold mb-3">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} size={36} fill={star <= reviewRating ? '#FCD34D' : 'none'} color={star <= reviewRating ? '#FCD34D' : '#D1D5DB'} onClick={() => setReviewRating(star)} className="cursor-pointer hover:scale-110 transition-transform" />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-3">Comment</label>
                                <textarea className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-vertical" placeholder="Share your experience" rows="4" value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} />
                            </div>
                        </div>
                        <div className="flex gap-3 p-6 border-t border-slate-200">
                            <button className="flex-1 border-2 border-slate-300 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:bg-slate-50 transition-all" onClick={() => setShowReviewModal(false)}>Cancel</button>
                            <button className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold px-6 py-3 rounded-xl hover:scale-105 transition-all" onClick={handleReviewSubmit}>Submit</button>
                        </div>
                    </div>
                </div>
            )}

            {showReportModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6" onClick={() => setShowReportModal(false)}>
                    <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center p-6 border-b border-slate-200">
                            <h2 className="text-2xl font-bold" style={{ fontFamily: 'Clash Display, sans-serif' }}>Report Listing</h2>
                            <button onClick={() => setShowReportModal(false)}><X size={24} /></button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-bold mb-3">Reason</label>
                                <select className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" value={reportReason} onChange={(e) => setReportReason(e.target.value)}>
                                    <option value="">Select a reason</option>
                                    <option value="spam">Spam</option>
                                    <option value="fake">Fake Product</option>
                                    <option value="inappropriate">Inappropriate Content</option>
                                    <option value="scam">Scam</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-3">Description</label>
                                <textarea className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-vertical" placeholder="Describe the issue" rows="4" value={reportDescription} onChange={(e) => setReportDescription(e.target.value)} />
                            </div>
                        </div>
                        <div className="flex gap-3 p-6 border-t border-slate-200">
                            <button className="flex-1 border-2 border-slate-300 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:bg-slate-50 transition-all" onClick={() => setShowReportModal(false)}>Cancel</button>
                            <button className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold px-6 py-3 rounded-xl hover:scale-105 transition-all" onClick={handleReportSubmit}>Submit Report</button>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default ProductDetail;
