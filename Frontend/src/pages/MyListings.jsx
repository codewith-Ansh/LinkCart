import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ImageOff, MapPin, Calendar, Copy, Loader2, Trash2, Edit2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API_BASE from '../utils/api';
import { getProductImageSrc } from '../utils/productImage';
import ProductStatusBadge from '../components/ProductStatusBadge';
import { useToast } from '../context/ToastContext';
import { formatINR } from '../utils/currency';

const Blobs  = () => (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div style={{ width: 500, height: 500, top: '-140px', left: '-140px', background: 'radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)', position: 'absolute', borderRadius: '50%' }} />
        <div style={{ width: 420, height: 420, bottom: '-100px', right: '-80px',  background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)', position: 'absolute', borderRadius: '50%' }} />
    </div>
);

const ImagePlaceholder = () => (
    <div className="theme-subtle-panel flex h-48 w-full flex-col items-center justify-center gap-2 theme-text-muted">
        <ImageOff size={32} />
        <span className="text-xs font-medium">No Image Available</span>
    </div>
);

const MyListings = () => {
    const navigate = useNavigate();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [copiedId, setCopiedId] = useState(null);
    const [markingSoldId, setMarkingSoldId] = useState('');
    const [togglingVisibilityId, setTogglingVisibilityId] = useState('');
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', message: '', confirmText: 'Confirm', type: 'danger', onConfirm: null });
    const toast = useToast();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }

        fetch(`${API_BASE}/api/products/my`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) setListings(data);
                else setError(data.error || 'Failed to load listings');
            })
            .catch(() => setError('Could not connect to server'))
            .finally(() => setLoading(false));
    }, [navigate]);

    const handleCopy = (e, slug) => {
        e.stopPropagation();
        navigator.clipboard.writeText(`${window.location.origin}/p/${slug}`);
        setCopiedId(slug);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleMarkSold = async (event, productId) => {
        event.stopPropagation();
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        setMarkingSoldId(productId);

        try {
            const response = await fetch(`${API_BASE}/api/products/${productId}/sold`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to mark product as sold.');
            }

            setListings((prev) =>
                prev.map((listing) =>
                    listing.id === productId ? { ...listing, status: 'sold' } : listing
                )
            );
            toast.success('Product marked as sold.');
        } catch (fetchError) {
            toast.error(fetchError.message || 'Failed to mark product as sold.');
        } finally {
            setMarkingSoldId('');
        }
    };

    const handleToggleVisibility = async (event, productId) => {
        event.stopPropagation();
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        setTogglingVisibilityId(productId);

        try {
            const response = await fetch(`${API_BASE}/api/products/${productId}/visibility`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to change visibility.');
            }

            setListings((prev) =>
                prev.map((listing) =>
                    listing.id === productId ? { ...listing, visibility: data.newVisibility } : listing
                )
            );
            toast.success(`Product is now ${data.newVisibility}.`);
        } catch (fetchError) {
            toast.error(fetchError.message || 'Failed to change visibility.');
        } finally {
            setTogglingVisibilityId('');
        }
    };

    const handleDeleteProduct = (event, productId) => {
        event.stopPropagation();
        setConfirmDialog({
            isOpen: true,
            title: 'Delete Product',
            message: 'Are you sure you want to permanently delete this product? This action cannot be undone.',
            confirmText: 'Delete Product',
            type: 'danger',
            onConfirm: async () => {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }
                try {
                    const res = await fetch(`${API_BASE}/api/products/${productId}`, {
                        method: 'DELETE',
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    
                    if (res.ok) {
                        setListings((prev) => prev.filter((p) => p.id !== productId));
                        toast.success("Product deleted successfully.");
                    } else {
                        const err = await res.json();
                        toast.error(err.error || "Failed to delete product.");
                    }
                } catch (e) {
                    toast.error("Error connecting to server.");
                }
            }
        });
    };

    return (
        <div className="theme-page min-h-screen">
            <Blobs />
            <Navbar />
            <div className="w-full px-6 md:px-12 lg:px-20 py-16 animate-fade-in">
                <div className="flex items-center justify-between mb-16">
                    <h1 className="theme-text-primary text-5xl font-extrabold tracking-tight md:text-6xl" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                        My Listings
                    </h1>
                    <button
                        onClick={() => navigate('/post-ad')}
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold px-6 py-3 rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-200 active:translate-y-0 transition-all duration-200"
                    >
                        + Create Link
                    </button>
                </div>

                {loading && (
                    <div className="flex justify-center py-20">
                        <Loader2 size={32} className="animate-spin text-indigo-400" />
                    </div>
                )}
                {error && <p className="text-center text-red-500 py-20">{error}</p>}

                {!loading && !error && listings.length === 0 && (
                    <div className="text-center py-32">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full mb-8">
                            <Package size={48} className="text-indigo-600" />
                        </div>
                        <h2 className="theme-text-primary mb-4 text-3xl font-bold md:text-4xl" style={{ fontFamily: 'Clash Display, sans-serif' }}>No Listings Yet</h2>
                        <p className="theme-text-secondary mb-10 text-lg">You haven't created any products.</p>
                        <button
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold px-10 py-4 rounded-xl hover:scale-105 hover:shadow-xl transition-all duration-300"
                            onClick={() => navigate('/post-ad')}
                        >
                            Create Your First Link
                        </button>
                    </div>
                )}

                {!loading && !error && listings.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {listings.map((listing) => {
                            const imageSrc = getProductImageSrc(listing);
                            return (
                            <div
                                key={listing.id}
                                className="theme-surface flex cursor-pointer flex-col overflow-hidden rounded-2xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)]"
                                onClick={() => navigate(`/p/${listing.slug}`)}
                            >
                                <div className="relative">
                                    {imageSrc ? (
                                        <img src={imageSrc} alt={listing.title} className="w-full h-48 object-cover" />
                                    ) : (
                                        <ImagePlaceholder />
                                    )}
                                    <div className="absolute right-3 top-3 flex gap-2">
                                        <button
                                            onClick={(e) => handleToggleVisibility(e, listing.id)}
                                            disabled={togglingVisibilityId === listing.id}
                                            className={`px-2.5 py-1 rounded-lg text-xs font-bold text-white shadow hover:scale-105 active:scale-95 transition-all outline-none ${togglingVisibilityId === listing.id ? 'opacity-70 cursor-not-allowed' : ''} ${listing.visibility === 'private' ? 'bg-slate-600' : 'bg-gradient-to-r from-indigo-500 to-purple-600'}`}
                                            title="Click to toggle visibility"
                                        >
                                            {togglingVisibilityId === listing.id ? (
                                                <Loader2 size={14} className="animate-spin inline mr-1" />
                                            ) : null}
                                            {listing.visibility === 'private' ? 'Private' : 'Public'}
                                        </button>
                                        <ProductStatusBadge status={listing.status} className="bg-white/95" />
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                    <h3 className="theme-text-primary mb-1 truncate text-lg font-bold">{listing.title}</h3>
                                    <p className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                        {formatINR(listing.price)}
                                    </p>
                                    {listing.location && (
                                        <div className="theme-text-secondary mb-1 flex items-center gap-1 text-sm">
                                            <MapPin size={13} />
                                            <span className="truncate">{listing.location}</span>
                                        </div>
                                    )}
                                    <div className="theme-text-muted mb-4 flex items-center gap-1 text-xs">
                                        <Calendar size={12} />
                                        <span>{new Date(listing.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <button
                                        onClick={(e) => handleCopy(e, listing.slug)}
                                        className="theme-btn-secondary mt-auto flex items-center justify-center gap-2 rounded-xl border border-indigo-300 px-3 py-2 text-sm font-semibold text-indigo-600 transition-all hover:bg-indigo-50"
                                    >
                                        <Copy size={14} />
                                        {copiedId === listing.slug ? 'Copied!' : 'Copy Link'}
                                    </button>
                                    <div className="flex gap-2 w-full mt-3">
                                        {listing.status !== 'sold' && (
                                            <button
                                                onClick={(event) => handleMarkSold(event, listing.id)}
                                                disabled={markingSoldId === listing.id}
                                                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {markingSoldId === listing.id ? <Loader2 size={14} className="animate-spin" /> : 'Mark as Sold'}
                                            </button>
                                        )}
                                        <button
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                navigate(`/edit-listing/${listing.id}`);
                                            }}
                                            className={`theme-btn-secondary flex items-center justify-center rounded-xl border-2 border-indigo-100 p-2 text-indigo-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600 ${listing.status === 'sold' ? 'flex-1' : ''}`}
                                            title="Edit product"
                                        >
                                            <Edit2 size={18} />
                                            {listing.status === 'sold' && <span className="ml-2 text-sm font-semibold">Edit</span>}
                                        </button>
                                        <button
                                            onClick={(event) => handleDeleteProduct(event, listing.id)}
                                            className={`theme-btn-danger flex items-center justify-center rounded-xl border-2 border-red-100 p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 ${listing.status === 'sold' ? 'flex-1' : ''}`}
                                            title="Delete product"
                                        >
                                            <Trash2 size={18} />
                                            {listing.status === 'sold' && <span className="ml-2 text-sm font-semibold">Delete</span>}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            );
                        })}
                    </div>
                )}
            </div>
            <Footer />

            {/* Confirmation Dialog Modal */}
            {confirmDialog.isOpen && (
                <div className="theme-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="theme-surface w-full max-w-sm scale-100 overflow-hidden rounded-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-6 text-center">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                                <Trash2 className="h-8 w-8 text-red-600" aria-hidden="true" />
                            </div>
                            <h3 className="theme-text-primary mb-2 text-xl font-bold">{confirmDialog.title}</h3>
                            <p className="theme-text-secondary mb-8 text-sm">{confirmDialog.message}</p>
                            
                            <div className="flex flex-col gap-3">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-xl border border-transparent bg-red-600 px-4 py-3 text-base font-bold text-white shadow-sm hover:bg-red-700 focus:outline-none transition-colors"
                                    onClick={() => {
                                        if (confirmDialog.onConfirm) confirmDialog.onConfirm();
                                        setConfirmDialog({ ...confirmDialog, isOpen: false });
                                    }}
                                >
                                    {confirmDialog.confirmText}
                                </button>
                                <button
                                    type="button"
                                    className="theme-btn-secondary mt-2 inline-flex w-full justify-center rounded-xl px-4 py-3 text-base font-bold transition-colors"
                                    onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyListings;
