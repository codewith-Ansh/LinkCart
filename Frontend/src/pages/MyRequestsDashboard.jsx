import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Mail, MapPin, MessageSquare, Phone, User } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API_BASE from '../utils/api';
import { useToast } from '../context/ToastContext';
import ProductStatusBadge from '../components/ProductStatusBadge';
import InterestDashboardTabs from '../components/InterestDashboardTabs';
import { useAppContext } from '../context/AppContext';

const statusPillMap = {
    pending: 'bg-purple-50 text-purple-700',
    accepted: 'bg-violet-50 text-violet-700',
    rejected: 'bg-gray-100 text-gray-600',
};

const MyRequestsDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [contacts, setContacts] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const toast = useToast();
    const { isLoggedIn } = useAppContext();

    const fetchRequests = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/api/interests/buyer`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to load your requests.');
            }

            setRequests(data);

            const acceptedRequests = data.filter((item) => item.status === 'accepted');

            if (acceptedRequests.length > 0) {
                const contactEntries = await Promise.all(
                    acceptedRequests.map(async (request) => {
                        const contactResponse = await fetch(`${API_BASE}/api/interests/${request.id}/contact`, {
                            headers: { Authorization: `Bearer ${token}` },
                        });

                        const contactData = await contactResponse.json();

                        if (!contactResponse.ok) {
                            return [request.id, { error: contactData.error || 'Contact unavailable.' }];
                        }

                        return [request.id, contactData];
                    })
                );

                setContacts(Object.fromEntries(contactEntries));
            }
        } catch (error) {
            toast.error(error.message || 'Failed to load your requests.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (!isLoggedIn) {
        navigate('/login');
        return null;
    }

    return (
        <div className="theme-page min-h-screen">
            <Navbar />
            <div className="mx-auto max-w-6xl px-6 py-12 md:px-8">
                <InterestDashboardTabs activePath="/dashboard/my-requests" />
                <div className="mb-8">
                    <h1 className="theme-text-primary text-3xl font-bold" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                        My Requests
                    </h1>
                    <p className="theme-text-secondary mt-2 text-sm">
                        Track every request you have sent and view seller contact details after acceptance.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 size={30} className="animate-spin text-purple-600" />
                    </div>
                ) : requests.length === 0 ? (
                    <div className="theme-surface rounded-xl p-10 text-center">
                        <h2 className="theme-text-primary text-lg font-semibold">No requests sent yet</h2>
                        <p className="theme-text-secondary mt-2 text-sm">When you send an interest request, it will appear here.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {requests.map((request) => {
                            const contact = contacts[request.id];

                            return (
                                <div key={request.id} className="theme-surface rounded-xl p-6">
                                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <h2 className="theme-text-primary text-lg font-semibold">{request.product_title}</h2>
                                                <ProductStatusBadge status={request.product_status} />
                                                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusPillMap[request.status] || statusPillMap.pending}`}>
                                                    {request.status}
                                                </span>
                                            </div>

                                            <div className="mt-4 grid gap-4 md:grid-cols-2">
                                                <div>
                                                    <p className="theme-text-muted text-xs font-semibold uppercase tracking-[0.18em]">Seller</p>
                                                    <div className="theme-text-primary mt-1 flex items-center gap-2 text-sm font-semibold">
                                                        <User size={14} className="text-purple-500" />
                                                        <span>{request.seller_name}</span>
                                                    </div>
                                                    {request.message && (
                                                        <div className="theme-subtle-panel mt-3 rounded-xl p-3">
                                                            <p className="theme-text-muted text-xs font-semibold uppercase tracking-[0.18em]">Your Message</p>
                                                            <div className="theme-text-secondary mt-1 flex items-start gap-2 text-sm">
                                                                <MessageSquare size={14} className="mt-0.5 shrink-0 text-purple-500" />
                                                                <span>{request.message}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div>
                                                    <p className="theme-text-muted text-xs font-semibold uppercase tracking-[0.18em]">Status</p>
                                                    {request.status === 'accepted' ? (
                                                        contact?.error ? (
                                                            <p className="theme-text-secondary mt-2 text-sm">{contact.error}</p>
                                                        ) : (
                                                            <div className="theme-text-secondary mt-2 space-y-2 text-sm">
                                                                <div className="flex items-center gap-2">
                                                                    <Mail size={14} className="text-purple-500" />
                                                                    <span>{contact?.email || 'Not available'}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <Phone size={14} className="text-purple-500" />
                                                                    <span>{contact?.phone || 'Not available'}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <MapPin size={14} className="text-purple-500" />
                                                                    <span>{contact?.city || 'Not available'}</span>
                                                                </div>
                                                            </div>
                                                        )
                                                    ) : request.status === 'pending' ? (
                                                        <p className="theme-text-secondary mt-2 text-sm">Waiting for seller</p>
                                                    ) : (
                                                        <p className="theme-text-secondary mt-2 text-sm">Request Rejected</p>
                                                    )}
                                                </div>
                                            </div>

                                            <p className="theme-text-muted mt-4 text-xs">
                                                Sent on {new Date(request.created_at).toLocaleString()}
                                            </p>
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

export default MyRequestsDashboard;
