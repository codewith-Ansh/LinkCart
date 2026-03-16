import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, User, ImageOff, Package } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ImagePlaceholder = () => (
    <div className="w-full h-44 bg-gradient-to-br from-slate-100 to-indigo-50 flex flex-col items-center justify-center gap-2 text-slate-400">
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
        fetch(`http://localhost:5000/api/users/${custom_id}`)
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
            <Navbar />
            <p className="text-center text-gray-500 py-32">Loading...</p>
            <Footer />
        </div>
    );

    if (notFound || !user) return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
            <Navbar />
            <div className="w-full px-6 md:px-12 lg:px-20 py-32 text-center">
                <h2 className="text-3xl font-bold mb-4">User not found</h2>
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

    const location = [user.city, user.state].filter(Boolean).join(', ');

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
            <Navbar />
            <div className="w-full px-6 md:px-12 lg:px-20 py-16 animate-fade-in">

                {/* Profile card */}
                <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl p-8 shadow-xl mb-16 flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shrink-0">
                        <User size={40} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold mb-1" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                            {user.full_name}
                        </h1>
                        <p className="text-sm text-indigo-500 font-semibold mb-2">{user.custom_id}</p>
                        {location && (
                            <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                                <MapPin size={14} />
                                <span>{location}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Products */}
                <h2 className="text-3xl font-extrabold mb-8" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                    Listings by {user.full_name}
                </h2>

                {products.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-50 rounded-full mb-6">
                            <Package size={40} className="text-indigo-400" />
                        </div>
                        <p className="text-gray-500 text-lg">No public listings yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                                onClick={() => navigate(`/p/${product.slug}`)}
                            >
                                <div className="overflow-hidden">
                                    {product.image_url ? (
                                        <img src={product.image_url} alt={product.title} className="w-full h-44 object-cover group-hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <ImagePlaceholder />
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-base mb-1 truncate">{product.title}</h3>
                                    <p className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
                                        ${product.price}
                                    </p>
                                    {product.location && (
                                        <div className="flex items-center gap-1 text-gray-400 text-xs">
                                            <MapPin size={11} />
                                            <span className="truncate">{product.location}</span>
                                        </div>
                                    )}
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

export default UserProfile;
