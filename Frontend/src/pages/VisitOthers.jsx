import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const VisitOthers = () => {
    // Sample product data
    const products = [
        { id: 1, name: "Wireless Headphones", description: "High-quality sound with noise cancellation", price: "$99", image: "" },
        { id: 2, name: "Smart Watch", description: "Track your fitness and stay connected", price: "$199", image: "" },
        { id: 3, name: "Laptop Stand", description: "Ergonomic design for better posture", price: "$49", image: "" },
        { id: 4, name: "Phone Case", description: "Durable protection for your device", price: "$25", image: "" },
        { id: 5, name: "Bluetooth Speaker", description: "Portable speaker with amazing bass", price: "$79", image: "" },
        { id: 6, name: "Desk Lamp", description: "LED lamp with adjustable brightness", price: "$35", image: "" },
        { id: 7, name: "Coffee Mug", description: "Keep your coffee hot for hours", price: "$15", image: "" },
        { id: 8, name: "Notebook Set", description: "Premium quality paper for writing", price: "$20", image: "" },
        { id: 9, name: "USB Cable", description: "Fast charging and data transfer", price: "$12", image: "" }
    ];

    // Sample user data
    const users = [
        { id: 1, username: "TechGuru", itemsSold: 45, popularity: "High", totalLinks: 12, visitors: 2500, image: "" },
        { id: 2, username: "StyleQueen", itemsSold: 32, popularity: "Medium", totalLinks: 8, visitors: 1800, image: "" },
        { id: 3, username: "GadgetKing", itemsSold: 67, popularity: "High", totalLinks: 15, visitors: 3200, image: "" },
        { id: 4, username: "BookLover", itemsSold: 23, popularity: "Low", totalLinks: 6, visitors: 950, image: "" },
        { id: 5, username: "FitnessFreak", itemsSold: 38, popularity: "Medium", totalLinks: 10, visitors: 2100, image: "" },
        { id: 6, username: "ArtCreator", itemsSold: 29, popularity: "Medium", totalLinks: 9, visitors: 1600, image: "" }
    ];

    return (
        <>
            <Navbar />
            <div className="visit-others-page">
                {/* Products Section - 70% */}
                <section className="products-section">
                    <div className="section-container">
                        <h2 className="section-title">Featured Products</h2>
                        <div className="products-grid">
                            {products.map((product) => (
                                <div key={product.id} className="product-card">
                                    <div className="product-image"></div>
                                    <div className="product-info">
                                        <h3 className="product-name">{product.name}</h3>
                                        <p className="product-description">{product.description}</p>
                                        <div className="product-footer">
                                            <span className="product-price">{product.price}</span>
                                            <button className="view-buy-btn">View / Buy</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Users Section - 30% */}
                <section className="users-section">
                    <div className="section-container">
                        <h2 className="section-title">Popular Creators</h2>
                        <div className="users-grid">
                            {users.map((user) => (
                                <div key={user.id} className="user-card">
                                    <div className="user-profile-image"></div>
                                    <div className="user-info">
                                        <h3 className="username">{user.username}</h3>
                                        <div className="user-stats">
                                            <p>Items Sold: {user.itemsSold}</p>
                                            <p>Popularity: {user.popularity}</p>
                                            <p>Total Links: {user.totalLinks}</p>
                                            <p>Visitors: {user.visitors}</p>
                                        </div>
                                        <button className="visit-profile-btn">Visit Profile</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
};

export default VisitOthers;