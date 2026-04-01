import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Loader2, Mail, MapPin, Phone, Tag, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API_BASE from '../utils/api';
import { useToast } from '../context/ToastContext';
import ProductStatusBadge from '../components/ProductStatusBadge';
import { useAppContext } from '../context/AppContext';
import InterestDashboardTabs from '../components/InterestDashboardTabs';

const statusPillMap = {
    pending: 'bg-purple-50 text-purple-700',
    accepted: 'bg-violet-50 text-violet-700',
    rejected: 'bg-gray-100 text-gray-600',
};

const InterestsDashboard = () => {
    const [interests, setInterests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState('');
    const navigate = useNavigate();
    const toast = useToast();
    const { isLoggedIn, refreshSellerInterestCount } = useAppContext();

    const fetchInterests = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/api/interests/seller`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to load interests');
            }

            setInterests(data);
        } catch (error) {
            toast.error(error.message || 'Failed to load interests.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInterests();
        refreshSellerInterestCount();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleAction = async (interestId, action) => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        setActionId(`${interestId}-${action}`);

        try {
            const response = await fetch(`${API_BASE}/api/interests/${interestId}/${action}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `Failed to ${action} interest.`);
            }

            setInterests((prev) =>
                prev.map((interest) =>
                    interest.id === interestId
                        ? {
                            ...interest,
                            status: action === 'accept' ? 'accepted' : 'rejected',
                            product_status: action === 'accept' ? 'in_progress' : interest.product_status,
                        }
                        : interest
                )
            );

            toast.success(action === 'accept' ? 'Interest accepted.' : 'Interest rejected.');
            refreshSellerInterestCount();
            fetchInterests();
        } catch (error) {
            toast.error(error.message || `Failed to ${action} interest.`);
        } finally {
            setActionId('');
        }
    };

    const handleMarkSold = async (productId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        setActionId(`${productId}-sold`);

        try {
            const response = await fetch(`${API_BASE}/api/products/${productId}/sold`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to mark product as sold.');
            }

            setInterests((prev) =>
                prev.map((interest) =>
                    interest.product_id === productId
                        ? { ...interest, product_status: 'sold' }
                        : interest
                )
            );

            toast.success('Product marked as sold.');
        } catch (error) {
            toast.error(error.message || 'Failed to mark product as sold.');
        } finally {
            setActionId('');
        }
    };

    if (!isLoggedIn) {
        navigate('/login');
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50/40 via-white to-gray-50">
            <Navbar />
            <div className="mx-auto max-w-6xl px-6 py-12 md:px-8">
                <InterestDashboardTabs activePath="/dashboard/interests" />
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                        Incoming Requests
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Review interested buyers and unlock contact details only after you accept.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 size={30} className="animate-spin text-purple-600" />
                    </div>
                ) : interests.length === 0 ? (
                    <div className="rounded-xl border border-gray-100 bg-white p-10 text-center shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900">No interests yet</h2>
                        <p className="mt-2 text-sm text-gray-500">Interested buyers will appear here once they respond to your listings.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {interests.map((interest) => (
                            <div key={interest.id} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h2 className="text-lg font-semibold text-gray-900">{interest.product_title}</h2>
                                            <ProductStatusBadge status={interest.product_status} />
                                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusPillMap[interest.status] || statusPillMap.pending}`}>
                                                {interest.status}
                                            </span>
                                        </div>

                                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Buyer</p>
                                                <p className="mt-1 text-base font-semibold text-gray-800">{interest.buyer_name}</p>
                                                {interest.buyer_tagline && (
                                                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                                                        <Tag size={14} className="text-purple-500" />
                                                        <span>{interest.buyer_tagline}</span>
                                                    </div>
                                                )}
                                                {interest.city && (
                                                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                                                        <MapPin size={14} className="text-purple-500" />
                                                        <span>{interest.city}</span>
                                                    </div>
                                                )}
                                                {interest.message && (
                                                    <div className="mt-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
                                                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Buyer Message</p>
                                                        <p className="mt-1 text-sm text-gray-600">{interest.message}</p>
                                                    </div>
                                                )}
                                            </div>

                                            {interest.status === 'accepted' ? (
                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Contact Details</p>
                                                    <div className="mt-2 space-y-2 text-sm text-gray-600">
                                                        <div className="flex items-center gap-2">
                                                            <Mail size={14} className="text-purple-500" />
                                                            <span>{interest.email || 'Not available'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Phone size={14} className="text-purple-500" />
                                                            <span>{interest.phone || 'Not available'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Contact Details</p>
                                                    <p className="mt-2 text-sm text-gray-500">Available after you accept this interest.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-3 lg:justify-end">
                                        {interest.status === 'pending' && interest.product_status !== 'sold' && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => handleAction(interest.id, 'reject')}
                                                    disabled={actionId === `${interest.id}-reject` || actionId === `${interest.id}-accept`}
                                                    className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    {actionId === `${interest.id}-reject` ? <Loader2 size={16} className="animate-spin" /> : <span className="inline-flex items-center gap-2"><X size={16} />Reject</span>}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleAction(interest.id, 'accept')}
                                                    disabled={actionId === `${interest.id}-accept` || actionId === `${interest.id}-reject`}
                                                    className="rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    {actionId === `${interest.id}-accept` ? <Loader2 size={16} className="animate-spin" /> : <span className="inline-flex items-center gap-2"><Check size={16} />Accept</span>}
                                                </button>
                                            </>
                                        )}

                                        {interest.status === 'accepted' && interest.product_status !== 'sold' && (
                                            <button
                                                type="button"
                                                onClick={() => handleMarkSold(interest.product_id)}
                                                disabled={actionId === `${interest.product_id}-sold`}
                                                className="rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {actionId === `${interest.product_id}-sold` ? <Loader2 size={16} className="animate-spin" /> : 'Mark as Sold'}
                                            </button>
                                        )}
                                    </div>
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

export default InterestsDashboard;
