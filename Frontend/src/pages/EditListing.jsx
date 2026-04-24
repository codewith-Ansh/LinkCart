import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tag, MapPin, AlignLeft, ArrowRight, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import { useToast } from '../context/ToastContext';
import API_BASE from '../utils/api';

const inputBase = 'theme-input w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all duration-200';

const RupeeIcon = ({ size = 12, className = '' }) => (
    <span aria-hidden="true" className={`inline-flex items-center justify-center font-semibold leading-none ${className}`.trim()} style={{ fontSize: size }}>₹</span>
);

const Label = ({ icon: Icon, children }) => (
    <label className="theme-label mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide">
        <Icon size={12} className="text-indigo-400" />{children}
    </label>
);

const EditListing = () => {
    const { id }     = useParams();
    const navigate   = useNavigate();
    const toast      = useToast();

    const [formData, setFormData] = useState({ title: '', price: '', location: '', description: '' });
    const [loading, setLoading]   = useState(true);
    const [saving, setSaving]     = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        fetch(`${API_BASE}/api/products/my`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const product = data.find(p => String(p.id) === String(id));
                    if (product) {
                        setFormData({
                            title: product.title || '',
                            price: product.price || '',
                            location: product.location || '',
                            description: product.description || ''
                        });
                    } else {
                        toast.error('Listing not found or you are unauthorized.');
                        navigate('/my-listings');
                    }
                }
            })
            .catch(() => toast.error('Failed to connect to server'))
            .finally(() => setLoading(false));
    }, [id, navigate, toast]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        setSaving(true);
        
        try {
            const res = await fetch(`${API_BASE}/api/products/${id}/edit`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            
            if (res.ok) {
                toast.success('Listing updated successfully!');
                navigate('/my-listings');
            } else {
                toast.error(data.error || 'Failed to update listing.');
            }
        } catch(err) {
            toast.error('Server error updating listing.');
        } finally {
            setSaving(false);
        }
    };

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
                        Edit Listing
                    </h1>
                    <p className="theme-text-secondary mb-10 text-sm">Update your listing details below.</p>

                    <div className="theme-surface rounded-2xl p-8 backdrop-blur-xl">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <Label icon={Tag}>Title</Label>
                                <input type="text" name="title" className={inputBase} value={formData.title} onChange={handleChange} placeholder="Enter product title" required />
                            </div>
                            <div>
                                <Label icon={RupeeIcon}>Price</Label>
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
                                    className="theme-btn-secondary min-w-0 flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-6 py-3 font-semibold transition-all duration-200 hover:bg-slate-50 hover:border-slate-300"
                                >
                                    <X size={15} />Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || saving}
                                    className="flex-[2] flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold px-6 py-3 rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-200 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    <span>{saving ? 'Updating...' : 'Update Listing'}</span>
                                    {!saving && <ArrowRight size={15} />}
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
