import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ImageOff, MapPin, Calendar, Copy } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ImagePlaceholder = () => (
    <div className="w-full h-48 bg-gradient-to-br from-slate-100 to-indigo-50 flex flex-col items-center justify-center gap-2 text-slate-400">
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

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }

        fetch('http://localhost:5000/api/products/my', {
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
            <Navbar />
            <div className="w-full px-6 md:px-12 lg:px-20 py-16 animate-fade-in">
                <div className="flex items-center justify-between mb-16">
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                        My Listings
                    </h1>
                    <button
                        onClick={() => navigate('/post-ad')}
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold px-6 py-3 rounded-xl hover:scale-105 hover:shadow-lg transition-all"
                    >
                        + Create Link
                    </button>
                </div>

                {loading && <p className="text-center text-gray-500 py-20">Loading...</p>}
                {error && <p className="text-center text-red-500 py-20">{error}</p>}

                {!loading && !error && listings.length === 0 && (
                    <div className="text-center py-32">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full mb-8">
                            <Package size={48} className="text-indigo-600" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'Clash Display, sans-serif' }}>No Listings Yet</h2>
                        <p className="text-gray-600 text-lg mb-10">You haven't created any products.</p>
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
                        {listings.map((listing) => (
                            <div
                                key={listing.id}
                                className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer flex flex-col"
                                onClick={() => navigate(`/p/${listing.slug}`)}
                            >
                                <div className="relative">
                                    {listing.image_url ? (
                                        <img src={listing.image_url} alt={listing.title} className="w-full h-48 object-cover" />
                                    ) : (
                                        <ImagePlaceholder />
                                    )}
                                    <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-bold text-white shadow ${listing.visibility === 'private' ? 'bg-slate-600' : 'bg-gradient-to-r from-indigo-500 to-purple-600'}`}>
                                        {listing.visibility === 'private' ? 'Private' : 'Public'}
                                    </span>
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                    <h3 className="font-bold text-lg mb-1 truncate">{listing.title}</h3>
                                    <p className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                        ${listing.price}
                                    </p>
                                    {listing.location && (
                                        <div className="flex items-center gap-1 text-gray-500 text-sm mb-1">
                                            <MapPin size={13} />
                                            <span className="truncate">{listing.location}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1 text-gray-400 text-xs mb-4">
                                        <Calendar size={12} />
                                        <span>{new Date(listing.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <button
                                        onClick={(e) => handleCopy(e, listing.slug)}
                                        className="mt-auto flex items-center justify-center gap-2 border border-indigo-300 text-indigo-600 text-sm font-semibold px-3 py-2 rounded-xl hover:bg-indigo-50 transition-all"
                                    >
                                        <Copy size={14} />
                                        {copiedId === listing.slug ? 'Copied!' : 'Copy Link'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default MyListings;
