import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PostAd = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ title: '', price: '', location: '', description: '', image: null });
    const [imagePreview, setImagePreview] = useState(null);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setFormData({ ...formData, image: null });
        setImagePreview(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.price || !formData.location) {
            alert('Please fill in all required fields');
            return;
        }
        const newListing = {
            id: Date.now(),
            title: formData.title,
            price: parseFloat(formData.price),
            location: formData.location,
            description: formData.description,
            status: 'Active',
            image: imagePreview || 'https://via.placeholder.com/400x300/6366f1/ffffff?text=Product'
        };
        const existingListings = JSON.parse(localStorage.getItem('myListings') || '[]');
        existingListings.push(newListing);
        localStorage.setItem('myListings', JSON.stringify(existingListings));
        navigate('/my-listings');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
            <Navbar />
            <div className="w-full px-6 md:px-12 lg:px-20 py-16 animate-fade-in">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-16 tracking-tight" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                        Create New Link
                    </h1>
                    <form className="bg-white border border-slate-200 rounded-2xl p-8 shadow-2xl space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Title</label>
                            <input type="text" name="title" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="Enter product title" value={formData.title} onChange={handleChange} required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Price</label>
                            <input type="number" name="price" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="Enter price" value={formData.price} onChange={handleChange} required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Location</label>
                            <input type="text" name="location" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="Enter location" value={formData.location} onChange={handleChange} required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                            <textarea name="description" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-vertical" placeholder="Describe your product" rows="5" value={formData.description} onChange={handleChange} required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Product Image</label>
                            {!imagePreview ? (
                                <label className="border-2 border-dashed border-indigo-300 rounded-xl p-12 text-center bg-gradient-to-br from-indigo-50 to-purple-50 cursor-pointer hover:border-indigo-500 hover:bg-indigo-100 transition-all block">
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                    <Upload size={40} className="mx-auto mb-4 text-indigo-500" />
                                    <p className="font-bold text-slate-700 mb-1">Click to upload image</p>
                                    <span className="text-sm text-gray-500">or drag and drop</span>
                                </label>
                            ) : (
                                <div className="relative rounded-xl overflow-hidden">
                                    <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover rounded-xl" />
                                    <button type="button" className="absolute top-3 right-3 bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-red-600 hover:scale-110 transition-all shadow-lg" onClick={removeImage}>
                                        <X size={20} />
                                    </button>
                                </div>
                            )}
                        </div>
                        <button type="submit" className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold px-4 py-4 rounded-xl hover:scale-105 hover:shadow-xl transition-all duration-300 mt-8">
                            Create Link
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PostAd;
