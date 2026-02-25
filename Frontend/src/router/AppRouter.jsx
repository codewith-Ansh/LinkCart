import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Products from '../pages/Products';
import Account from '../pages/Account';
import VisitOthers from '../pages/VisitOthers';
import MyListings from '../pages/MyListings';
import EditListing from '../pages/EditListing';
import PostAd from '../pages/PostAd';
import SellerProfile from '../pages/SellerProfile';
import AdminPanel from '../pages/AdminPanel';
import ProductDetail from '../pages/ProductDetail';
import CompleteProfile from '../pages/CompleteProfile';
import Login from '../pages/Login';
import Signup from '../pages/Signup';

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/complete-profile" element={<CompleteProfile />} />
                <Route path="/products" element={<Products />} />
                <Route path="/account" element={<Account />} />
                <Route path="/explore" element={<VisitOthers />} />
                <Route path="/my-listings" element={<MyListings />} />
                <Route path="/edit-listing/:id" element={<EditListing />} />
                <Route path="/post-ad" element={<PostAd />} />
                <Route path="/seller/:id" element={<SellerProfile />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/product/:id" element={<ProductDetail />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;