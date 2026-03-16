import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, ExternalLink, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PostAd = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ title: '', price: '', location: '', description: '', visibility: 'public' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [createdSlug, setCreatedSlug] = useState(null);
    const [copied, setCopied] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const productLink = createdSlug ? `${window.location.origin}/p/${createdSlug}` : '';

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
            const res = await fetch('http://localhost:5000/api/products/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                    price: parseFloat(formData.price),
                    location: formData.location,
                    visibility: formData.visibility,
                }),
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

    if (createdSlug) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
                <Navbar />
                <div className="w-full px-6 md:px-12 lg:px-20 py-16 flex items-center justify-center">
                    <div className="max-w-lg w-full bg-white border border-slate-200 rounded-2xl p-10 shadow-2xl text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full mb-6">
                            <CheckCircle size={44} className="text-green-500" />
                        </div>
                        <h2 className="text-3xl font-extrabold mb-2" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                            Link Created Successfully!
                        </h2>
                        <p className="text-gray-500 mb-8">Your product is now live. Share the link below.</p>

                        <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-6 flex items-center gap-3">
                            <span className="flex-1 text-sm text-indigo-600 font-medium truncate text-left">{productLink}</span>
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold px-3 py-2 rounded-lg transition-all shrink-0"
                            >
                                <Copy size={14} />
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate(`/p/${createdSlug}`)}
                                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold px-4 py-3 rounded-xl hover:scale-105 hover:shadow-lg transition-all"
                            >
                                <ExternalLink size={18} /> Open Page
                            </button>
                            <button
                                onClick={() => navigate('/my-listings')}
                                className="flex-1 border-2 border-slate-300 text-slate-700 font-bold px-4 py-3 rounded-xl hover:bg-slate-50 transition-all"
                            >
                                My Listings
                            </button>
                        </div>

                        <button
                            onClick={() => { setCreatedSlug(null); setFormData({ title: '', price: '', location: '', description: '', visibility: 'public' }); }}
                            className="mt-4 text-sm text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            Create another link
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
            <Navbar />
            <div className="w-full px-6 md:px-12 lg:px-20 py-16 animate-fade-in">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-16 tracking-tight" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                        Create New Link
                    </h1>
                    <form className="bg-white border border-slate-200 rounded-2xl p-8 shadow-2xl space-y-6" onSubmit={handleSubmit}>
                        {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-200 text-sm font-medium">{error}</div>}

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Title *</label>
                            <input type="text" name="title" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="Enter product title" value={formData.title} onChange={handleChange} required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Price *</label>
                            <input type="number" name="price" min="0" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="Enter price" value={formData.price} onChange={handleChange} required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Location *</label>
                            <input type="text" name="location" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="Enter location" value={formData.location} onChange={handleChange} required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                            <textarea name="description" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-vertical" placeholder="Describe your product" rows="5" value={formData.description} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Visibility</label>
                            <select name="visibility" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white" value={formData.visibility} onChange={handleChange}>
                                <option value="public">Public</option>
                                <option value="private">Private (Link Only)</option>
                            </select>
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold px-4 py-4 rounded-xl hover:scale-105 hover:shadow-xl transition-all duration-300 mt-8 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100">
                            {loading ? 'Creating...' : 'Create Link'}
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PostAd;
