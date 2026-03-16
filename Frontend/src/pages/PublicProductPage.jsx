import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, ImageOff, User, Copy, ExternalLink } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PublicProductPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:5000/api/products/${slug}`)
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
                            {product.image_url ? (
                                <img src={product.image_url} alt={product.title} className="w-full h-[420px] object-cover" />
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
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PublicProductPage;
