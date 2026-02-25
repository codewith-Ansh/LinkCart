import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Products = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);

    const mockProducts = [
        { id: 1, title: 'Vintage Leather Jacket', price: 299, location: 'New York, NY', status: 'Active', image: 'https://via.placeholder.com/400x300/6366f1/ffffff?text=Product+1' },
        { id: 2, title: 'iPhone 13 Pro', price: 799, location: 'Los Angeles, CA', status: 'Sold', image: 'https://via.placeholder.com/400x300/8b5cf6/ffffff?text=Product+2' },
        { id: 3, title: 'Gaming Laptop', price: 1299, location: 'Chicago, IL', status: 'Active', image: 'https://via.placeholder.com/400x300/ec4899/ffffff?text=Product+3' },
        { id: 4, title: 'Wireless Headphones', price: 149, location: 'Houston, TX', status: 'Active', image: 'https://via.placeholder.com/400x300/22c55e/ffffff?text=Product+4' },
        { id: 5, title: 'Smart Watch', price: 399, location: 'Phoenix, AZ', status: 'Active', image: 'https://via.placeholder.com/400x300/f59e0b/ffffff?text=Product+5' },
        { id: 6, title: 'Camera Lens', price: 599, location: 'Philadelphia, PA', status: 'Sold', image: 'https://via.placeholder.com/400x300/ef4444/ffffff?text=Product+6' },
        { id: 7, title: 'Mechanical Keyboard', price: 179, location: 'San Antonio, TX', status: 'Active', image: 'https://via.placeholder.com/400x300/06b6d4/ffffff?text=Product+7' },
        { id: 8, title: 'Office Chair', price: 249, location: 'San Diego, CA', status: 'Active', image: 'https://via.placeholder.com/400x300/a855f7/ffffff?text=Product+8' },
    ];

    useEffect(() => {
        const savedProducts = JSON.parse(localStorage.getItem('myListings') || '[]');
        setProducts([...savedProducts, ...mockProducts]);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
            <Navbar />
            <div className="w-full px-6 md:px-12 lg:px-20 py-16 animate-fade-in">
                <h1 className="text-5xl md:text-6xl font-extrabold mb-16 tracking-tight" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                    All Products
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="group bg-white rounded-2xl border border-slate-200 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                            onClick={() => navigate(`/product/${product.id}`)}
                        >
                            <div className="relative h-56 overflow-hidden">
                                <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <span className={`absolute top-3 right-3 px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-lg ${
                                    product.status === 'Sold' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-indigo-500 to-purple-600'
                                }`}>
                                    {product.status}
                                </span>
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-lg mb-2 truncate">{product.title}</h3>
                                <p className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">${product.price}</p>
                                <p className="text-gray-500 text-sm">{product.location}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Products;
