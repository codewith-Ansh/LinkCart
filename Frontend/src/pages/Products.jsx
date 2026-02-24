import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Products = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);

    // Mock product data
    const mockProducts = [
        {
            id: 1,
            title: 'Vintage Leather Jacket',
            price: 299,
            location: 'New York, NY',
            status: 'Active',
            image: 'https://via.placeholder.com/300x200'
        },
        {
            id: 2,
            title: 'iPhone 13 Pro',
            price: 799,
            location: 'Los Angeles, CA',
            status: 'Sold',
            image: 'https://via.placeholder.com/300x200/0D9488'
        },
        {
            id: 3,
            title: 'Gaming Laptop',
            price: 1299,
            location: 'Chicago, IL',
            status: 'Active',
            image: 'https://via.placeholder.com/300x200/065F46'
        },
        {
            id: 4,
            title: 'Wireless Headphones',
            price: 149,
            location: 'Houston, TX',
            status: 'Active',
            image: 'https://via.placeholder.com/300x200/10B981'
        },
        {
            id: 5,
            title: 'Smart Watch',
            price: 399,
            location: 'Phoenix, AZ',
            status: 'Active',
            image: 'https://via.placeholder.com/300x200/EF4444'
        },
        {
            id: 6,
            title: 'Camera Lens',
            price: 599,
            location: 'Philadelphia, PA',
            status: 'Sold',
            image: 'https://via.placeholder.com/300x200/F59E0B'
        },
        {
            id: 7,
            title: 'Mechanical Keyboard',
            price: 179,
            location: 'San Antonio, TX',
            status: 'Active',
            image: 'https://via.placeholder.com/300x200/8B5CF6'
        },
        {
            id: 8,
            title: 'Office Chair',
            price: 249,
            location: 'San Diego, CA',
            status: 'Active',
            image: 'https://via.placeholder.com/300x200/EC4899'
        },
        {
            id: 9,
            title: 'Mountain Bike',
            price: 899,
            location: 'Dallas, TX',
            status: 'Active',
            image: 'https://via.placeholder.com/300x200/14B8A6'
        },
        {
            id: 10,
            title: 'Designer Sunglasses',
            price: 199,
            location: 'Miami, FL',
            status: 'Sold',
            image: 'https://via.placeholder.com/300x200/F97316'
        },
        {
            id: 11,
            title: 'Electric Scooter',
            price: 449,
            location: 'Seattle, WA',
            status: 'Active',
            image: 'https://via.placeholder.com/300x200/06B6D4'
        },
        {
            id: 12,
            title: 'Vintage Record Player',
            price: 329,
            location: 'Portland, OR',
            status: 'Active',
            image: 'https://via.placeholder.com/300x200/A855F7'
        }
    ];

    useEffect(() => {
        // Load products from localStorage
        const savedProducts = JSON.parse(localStorage.getItem('myListings') || '[]');
        // Merge with mock data
        setProducts([...savedProducts, ...mockProducts]);
    }, []);

    return (
        <div>
            <Navbar />
            <div className="products-page">
                <div className="products-container">
                    <h1 className="products-title">All Products</h1>
                    <div className="products-grid-page">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="product-card-page"
                                onClick={() => navigate(`/product/${product.id}`)}
                            >
                                <div className="product-image-wrapper-page">
                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        className="product-image-page"
                                    />
                                    <span className={`product-status-badge-page ${product.status.toLowerCase()}`}>
                                        {product.status}
                                    </span>
                                </div>
                                <div className="product-content-page">
                                    <h3 className="product-title-page">{product.title}</h3>
                                    <p className="product-price-page">${product.price}</p>
                                    <p className="product-location-page">{product.location}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;
