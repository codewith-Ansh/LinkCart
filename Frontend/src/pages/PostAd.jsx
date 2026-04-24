import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, ExternalLink, CheckCircle, Tag, MapPin, AlignLeft, Eye, ArrowRight, Loader2, ImagePlus } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API_BASE from '../utils/api';
import { useAppContext } from '../context/AppContext';
import { getProfileCompletionDetails, isProfileComplete } from '../utils/profileCompletion';

const inputBase = 'theme-input w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all duration-200';

const RupeeIcon = ({ size = 12, className = '' }) => (
    <span
        aria-hidden="true"
        className={`inline-flex items-center justify-center font-semibold leading-none ${className}`.trim()}
        style={{ fontSize: size }}
    >
        ₹
    </span>
);

const Label = ({ icon, children, required }) => {
    const IconComponent = icon;

    return (
        <label className="theme-label mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide">
            <IconComponent size={12} className="text-indigo-400" />
            {children}{required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
    );
};

const PostAd = () => {
    const navigate = useNavigate();
    const { currentUser, refreshCurrentUser } = useAppContext();
    const [formData, setFormData] = useState({ title: '', price: '', location: '', description: '', visibility: 'public' });
    const [image, setImage] = useState(null);
    const [error, setError]       = useState('');
    const [profileError, setProfileError] = useState('');
    const [loading, setLoading]   = useState(false);
    const [createdSlug, setCreatedSlug] = useState(null);
    const [copied, setCopied]     = useState(false);
    const profileDetails = useMemo(() => getProfileCompletionDetails(currentUser), [currentUser]);
    const profileComplete = isProfileComplete(currentUser);

    useEffect(() => {
        if (profileComplete) {
            setProfileError('');
        }
    }, [profileComplete]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFileChange = (e) => setImage(e.target.files[0] || null);
    const productLink  = createdSlug ? `${window.location.origin}/p/${createdSlug}` : '';

    const handleCopy = () => {
        navigator.clipboard.writeText(productLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setProfileError('');
        if (!formData.title || !formData.price || !formData.location) {
            setError('Title, price, and location are required.');
            return;
        }
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        const latestUser = currentUser || await refreshCurrentUser();
        if (!isProfileComplete(latestUser)) {
            setProfileError('Please complete your profile (Phone, Email, Location) before posting.');
            return;
        }
        setLoading(true);
        try {
            const payload = new FormData();
            payload.append('title', formData.title);
            payload.append('description', formData.description);
            payload.append('price', parseFloat(formData.price));
            payload.append('location', formData.location);
            payload.append('visibility', formData.visibility);
            if (image) {
                payload.append('image', image);
            }

            const res  = await fetch(`${API_BASE}/api/products/create`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: payload,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to create product');
            setCreatedSlug(data.product.slug);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    /* ── success screen ── */
    if (createdSlug) {
        return (
            <div className="theme-page min-h-screen">
                <Navbar />
                <div className="w-full px-6 md:px-12 lg:px-20 py-16 flex items-center justify-center">
                    <div className="theme-surface max-w-lg w-full rounded-2xl p-10 text-center backdrop-blur-xl animate-fade-in">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl mb-6 shadow-md">
                            <CheckCircle size={40} className="text-emerald-500" />
                        </div>
                        <h2 className="theme-text-primary mb-2 text-3xl font-extrabold" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                            Link Created!
                        </h2>
                        <p className="theme-text-secondary mb-8 text-sm">Your product is live. Share the link below.</p>

                        <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl px-4 py-3 mb-6 flex items-center gap-3">
                            <span className="flex-1 text-sm text-indigo-600 font-medium truncate text-left">{productLink}</span>
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold px-3 py-2 rounded-lg transition-all hover:shadow-md shrink-0"
                            >
                                <Copy size={13} />{copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate(`/p/${createdSlug}`)}
                                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold px-4 py-3 rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-200 transition-all duration-200"
                            >
                                <ExternalLink size={16} />Open Page
                            </button>
                            <button
                                onClick={() => navigate('/my-listings')}
                            className="theme-btn-secondary flex-1 rounded-xl border border-slate-200 px-4 py-3 font-bold transition-all duration-200 hover:bg-slate-50"
                            >
                                My Listings
                            </button>
                        </div>

                        <button
                            onClick={() => { setCreatedSlug(null); setFormData({ title: '', price: '', location: '', description: '', visibility: 'public' }); setImage(null); }}
                            className="theme-text-muted mt-5 text-xs transition-colors hover:text-indigo-500"
                        >
                            + Create another link
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    /* ── form screen ── */
    return (
        <div className="theme-page min-h-screen">

            {/* decorative blobs */}
            <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
                <div style={{ width: 500, height: 500, top: '-140px', left: '-140px', background: 'radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)', position: 'absolute', borderRadius: '50%' }} />
                <div style={{ width: 420, height: 420, bottom: '-100px', right: '-80px', background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)', position: 'absolute', borderRadius: '50%' }} />
            </div>

            <Navbar />
            <div className="w-full px-6 md:px-12 lg:px-20 py-16 animate-fade-in">
                <div className="max-w-3xl mx-auto">

                    <h1 className="theme-text-primary mb-2 text-4xl font-extrabold tracking-tight md:text-5xl" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                        Create New Link
                    </h1>
                    <p className="theme-text-secondary mb-10 text-sm">Fill in the details below to publish your product listing.</p>

                    <div className="theme-surface rounded-2xl p-8 backdrop-blur-xl">

                        {error && (
                            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-6 animate-fade-in">
                                <span className="mt-0.5 shrink-0 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] font-bold">!</span>
                                {error}
                            </div>
                        )}

                        {profileError && (
                            <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800 animate-fade-in">
                                <p className="font-semibold">{profileError}</p>
                                {profileDetails.missingFields.length > 0 && (
                                    <p className="mt-2 text-xs text-amber-700">
                                        Missing: {profileDetails.missingFields.map((field) => {
                                            if (field === 'phoneNumber') return 'Phone';
                                            if (field === 'location') return 'Location';
                                            return 'Email';
                                        }).join(', ')}
                                    </p>
                                )}
                            </div>
                        )}

                        {!profileComplete && (
                            <div className="theme-subtle-panel mb-6 rounded-xl px-4 py-4 text-sm">
                                <p className="theme-text-primary font-semibold">Complete your profile to increase trust.</p>
                                <p className="theme-text-secondary mt-1 text-xs">Profile completion: {profileDetails.completionPercentage}%</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <Label icon={Tag} required>Title</Label>
                                <input type="text" name="title" className={inputBase} placeholder="Enter product title" value={formData.title} onChange={handleChange} required />
                            </div>
                            <div>
                                <Label icon={RupeeIcon} required>Price</Label>
                                <input type="number" name="price" min="0" className={inputBase} placeholder="Enter price" value={formData.price} onChange={handleChange} required />
                            </div>
                            <div>
                                <Label icon={MapPin} required>Location</Label>
                                <input type="text" name="location" className={inputBase} placeholder="Enter location" value={formData.location} onChange={handleChange} required />
                            </div>
                            <div>
                                <Label icon={AlignLeft}>Description</Label>
                                <textarea name="description" className={`${inputBase} resize-vertical`} placeholder="Describe your product" rows={5} value={formData.description} onChange={handleChange} />
                            </div>
                            <div>
                                <Label icon={Eye}>Visibility</Label>
                                <select name="visibility" className={inputBase} value={formData.visibility} onChange={handleChange}>
                                    <option value="public">Public</option>
                                    <option value="private">Private (Link Only)</option>
                                </select>
                            </div>
                            <div>
                                <Label icon={ImagePlus}>Image</Label>
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    className={`${inputBase} file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-indigo-600 hover:file:bg-indigo-100`}
                                    onChange={handleFileChange}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm mt-2
                                    bg-gradient-to-r from-indigo-500 to-purple-600 text-white
                                    hover:shadow-xl hover:shadow-indigo-200 hover:-translate-y-0.5 active:translate-y-0
                                    transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                                    disabled:hover:shadow-none disabled:hover:translate-y-0"
                            >
                                {loading
                                    ? <><Loader2 size={16} className="animate-spin" />Creating…</>
                                    : <><span>Create Link</span><ArrowRight size={16} /></>
                                }
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PostAd;
