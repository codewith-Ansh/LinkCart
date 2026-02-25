import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, CheckCircle, Package } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MyListings = () => {
    const navigate = useNavigate();
    const [listings, setListings] = useState([]);

    useEffect(() => {
        const savedListings = JSON.parse(localStorage.getItem('myListings') || '[]');
        setListings(savedListings);
    }, []);

    const handleEdit = (id) => navigate(`/edit-listing/${id}`);
    const handleMarkAsSold = (id) => {
        const updatedListings = listings.map(listing => 
            listing.id === id ? { ...listing, status: 'Sold' } : listing
        );
        setListings(updatedListings);
        localStorage.setItem('myListings', JSON.stringify(updatedListings));
    };
    const handleDelete = (id) => {
        const updatedListings = listings.filter(listing => listing.id !== id);
        setListings(updatedListings);
        localStorage.setItem('myListings', JSON.stringify(updatedListings));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
            <Navbar />
            <div className="w-full px-6 md:px-12 lg:px-20 py-16 animate-fade-in">
                <h1 className="text-5xl md:text-6xl font-extrabold mb-16 tracking-tight" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                    My Listings
                </h1>
                
                {listings.length === 0 ? (
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
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {listings.map((listing) => {
                            const isSold = listing.status === 'Sold';
                            return (
                                <div key={listing.id} className={`bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-2xl ${isSold ? 'opacity-75' : ''}`}>
                                    <div className="relative h-56 overflow-hidden cursor-pointer group" onClick={() => navigate(`/product/${listing.id}`)}>
                                        <img src={listing.image} alt={listing.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        <span className={`absolute top-3 right-3 px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-lg ${
                                            isSold ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-indigo-500 to-purple-600'
                                        }`}>
                                            {listing.status}
                                        </span>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-bold text-lg mb-2 truncate">{listing.title}</h3>
                                        <p className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">${listing.price}</p>
                                        <div className="flex flex-col gap-2">
                                            <button className="flex items-center justify-center gap-2 border-2 border-indigo-500 text-indigo-600 font-semibold px-4 py-2.5 rounded-xl hover:bg-indigo-50 transition-all" onClick={(e) => { e.stopPropagation(); handleEdit(listing.id); }}>
                                                <Edit2 size={16} /> Edit
                                            </button>
                                            <button className={`flex items-center justify-center gap-2 font-semibold px-4 py-2.5 rounded-xl transition-all ${isSold ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:scale-105'}`} onClick={(e) => { e.stopPropagation(); handleMarkAsSold(listing.id); }} disabled={isSold}>
                                                <CheckCircle size={16} /> {isSold ? 'Sold' : 'Mark as Sold'}
                                            </button>
                                            <button className="flex items-center justify-center gap-2 border-2 border-red-500 text-red-500 font-semibold px-4 py-2.5 rounded-xl hover:bg-red-50 transition-all" onClick={(e) => { e.stopPropagation(); handleDelete(listing.id); }}>
                                                <Trash2 size={16} /> Delete
                                            </button>
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

export default MyListings;
