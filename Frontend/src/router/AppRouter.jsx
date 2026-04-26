import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

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
import PublicProductPage from '../pages/PublicProductPage';
import UserProfile from '../pages/UserProfile';
import InterestsDashboard from '../pages/InterestsDashboard';
import MyRequestsDashboard from '../pages/MyRequestsDashboard';
import MyReportsDashboard from '../pages/MyReportsDashboard';
import CompleteProfile from '../pages/CompleteProfile';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import ForgotPassword from '../pages/ForgotPassword';
import VerifyOtp from '../pages/VerifyOtp';
import ResetPassword from '../pages/ResetPassword';
import Settings from '../pages/Settings';
import AuthSuccess from '../pages/AuthSuccess';
import NotFound from '../pages/NotFound';
import About from '../pages/About';
import Privacy from '../pages/Privacy';
import Terms from '../pages/Terms';
import Contact from '../pages/Contact';

// Decode token and check expiry
const getValidRole = (token) => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));

        if (payload.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('customId');
            return null;
        }

        return payload.role || null;
    } catch {
        return null;
    }
};

// Protect admin route
const AdminRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) return <Navigate to="/login" replace />;

    const role = getValidRole(token);

    if (!role) return <Navigate to="/login" replace />;
    if (role !== 'admin') return <Navigate to="/" replace />;

    return children;
};

const AppRouter = () => {
    return (
        <Router>
            <Routes>

                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-otp" element={<VerifyOtp />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/auth-success" element={<AuthSuccess />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/about" element={<About />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/contact" element={<Contact />} />

                {/* User routes */}
                <Route path="/dashboard" element={<Navigate to="/account" replace />} />
                <Route path="/profile" element={<CompleteProfile />} />
                <Route path="/complete-profile" element={<CompleteProfile />} />
                <Route path="/products" element={<Products />} />
                <Route path="/account" element={<Account />} />
                <Route path="/dashboard/interests" element={<InterestsDashboard />} />
                <Route path="/dashboard/my-requests" element={<MyRequestsDashboard />} />
                <Route path="/dashboard/reports" element={<MyReportsDashboard />} />
                <Route path="/explore" element={<VisitOthers />} />
                <Route path="/my-listings" element={<MyListings />} />
                <Route path="/edit-listing/:id" element={<EditListing />} />
                <Route path="/post-ad" element={<PostAd />} />
                <Route path="/seller/:id" element={<SellerProfile />} />
                <Route path="/product/:slug" element={<ProductDetail />} />
                <Route path="/p/:slug" element={<PublicProductPage />} />
                <Route path="/user/:custom_id" element={<UserProfile />} />

                {/* Admin route (protected) */}
                <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <AdminPanel />
                        </AdminRoute>
                    }
                />

                {/* Catch-all 404 Route */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
