import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, ImageOff, Copy, ExternalLink, Flag, Loader2, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API_BASE from '../utils/api';
import { getProductImageSrc } from '../utils/productImage';
import { useToast } from '../context/ToastContext';
import UserAvatar from '../components/UserAvatar';
import ProductStatusBadge from '../components/ProductStatusBadge';
import { useAppContext } from '../context/AppContext';
import { getProfileCompletionDetails, isProfileComplete } from '../utils/profileCompletion';

const PublicProductPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [showInterestComposer, setShowInterestComposer] = useState(false);
    const [interestSubmitting, setInterestSubmitting] = useState(false);
    const [interestSent, setInterestSent] = useState(false);
    const [interestMessage, setInterestMessage] = useState('');
    const [profileWarning, setProfileWarning] = useState('');
    const [completeProfilePulse, setCompleteProfilePulse] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [reportDescription, setReportDescription] = useState('');
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const toast = useToast();
    const { currentUser, isLoggedIn, refreshCurrentUser, refreshSellerInterestCount } = useAppContext();
    const profileDetails = useMemo(() => getProfileCompletionDetails(currentUser), [currentUser]);
    const profileComplete = isProfileComplete(currentUser);

    useEffect(() => {
        fetch(`${API_BASE}/api/products/${slug}`)
            .then((res) => {
                if (res.status === 404) {
                    setNotFound(true);
                    return null;
                }
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
    const isOwner = currentUser?.custom_id && product?.user_id === currentUser.custom_id;
    const isSold = product?.status === 'sold';
    const isInDeal = product?.status === 'in_progress';

    useEffect(() => {
        if (profileComplete) {
            setProfileWarning('');
        }
    }, [profileComplete]);

    const handleInterestConfirm = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const latestUser = currentUser || await refreshCurrentUser();
        if (!isProfileComplete(latestUser)) {
            setProfileWarning('Complete your profile (Phone, Email, Location) to contact the seller.');
            return;
        }

        setInterestSubmitting(true);

        try {
            const response = await fetch(`${API_BASE}/api/interests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    productId: product.id,
                    message: interestMessage,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send interest.');
            }

            setInterestSent(true);
            setShowInterestComposer(false);
            setInterestMessage('');
            toast.success('Interest sent successfully.');
            refreshSellerInterestCount();
        } catch (error) {
            if (error.message.toLowerCase().includes('already shown interest')) {
                setInterestSent(true);
                setShowInterestComposer(false);
            }
            toast.error(error.message || 'Failed to send interest.');
        } finally {
            setInterestSubmitting(false);
        }
    };

    const handleInterestedClick = async () => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        const latestUser = currentUser || await refreshCurrentUser();
        if (!isProfileComplete(latestUser)) {
            setProfileWarning('Complete your profile (Phone, Email, Location) to contact the seller.');
            setShowInterestComposer(false);
            return;
        }

        setProfileWarning('');
        setShowInterestComposer((prev) => !prev);
    };

    const handleCompleteProfileClick = () => {
        setCompleteProfilePulse(true);
        setTimeout(() => setCompleteProfilePulse(false), 300);
        navigate('/profile');
    };

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
                    product_id: product.id || slug,
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
        <div className="min-h-screen bg-gradient-to-b from-purple-50/40 via-white to-gray-50">
            <Navbar />
            <div className="flex justify-center py-32">
                <Loader2 size={30} className="animate-spin text-purple-600" />
            </div>
            <Footer />
        </div>
    );

    if (notFound || !product) return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50/40 via-white to-gray-50">
            <Navbar />
            <div className="w-full px-6 py-32 text-center md:px-12 lg:px-20">
                <h2 className="mb-4 text-3xl font-bold text-gray-900">Product not found</h2>
                <p className="mb-8 text-gray-500">This link may have been removed or does not exist.</p>
                <button
                    className="rounded-xl bg-purple-600 px-8 py-4 font-bold text-white transition-colors hover:bg-purple-700"
                    onClick={() => navigate('/products')}
                >
                    Browse Products
                </button>
            </div>
            <Footer />
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50/40 via-white to-gray-50">
            <Navbar />
            <div className="w-full px-6 py-16 md:px-12 lg:px-20">
                <div className="mx-auto max-w-5xl">
                    {showSuccessMessage && (
                        <div className="mb-8 rounded-xl border border-purple-100 bg-purple-50 px-6 py-4 text-center font-semibold text-purple-700">
                            Report submitted successfully
                        </div>
                    )}

                    <div className="mb-10 flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
                        <ExternalLink size={16} className="shrink-0 text-purple-600" />
                        <span className="flex-1 truncate text-sm text-gray-500">{window.location.href}</span>
                        <button
                            onClick={handleCopy}
                            className="flex shrink-0 items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-purple-700"
                        >
                            <Copy size={13} />
                            {copied ? 'Copied!' : 'Copy Link'}
                        </button>
                    </div>

                    <div className="mb-10 grid gap-10 md:grid-cols-2">
                        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                            {imageSrc ? (
                                <img src={imageSrc} alt={product.title} className="h-[420px] w-full object-cover" />
                            ) : (
                                <div className="flex h-[420px] w-full flex-col items-center justify-center gap-3 bg-gray-50 text-slate-400">
                                    <ImageOff size={56} />
                                    <span className="text-base font-medium">No Image Available</span>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
                            <div className="mb-4 flex items-start justify-between gap-4">
                                <h1 className="text-3xl font-bold leading-tight text-gray-900" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                                    {product.title}
                                </h1>
                                <ProductStatusBadge status={product.status} />
                            </div>

                            <p className="mb-5 text-4xl font-extrabold text-gray-900">
                                ${product.price}
                            </p>

                            {product.location && (
                                <div className="mb-5 flex items-center gap-2 text-gray-500">
                                    <MapPin size={16} className="text-purple-600" />
                                    <span className="font-medium">{product.location}</span>
                                </div>
                            )}

                            {product.description && (
                                <p className="mb-6 flex-1 leading-relaxed text-gray-600">{product.description}</p>
                            )}

                            <div
                                className="mt-auto flex cursor-pointer items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 transition-colors hover:bg-purple-50"
                                onClick={() => navigate(`/user/${product.user_id}`)}
                            >
                                <UserAvatar user={product} size="sm" className="h-10 w-10 shrink-0 text-xs" />
                                <div>
                                    <p className="mb-0.5 text-xs text-gray-400">Posted by</p>
                                    <p className="text-sm font-semibold text-gray-800">{product.seller_name || product.user_id}</p>
                                </div>
                                <span className="ml-auto text-xs font-medium text-purple-600">View Profile</span>
                            </div>

                            <button
                                type="button"
                                disabled={!isLoggedIn || isOwner || isSold || interestSent}
                                onClick={handleInterestedClick}
                                className="mt-4 w-full rounded-xl bg-purple-600 px-6 py-4 font-semibold text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
                            >
                                {isOwner
                                    ? 'Your Listing'
                                    : isSold
                                        ? 'Sold'
                                        : interestSent
                                            ? 'Interest Sent'
                                            : isInDeal
                                                ? "I'm Interested"
                                                : "I'm Interested"}
                            </button>

                            {!isLoggedIn && (
                                <p className="mt-3 text-sm text-gray-500">Log in to express interest in this product.</p>
                            )}

                            {profileWarning && isLoggedIn && !isOwner && !isSold && !interestSent && (
                                <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800 animate-fade-in">
                                    <p className="font-semibold">{profileWarning}</p>
                                    <p className="mt-1 text-xs text-amber-700">
                                        Missing: {profileDetails.missingFields.map((field) => {
                                            if (field === 'phoneNumber') return 'Phone';
                                            if (field === 'location') return 'Location';
                                            return 'Email';
                                        }).join(', ')}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handleCompleteProfileClick}
                                        className={`mt-3 inline-flex items-center rounded-lg px-3 py-2 text-xs font-semibold text-white transition-all duration-200 ${
                                            completeProfilePulse ? 'bg-amber-500 scale-95' : 'bg-amber-600 hover:bg-amber-700'
                                        }`}
                                    >
                                        Complete Profile
                                    </button>
                                </div>
                            )}

                            {showInterestComposer && isLoggedIn && !isOwner && !isSold && !interestSent && (
                                <div className="mt-3 rounded-xl border border-purple-100 bg-purple-50/70 p-4 animate-fade-in">
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Write a message to the seller (optional)
                                    </label>
                                    <textarea
                                        value={interestMessage}
                                        onChange={(event) => setInterestMessage(event.target.value)}
                                        rows={4}
                                        maxLength={1000}
                                        placeholder="Hi, I'm interested in this product. Is it still available?"
                                        className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
                                    />
                                    <div className="mt-2 text-right text-xs text-gray-400">{interestMessage.length}/1000</div>
                                    <div className="mt-3 flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowInterestComposer(false);
                                                setInterestMessage('');
                                            }}
                                            className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleInterestConfirm}
                                            disabled={interestSubmitting}
                                            className="flex-1 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {interestSubmitting ? <Loader2 size={16} className="mx-auto animate-spin" /> : 'Send Request'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            <button
                                type="button"
                                className="mt-3 rounded-xl border border-gray-200 bg-white px-6 py-4 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
                                onClick={() => setShowReportModal(true)}
                            >
                                Report Listing
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showReportModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6" onClick={() => setShowReportModal(false)}>
                    <div className="w-full max-w-md rounded-2xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between border-b border-gray-100 p-6">
                            <h2 className="text-xl font-semibold text-gray-900">Report Listing</h2>
                            <button onClick={() => setShowReportModal(false)} className="text-gray-500 transition-colors hover:text-gray-700"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleReportSubmit}>
                            <div className="space-y-6 p-6">
                                <div>
                                    <label className="mb-3 block text-sm font-semibold text-gray-700">Reason</label>
                                    <select className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-200" value={reportReason} onChange={(e) => setReportReason(e.target.value)} required>
                                        <option value="">Select a category</option>
                                        <option value="Spam">Spam</option>
                                        <option value="Fake Product">Fake Product</option>
                                        <option value="Abuse">Abuse</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-3 block text-sm font-semibold text-gray-700">Description</label>
                                    <textarea className="w-full resize-vertical rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-200" placeholder="Describe the issue" rows="4" value={reportDescription} onChange={(e) => setReportDescription(e.target.value)} required />
                                </div>
                            </div>
                            <div className="flex gap-3 border-t border-gray-100 p-6">
                                <button type="button" className="flex-1 rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-600 transition-colors hover:bg-gray-50" onClick={() => setShowReportModal(false)}>Cancel</button>
                                <button type="submit" className="flex-1 rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-purple-700">Submit</button>
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
