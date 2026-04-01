import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, ImageOff, User, Copy, ExternalLink, Flag, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API_BASE from '../utils/api';
import { getProductImageSrc } from '../utils/productImage';
import { useToast } from '../context/ToastContext';

const PublicProductPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [reportDescription, setReportDescription] = useState('');
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const toast = useToast();

    useEffect(() => {
        fetch(`${API_BASE}/api/products/${slug}`)
            .then((res) => {
                if (res.status === 404) { setNotFound(true); return null; }
                return res.json();
            })
            .then((data) => { if (data) setProduct(data); })
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
    }, [slug]);

    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    const imageSrc = getProductImageSrc(product);

    const handleReportSubmit = async (e) => {
        if (e) e.preventDefault();

        if (!reportReason || !reportDescription.trim()) {
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            toast.warning('You must be logged in to submit a report.');
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/api/reports`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    product_id: product.id || product._id || slug,
                    reported_by: localStorage.getItem('customId') || 'unknown',
                    reason: `[${reportReason}] ${reportDescription}`
                })
            });

            if (response.ok) {
                setShowReportModal(false);
                setReportReason('');
                setReportDescription('');
                setShowSuccessMessage(true);
                setTimeout(() => setShowSuccessMessage(false), 3000);
            } else {
                const data = await response.json().catch(() => ({}));
                toast.error(data.error || 'Failed to submit report. Please try again later.');
            }
        } catch (error) {
            console.error('Error submitting report:', error);
            toast.error('An error occurred. Please try again.');
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
            <Navbar />
            <p className="text-center text-gray-500 py-32">Loading...</p>
            <Footer />
        </div>
    );

    if (notFound || !product) return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
            <Navbar />
            <div className="w-full px-6 md:px-12 lg:px-20 py-32 text-center">
                <h2 className="text-3xl font-bold mb-4">Product not found</h2>
                <p className="text-gray-500 mb-8">This link may have been removed or doesn't exist.</p>
                <button
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold px-8 py-4 rounded-xl hover:scale-105 transition-all"
                    onClick={() => navigate('/products')}
                >
                    Browse Products
                </button>
            </div>
            <Footer />
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
            <Navbar />
            <div className="w-full px-6 md:px-12 lg:px-20 py-16 animate-fade-in">
                <div className="max-w-5xl mx-auto">

                    {showSuccessMessage && (
                        <div className="bg-green-50 text-green-600 px-6 py-4 rounded-xl mb-8 text-center border border-green-200 font-semibold transition-all">
                            Report submitted successfully
                        </div>
                    )}

                    {/* Share bar */}
                    <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 mb-10 shadow-sm">
                        <ExternalLink size={16} className="text-indigo-500 shrink-0" />
                        <span className="flex-1 text-sm text-slate-500 truncate">{window.location.href}</span>
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold px-3 py-2 rounded-lg transition-all shrink-0"
                        >
                            <Copy size={13} />
                            {copied ? 'Copied!' : 'Copy Link'}
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-10 mb-10">
                        {/* Image */}
                        <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xl">
                            {imageSrc ? (
                                <img src={imageSrc} alt={product.title} className="w-full h-[420px] object-cover" />
                            ) : (
                                <div className="w-full h-[420px] bg-gradient-to-br from-slate-100 to-indigo-50 flex flex-col items-center justify-center gap-3 text-slate-400">
                                    <ImageOff size={56} />
                                    <span className="text-base font-medium">No Image Available</span>
                                </div>
                            )}
                        </div>

                        {/* Details */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xl flex flex-col">
                            <div className="flex items-start justify-between mb-4">
                                <h1 className="text-3xl font-extrabold leading-tight" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                                    {product.title}
                                </h1>
                                <span className={`ml-3 shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold text-white ${product.visibility === 'private' ? 'bg-slate-500' : 'bg-gradient-to-r from-indigo-500 to-purple-600'}`}>
                                    {product.visibility === 'private' ? 'Private' : 'Public'}
                                </span>
                            </div>

                            <p className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-5">
                                ${product.price}
                            </p>

                            {product.location && (
                                <div className="flex items-center gap-2 text-gray-500 mb-5">
                                    <MapPin size={16} />
                                    <span className="font-medium">{product.location}</span>
                                </div>
                            )}

                            {product.description && (
                                <p className="text-gray-600 leading-relaxed mb-6 flex-1">{product.description}</p>
                            )}

                            {/* Creator */}
                            <div
                                className="flex items-center gap-3 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-4 cursor-pointer hover:shadow-md transition-all mt-auto"
                                onClick={() => navigate(`/user/${product.user_id}`)}
                            >
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shrink-0">
                                    <User size={20} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 mb-0.5">Created by</p>
                                    <p className="font-bold text-indigo-700 text-sm">{product.user_id}</p>
                                </div>
                                <span className="ml-auto text-xs text-indigo-400 font-medium">View Profile →</span>
                            </div>

                            <button className="mt-4 w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold px-6 py-4 rounded-xl hover:scale-105 hover:shadow-xl transition-all">
                                Contact Seller
                            </button>
                            <button className="mt-3 w-full bg-gradient-to-r from-rose-500 to-red-600 text-white font-bold px-6 py-4 rounded-xl hover:scale-105 hover:shadow-xl transition-all flex items-center justify-center gap-2" onClick={() => setShowReportModal(true)}>
                                <Flag size={18} /> Report
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showReportModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6" onClick={() => setShowReportModal(false)}>
                    <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center p-6 border-b border-slate-200">
                            <h2 className="text-2xl font-bold" style={{ fontFamily: 'Clash Display, sans-serif' }}>Report Listing</h2>
                            <button onClick={() => setShowReportModal(false)} className="text-gray-500 hover:text-gray-700 transition-colors"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleReportSubmit}>
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-bold mb-3">Reason</label>
                                    <select className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white" value={reportReason} onChange={(e) => setReportReason(e.target.value)} required>
                                        <option value="">Select a category</option>
                                        <option value="Spam">Spam</option>
                                        <option value="Fake Product">Fake Product</option>
                                        <option value="Abuse">Abuse</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-3">Description</label>
                                    <textarea className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-vertical" placeholder="Describe the issue" rows="4" value={reportDescription} onChange={(e) => setReportDescription(e.target.value)} required />
                                </div>
                            </div>
                            <div className="flex gap-3 p-6 border-t border-slate-200">
                                <button type="button" className="flex-1 border-2 border-slate-300 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:bg-slate-50 transition-all" onClick={() => setShowReportModal(false)}>Cancel</button>
                                <button type="submit" className="flex-1 bg-gradient-to-r from-rose-500 to-red-600 text-white font-bold px-6 py-3 rounded-xl hover:scale-105 transition-all shadow-md hover:shadow-xl">Submit Report</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default PublicProductPage;
