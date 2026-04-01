import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, ImageOff, Copy, ExternalLink, Flag, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API_BASE from '../utils/api';
import { getProductImageSrc } from '../utils/productImage';
import { useToast } from '../context/ToastContext';
import UserAvatar from '../components/UserAvatar';

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
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    product_id: product.id || product._id || slug,
                    reported_by: localStorage.getItem('customId') || 'unknown',
                    reason: `[${reportReason}] ${reportDescription}`,
                }),
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
            <p className="py-32 text-center text-gray-500">Loading...</p>
            <Footer />
        </div>
    );

    if (notFound || !product) return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
            <Navbar />
            <div className="w-full px-6 py-32 text-center md:px-12 lg:px-20">
                <h2 className="mb-4 text-3xl font-bold">Product not found</h2>
                <p className="mb-8 text-gray-500">This link may have been removed or doesn't exist.</p>
                <button
                    className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-4 font-bold text-white transition-all hover:scale-105"
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
            <div className="w-full px-6 py-16 md:px-12 lg:px-20">
                <div className="mx-auto max-w-5xl">
                    {showSuccessMessage && (
                        <div className="mb-8 rounded-xl border border-green-200 bg-green-50 px-6 py-4 text-center font-semibold text-green-600 transition-all">
                            Report submitted successfully
                        </div>
                    )}

                    <div className="mb-10 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                        <ExternalLink size={16} className="shrink-0 text-indigo-500" />
                        <span className="flex-1 truncate text-sm text-slate-500">{window.location.href}</span>
                        <button
                            onClick={handleCopy}
                            className="flex shrink-0 items-center gap-1.5 rounded-lg bg-indigo-500 px-3 py-2 text-xs font-bold text-white transition-all hover:bg-indigo-600"
                        >
                            <Copy size={13} />
                            {copied ? 'Copied!' : 'Copy Link'}
                        </button>
                    </div>

                    <div className="mb-10 grid gap-10 md:grid-cols-2">
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                            {imageSrc ? (
                                <img src={imageSrc} alt={product.title} className="h-[420px] w-full object-cover" />
                            ) : (
                                <div className="flex h-[420px] w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-slate-100 to-indigo-50 text-slate-400">
                                    <ImageOff size={56} />
                                    <span className="text-base font-medium">No Image Available</span>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
                            <div className="mb-4 flex items-start justify-between">
                                <h1 className="text-3xl font-extrabold leading-tight" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                                    {product.title}
                                </h1>
                                <span className={`ml-3 shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold text-white ${product.visibility === 'private' ? 'bg-slate-500' : 'bg-gradient-to-r from-indigo-500 to-purple-600'}`}>
                                    {product.visibility === 'private' ? 'Private' : 'Public'}
                                </span>
                            </div>

                            <p className="mb-5 text-4xl font-extrabold text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text">
                                ${product.price}
                            </p>

                            {product.location && (
                                <div className="mb-5 flex items-center gap-2 text-gray-500">
                                    <MapPin size={16} />
                                    <span className="font-medium">{product.location}</span>
                                </div>
                            )}

                            {product.description && (
                                <p className="mb-6 flex-1 leading-relaxed text-gray-600">{product.description}</p>
                            )}

                            <div
                                className="mt-auto flex cursor-pointer items-center gap-3 rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-purple-50 p-4 transition-all hover:shadow-md"
                                onClick={() => navigate(`/user/${product.user_id}`)}
                            >
                                <UserAvatar user={product} size="sm" className="h-10 w-10 shrink-0 text-xs" />
                                <div>
                                    <p className="mb-0.5 text-xs text-gray-400">Created by</p>
                                    <p className="text-sm font-bold text-indigo-700">{product.seller_name || product.user_id}</p>
                                </div>
                                <span className="ml-auto text-xs font-medium text-indigo-400">View Profile</span>
                            </div>

                            <button className="mt-4 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 font-bold text-white transition-all hover:scale-105 hover:shadow-xl">
                                Contact Seller
                            </button>
                            <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 px-6 py-4 font-bold text-white transition-all hover:scale-105 hover:shadow-xl" onClick={() => setShowReportModal(true)}>
                                <Flag size={18} /> Report
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showReportModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6" onClick={() => setShowReportModal(false)}>
                    <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between border-b border-slate-200 p-6">
                            <h2 className="text-2xl font-bold" style={{ fontFamily: 'Clash Display, sans-serif' }}>Report Listing</h2>
                            <button onClick={() => setShowReportModal(false)} className="text-gray-500 transition-colors hover:text-gray-700"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleReportSubmit}>
                            <div className="space-y-6 p-6">
                                <div>
                                    <label className="mb-3 block text-sm font-bold">Reason</label>
                                    <select className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" value={reportReason} onChange={(e) => setReportReason(e.target.value)} required>
                                        <option value="">Select a category</option>
                                        <option value="Spam">Spam</option>
                                        <option value="Fake Product">Fake Product</option>
                                        <option value="Abuse">Abuse</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-3 block text-sm font-bold">Description</label>
                                    <textarea className="w-full resize-vertical rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Describe the issue" rows="4" value={reportDescription} onChange={(e) => setReportDescription(e.target.value)} required />
                                </div>
                            </div>
                            <div className="flex gap-3 border-t border-slate-200 p-6">
                                <button type="button" className="flex-1 rounded-xl border-2 border-slate-300 px-6 py-3 font-semibold text-gray-700 transition-all hover:bg-slate-50" onClick={() => setShowReportModal(false)}>Cancel</button>
                                <button type="submit" className="flex-1 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 px-6 py-3 font-bold text-white shadow-md transition-all hover:scale-105 hover:shadow-xl">Submit Report</button>
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
