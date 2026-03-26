import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, ExternalLink, CheckCircle, Tag, DollarSign, MapPin, AlignLeft, Eye, ArrowRight, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API_BASE from '../utils/api';

const inputBase = 'w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all duration-200';

const Label = ({ icon: Icon, children, required }) => (
    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
        <Icon size={12} className="text-indigo-400" />
        {children}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
);

const PostAd = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ title: '', price: '', location: '', description: '', visibility: 'public' });
    const [error, setError]       = useState('');
    const [loading, setLoading]   = useState(false);
    const [createdSlug, setCreatedSlug] = useState(null);
    const [copied, setCopied]     = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const productLink  = createdSlug ? `${window.location.origin}/p/${createdSlug}` : '';

    const handleCopy = () => {
        navigator.clipboard.writeText(productLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!formData.title || !formData.price || !formData.location) {
            setError('Title, price, and location are required.');
            return;
        }
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        setLoading(true);
        try {
            const res  = await fetch(`${API_BASE}/api/products/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ title: formData.title, description: formData.description, price: parseFloat(formData.price), location: formData.location, visibility: formData.visibility }),
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
            <div style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #fdf4ff 100%)' }} className="min-h-screen">
                <Navbar />
                <div className="w-full px-6 md:px-12 lg:px-20 py-16 flex items-center justify-center">
                    <div className="max-w-lg w-full bg-white/80 backdrop-blur-xl border border-white rounded-2xl p-10 shadow-[0_8px_40px_rgba(99,102,241,0.12)] text-center animate-fade-in">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl mb-6 shadow-md">
                            <CheckCircle size={40} className="text-emerald-500" />
                        </div>
                        <h2 className="text-3xl font-extrabold mb-2 text-slate-800" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                            Link Created!
                        </h2>
                        <p className="text-slate-500 text-sm mb-8">Your product is live. Share the link below.</p>

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
                                className="flex-1 border border-slate-200 text-slate-700 font-bold px-4 py-3 rounded-xl hover:bg-slate-50 transition-all duration-200"
                            >
                                My Listings
                            </button>
                        </div>

                        <button
                            onClick={() => { setCreatedSlug(null); setFormData({ title: '', price: '', location: '', description: '', visibility: 'public' }); }}
                            className="mt-5 text-xs text-slate-400 hover:text-indigo-500 transition-colors"
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
        <div style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #fdf4ff 100%)' }} className="min-h-screen">

            {/* decorative blobs */}
            <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
                <div style={{ width: 500, height: 500, top: '-140px', left: '-140px', background: 'radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)', position: 'absolute', borderRadius: '50%' }} />
                <div style={{ width: 420, height: 420, bottom: '-100px', right: '-80px', background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)', position: 'absolute', borderRadius: '50%' }} />
            </div>

            <Navbar />
            <div className="w-full px-6 md:px-12 lg:px-20 py-16 animate-fade-in">
                <div className="max-w-3xl mx-auto">

                    <h1 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight text-slate-800" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                        Create New Link
                    </h1>
                    <p className="text-slate-500 text-sm mb-10">Fill in the details below to publish your product listing.</p>

                    <div className="bg-white/80 backdrop-blur-xl border border-white rounded-2xl p-8 shadow-[0_8px_40px_rgba(99,102,241,0.10)]">

                        {error && (
                            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-6 animate-fade-in">
                                <span className="mt-0.5 shrink-0 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] font-bold">!</span>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <Label icon={Tag} required>Title</Label>
                                <input type="text" name="title" className={inputBase} placeholder="Enter product title" value={formData.title} onChange={handleChange} required />
                            </div>
                            <div>
                                <Label icon={DollarSign} required>Price</Label>
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
