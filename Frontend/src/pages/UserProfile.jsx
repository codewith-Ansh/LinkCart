import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, ImageOff, Package, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API_BASE from '../utils/api';
import { getProductImageSrc } from '../utils/productImage';
import UserAvatar from '../components/UserAvatar';
import { formatINR } from '../utils/currency';

const Blobs  = () => (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div style={{ width: 500, height: 500, top: '-140px', left: '-140px', background: 'radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)', position: 'absolute', borderRadius: '50%' }} />
        <div style={{ width: 420, height: 420, bottom: '-100px', right: '-80px',  background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)', position: 'absolute', borderRadius: '50%' }} />
    </div>
);

const ImagePlaceholder = () => (
    <div className="theme-surface-muted w-full h-44 flex flex-col items-center justify-center gap-2 theme-text-muted">
        <ImageOff size={28} />
        <span className="text-xs font-medium">No Image Available</span>
    </div>
);

const UserProfile = () => {
    const { custom_id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        fetch(`${API_BASE}/api/users/${custom_id}`)
            .then((res) => {
                if (res.status === 404) { setNotFound(true); return null; }
                return res.json();
            })
            .then((data) => {
                if (data) {
                    setUser(data.user);
                    setProducts(data.products);
                }
            })
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
    }, [custom_id]);

    if (loading) return (
        <div className="theme-page min-h-screen">
            <Blobs />
            <Navbar />
            <div className="min-h-[calc(100vh-20rem)] flex items-center justify-center">
                <Loader2 size={32} className="animate-spin text-indigo-400" />
            </div>
            <Footer />
        </div>
    );

    if (notFound || !user) return (
        <div className="theme-page min-h-screen">
            <Blobs />
            <Navbar />
            <div className="w-full px-6 md:px-12 lg:px-20 py-32 text-center">
                <h2 className="theme-text-primary text-3xl font-bold mb-4">User not found</h2>
                <button
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold px-8 py-4 rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-200 transition-all duration-200"
                    onClick={() => navigate('/products')}
                >
                    Browse Products
                </button>
            </div>
            <Footer />
        </div>
    );

    const location = [user.city, user.state].filter(Boolean).join(', ');

    return (
        <div className="theme-page min-h-screen">
            <Blobs />
            <Navbar />
            <div className="w-full px-6 md:px-12 lg:px-20 py-16 animate-fade-in">

                {/* Profile card */}
                <div className="theme-surface max-w-2xl mx-auto backdrop-blur-xl rounded-2xl p-8 mb-16 flex items-center gap-6">
                    <UserAvatar user={user} size="md" className="w-20 h-20 text-2xl shrink-0" />
                    <div>
                        <h1 className="text-3xl font-extrabold mb-1" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                            {user.full_name}
                        </h1>
                        <p className="text-sm text-indigo-500 font-semibold mb-2">{user.custom_id}</p>
                        {user.tagline && <p className="theme-text-secondary text-sm mb-2">{user.tagline}</p>}
                        {location && (
                            <div className="theme-text-secondary flex items-center gap-1.5 text-sm">
                                <MapPin size={14} />
                                <span>{location}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Products */}
                <h2 className="theme-text-primary text-3xl font-extrabold mb-8" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                    Listings by {user.full_name}
                </h2>

                {products.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6" style={{ backgroundColor: 'var(--bg-hover)' }}>
                            <Package size={40} className="text-indigo-400" />
                        </div>
                        <p className="theme-text-secondary text-lg">No public listings yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => {
                            const imageSrc = getProductImageSrc(product);
                            return (
                            <div
                                key={product.id}
                                className="theme-surface group rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)]"
                                onClick={() => navigate(`/p/${product.slug}`)}
                            >
                                <div className="overflow-hidden">
                                    {imageSrc ? (
                                        <img src={imageSrc} alt={product.title} className="w-full h-44 object-cover group-hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <ImagePlaceholder />
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="theme-text-primary font-bold text-base mb-1 truncate">{product.title}</h3>
                                    <p className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
                                        {formatINR(product.price)}
                                    </p>
                                    {product.location && (
                                        <div className="theme-text-muted flex items-center gap-1 text-xs">
                                            <MapPin size={11} />
                                            <span className="truncate">{product.location}</span>
                                        </div>
                                    )}
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

export default UserProfile;
