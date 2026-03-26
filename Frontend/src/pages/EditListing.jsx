import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tag, DollarSign, MapPin, AlignLeft, ArrowRight, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const inputBase = 'w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all duration-200';

const Label = ({ icon: Icon, children }) => (
    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
        <Icon size={12} className="text-indigo-400" />{children}
    </label>
);

const EditListing = () => {
    const { id }     = useParams();
    const navigate   = useNavigate();

    const mockListings = {
        1: { title: 'Vintage Leather Jacket',  price: 299,  location: 'New York, NY',    description: 'Beautiful vintage leather jacket in excellent condition.' },
        2: { title: 'iPhone 13 Pro',           price: 799,  location: 'Los Angeles, CA', description: 'Barely used iPhone 13 Pro with all accessories.' },
        3: { title: 'Gaming Laptop',           price: 1299, location: 'Chicago, IL',     description: 'High-performance gaming laptop with RTX graphics.' },
        4: { title: 'Wireless Headphones',     price: 149,  location: 'Houston, TX',     description: 'Premium wireless headphones with noise cancellation.' },
    };

    const [formData, setFormData] = useState({ title: '', price: '', location: '', description: '' });

    useEffect(() => {
        const saved   = JSON.parse(localStorage.getItem('myListings') || '[]');
        const product = saved.find(p => p.id === parseInt(id));
        if (product) {
            setFormData({ title: product.title || '', price: product.price || '', location: product.location || '', description: product.description || '' });
        } else if (mockListings[id]) {
            setFormData(mockListings[id]);
        }
    }, [id]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        const saved   = JSON.parse(localStorage.getItem('myListings') || '[]');
        const updated = saved.map(l => l.id === parseInt(id)
            ? { ...l, title: formData.title, price: parseFloat(formData.price), location: formData.location, description: formData.description }
            : l
        );
        localStorage.setItem('myListings', JSON.stringify(updated));
        navigate('/my-listings');
    };

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
                        Edit Listing
                    </h1>
                    <p className="text-slate-500 text-sm mb-10">Update your listing details below.</p>

                    <div className="bg-white/80 backdrop-blur-xl border border-white rounded-2xl p-8 shadow-[0_8px_40px_rgba(99,102,241,0.10)]">
                        <form onSubmit={handleSubmit} className="space-y-5">

                            <div>
                                <Label icon={Tag}>Title</Label>
                                <input type="text" name="title" className={inputBase} value={formData.title} onChange={handleChange} placeholder="Enter product title" required />
                            </div>
                            <div>
                                <Label icon={DollarSign}>Price</Label>
                                <input type="number" name="price" className={inputBase} value={formData.price} onChange={handleChange} placeholder="Enter price" required />
                            </div>
                            <div>
                                <Label icon={MapPin}>Location</Label>
                                <input type="text" name="location" className={inputBase} value={formData.location} onChange={handleChange} placeholder="Enter location" required />
                            </div>
                            <div>
                                <Label icon={AlignLeft}>Description</Label>
                                <textarea name="description" className={`${inputBase} resize-vertical`} rows={5} value={formData.description} onChange={handleChange} placeholder="Enter product description" required />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => navigate('/my-listings')}
                                    className="flex-1 flex items-center justify-center gap-2 border border-slate-200 text-slate-600 font-semibold px-6 py-3 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
                                >
                                    <X size={15} />Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold px-6 py-3 rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-200 active:translate-y-0 transition-all duration-200"
                                >
                                    <span>Update Listing</span><ArrowRight size={15} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default EditListing;
