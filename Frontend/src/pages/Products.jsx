import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImageOff, MapPin, Calendar } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API_BASE from '../utils/api';
import { getProductImageSrc } from '../utils/productImage';
import UserAvatar from '../components/UserAvatar';

const ImagePlaceholder = () => (
    <div className="w-full h-48 bg-gradient-to-br from-slate-100 to-indigo-50 flex flex-col items-center justify-center gap-2 text-slate-400">
        <ImageOff size={32} />
        <span className="text-xs font-medium">No Image Available</span>
    </div>
);

const Products = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch(`${API_BASE}/api/products/public`)
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) setProducts(data);
                else setError(data.error || 'Failed to load products');
            })
            .catch(() => setError('Could not connect to server'))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
            <Navbar />
            <div className="w-full px-6 md:px-12 lg:px-20 py-16 animate-fade-in">
                <h1 className="text-5xl md:text-6xl font-extrabold mb-16 tracking-tight" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                    All Products
                </h1>

                {loading && <p className="text-center text-gray-500 py-20">Loading...</p>}
                {error && <p className="text-center text-red-500 py-20">{error}</p>}
                {!loading && !error && products.length === 0 && (
                    <p className="text-center text-gray-500 py-20">No public products yet.</p>
                )}

                {!loading && !error && products.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => {
                            const imageSrc = getProductImageSrc(product);
                            return (
                            <div
                                key={product.id}
                                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col"
                                onClick={() => navigate(`/p/${product.slug}`)}
                            >
                                <div className="overflow-hidden">
                                    {imageSrc ? (
                                        <img src={imageSrc} alt={product.title} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <ImagePlaceholder />
                                    )}
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                    <h3 className="font-bold text-lg mb-1 truncate">{product.title}</h3>
                                    <p className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                        ${product.price}
                                    </p>
                                    {product.location && (
                                        <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
                                            <MapPin size={13} />
                                            <span className="truncate">{product.location}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
                                        <Calendar size={12} />
                                        <span>{new Date(product.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                                        <button
                                            className="min-w-0 flex items-center gap-2 text-left"
                                            onClick={(e) => { e.stopPropagation(); navigate(`/user/${product.user_id}`); }}
                                        >
                                            <UserAvatar user={product} size="sm" className="w-9 h-9 text-xs shadow-md" />
                                            <span className="truncate text-sm font-semibold text-indigo-700 hover:text-indigo-800 transition-colors">
                                                {product.seller_name || product.user_id}
                                            </span>
                                        </button>
                                        <span className="text-xs bg-indigo-50 text-indigo-600 font-bold px-2 py-1 rounded-lg">Public</span>
                                    </div>
                                </div>
                            </div>
                            );
                        })}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Products;
