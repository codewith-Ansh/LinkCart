import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Package, Flag, LogOut, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import API_BASE from '../utils/api';

const AdminPanel = () => {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [reports, setReports] = useState([]);
    const [loadingReports, setLoadingReports] = useState(true);
    const [reportsError, setReportsError] = useState(null);
    const [actionLoadingId, setActionLoadingId] = useState(null);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalReports: 0
    });
    
    const [selectedReport, setSelectedReport] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);

    const navigate = useNavigate();
    const toast = useToast();

    // Fetch data
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const fetchUsers = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/admin/users`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setUsers(data);
                }
            } catch (err) {
                console.error(err);
            }
        };

        const fetchProducts = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/admin/products`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setProducts(data);
                }
            } catch (err) {
                console.error(err);
            }
        };

        const fetchReports = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/reports`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setReports(data);
                } else {
                    setReportsError("Failed to load reports.");
                }
            } catch (err) {
                console.error(err);
                setReportsError("Network error loading reports.");
            } finally {
                setLoadingReports(false);
            }
        };

        fetchUsers();
        fetchProducts();
        fetchReports();
    }, []);

    useEffect(() => {
        setStats({
            totalUsers: users.length,
            totalProducts: products.length,
            totalReports: reports.length
        });
    }, [users, products, reports]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'products', label: 'Products', icon: Package },
        { id: 'reports', label: 'Reports', icon: Flag }
    ];

    // USER ACTION
    const handleUserAction = async (userId, currentStatus) => {
        const newStatus = currentStatus === 'Active' ? 'Disabled' : 'Active';
        const token = localStorage.getItem('token');

        try {
            const res = await fetch(`${API_BASE}/api/admin/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                setUsers(prev =>
                    prev.map(u =>
                        u.custom_id === userId ? { ...u, status: newStatus } : u
                    )
                );
            }
        } catch (err) {
            console.error(err);
        }
    };

    // REMOVE PRODUCT
    const handleRemoveProduct = async (productId) => {
        const token = localStorage.getItem('token');
        if (!window.confirm("Delete this product?")) return;

        try {
            const res = await fetch(`${API_BASE}/api/admin/products/${productId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                setProducts(prev => prev.filter(p => p.id !== productId));
            }
        } catch (err) {
            console.error(err);
        }
    };

    // REPORT ACTIONS
    const handleUpdateReportStatus = async (reportId, newStatus) => {
        const token = localStorage.getItem('token');
        setActionLoadingId(reportId);
        try {
            const res = await fetch(`${API_BASE}/api/reports/${reportId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: newStatus } : r));
            } else {
                toast.error(`Failed to update status to ${newStatus}`);
            }
        } catch (err) {
            console.error(err);
            toast.error('Error updating report status');
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleDeleteReportAction = async (reportId) => {
        if (!window.confirm("Are you sure you want to delete this report?")) return;
        const token = localStorage.getItem('token');
        setActionLoadingId(reportId);
        try {
            const res = await fetch(`${API_BASE}/api/reports/${reportId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                setReports(prev => prev.filter(r => r.id !== reportId));
            } else {
                toast.error('Failed to delete report');
            }
        } catch (err) {
            console.error(err);
            toast.error('Error deleting report');
        } finally {
            setActionLoadingId(null);
        }
    };

    const fetchReportDetails = async (reportId) => {
        setIsModalOpen(true);
        setModalLoading(true);
        setSelectedReport(null);
        const token = localStorage.getItem('token');
        
        try {
            const res = await fetch(`${API_BASE}/api/reports/${reportId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setSelectedReport(data);
            } else {
                toast.error("Failed to load report details.");
                setIsModalOpen(false);
            }
        } catch (err) {
            console.error(err);
            toast.error("Network error loading report details.");
            setIsModalOpen(false);
        } finally {
            setModalLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <aside className="w-64 bg-white border-r border-gray-100 flex flex-col p-6">
                <div className="mb-10 px-2 flex items-center">
                    <h1 className="text-2xl font-black text-[#8b5cf6] tracking-tight">AdminPanel</h1>
                </div>

                <nav className="space-y-1">
                    {menuItems.map(item => {
                        const Icon = item.icon;
                        const isActive = activeSection === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id)}
                                className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-semibold transition-all ${
                                    isActive
                                        ? 'bg-[#8b5cf6] text-white shadow-md shadow-purple-500/20'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                <div className="mt-4">
                    <button 
                        onClick={handleLogout} 
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-semibold text-red-500 transition-all hover:bg-red-50"
                    >
                        <LogOut size={20} strokeWidth={2} />
                        Logout
                    </button>
                </div>
            </aside>

            <main className="flex-1 p-10 overflow-auto">
                {activeSection === 'dashboard' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h2 className="text-3xl font-black mb-8 text-black tracking-tight">Dashboard</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50 flex items-center gap-5">
                                <div className="p-4 bg-blue-500 text-white rounded-xl shadow-sm">
                                    <Users size={28} strokeWidth={2} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-0.5">Total Users</p>
                                    <h3 className="text-3xl font-black text-gray-900">{stats.totalUsers}</h3>
                                </div>
                            </div>
                            
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50 flex items-center gap-5">
                                <div className="p-4 bg-[#10b981] text-white rounded-xl shadow-sm">
                                    <Package size={28} strokeWidth={2} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-0.5">Total Products</p>
                                    <h3 className="text-3xl font-black text-gray-900">{stats.totalProducts}</h3>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50 flex items-center gap-5">
                                <div className="p-4 bg-[#ef4444] text-white rounded-xl shadow-sm">
                                    <Flag size={28} strokeWidth={2} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-0.5">Total Reports</p>
                                    <h3 className="text-3xl font-black text-gray-900">{stats.totalReports}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === 'users' && (
                    <div className="max-w-6xl animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h2 className="text-3xl font-black mb-8 text-black tracking-tight">Users Management</h2>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/80 text-gray-500 text-sm border-b border-gray-100">
                                        <th className="py-4 px-6 font-semibold">Name</th>
                                        <th className="py-4 px-6 font-semibold">Email</th>
                                        <th className="py-4 px-6 font-semibold">Status</th>
                                        <th className="py-4 px-6 font-semibold">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="py-16 text-center text-gray-500">No users to display</td>
                                        </tr>
                                    ) : (
                                        users.map(u => {
                                            const currentStatus = u.status || 'Active';
                                            return (
                                            <tr key={u.custom_id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                <td className="py-4 px-6 text-gray-800 font-medium">{u.full_name}</td>
                                                <td className="py-4 px-6 text-gray-500">{u.email}</td>
                                                <td className="py-4 px-6">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                        currentStatus === 'Active' ? 'bg-[#dcfce7] text-[#166534]' : 'bg-[#fee2e2] text-[#991b1b]'
                                                    }`}>
                                                        {currentStatus}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <button 
                                                        disabled
                                                        className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition-colors bg-gray-400 cursor-not-allowed"
                                                    >
                                                        Disable
                                                    </button>
                                                </td>
                                            </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeSection === 'products' && (
                    <div className="max-w-6xl animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h2 className="text-3xl font-black mb-8 text-black tracking-tight">Products Management</h2>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/80 text-gray-500 text-sm border-b border-gray-100">
                                        <th className="py-4 px-6 font-semibold">Title</th>
                                        <th className="py-4 px-6 font-semibold">Seller</th>
                                        <th className="py-4 px-6 font-semibold">Status</th>
                                        <th className="py-4 px-6 font-semibold">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="py-16 text-center text-gray-500">No products to display</td>
                                        </tr>
                                    ) : (
                                        products.map(p => (
                                            <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                <td className="py-4 px-6 text-gray-800 font-medium">{p.title}</td>
                                                <td className="py-4 px-6 text-gray-500">{p.custom_id || p.seller_id}</td>
                                                <td className="py-4 px-6">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-[#dcfce7] text-[#166534]`}>
                                                        {p.status || 'public'} 
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <button 
                                                        onClick={() => handleRemoveProduct(p.id)}
                                                        className="bg-[#ef4444] hover:bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
                                                    >
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeSection === 'reports' && (
                    <div className="max-w-6xl animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h2 className="text-3xl font-black mb-8 text-black tracking-tight">Reports Management</h2>
                        
                        {loadingReports ? (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-16 flex items-center justify-center">
                                <p className="text-gray-500 font-medium">Loading reports...</p>
                            </div>
                        ) : reportsError ? (
                            <div className="bg-red-50 rounded-2xl border border-red-100 p-8 flex flex-col items-center justify-center">
                                <p className="text-red-500 font-semibold mb-2">{reportsError}</p>
                            </div>
                        ) : reports.length === 0 ? (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-16 flex items-center justify-center">
                                <p className="text-gray-500 font-medium">No reports to display</p>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/80 text-gray-500 text-sm border-b border-gray-100">
                                            <th className="py-4 px-6 font-semibold">Product ID</th>
                                            <th className="py-4 px-6 font-semibold">Reported By</th>
                                            <th className="py-4 px-6 font-semibold">Reason</th>
                                            <th className="py-4 px-6 font-semibold">Status</th>
                                            <th className="py-4 px-6 font-semibold">Created At</th>
                                            <th className="py-4 px-6 font-semibold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reports.map((r, index) => {
                                            const formattedDate = r.created_at ? new Date(r.created_at).toLocaleString('en-US', {
                                                month: 'short', day: 'numeric', year: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            }) : 'N/A';
                                            
                                            const truncatedReason = r.reason?.length > 50 
                                                ? r.reason.substring(0, 50) + '...' 
                                                : (r.reason || 'No specific reason provided');

                                            return (
                                                <tr key={r.id || index} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                    <td className="py-4 px-6 text-gray-800 font-medium">{r.product_id}</td>
                                                    <td className="py-4 px-6 text-gray-500">{r.reported_by}</td>
                                                    <td className="py-4 px-6 text-gray-600 max-w-xs truncate" title={r.reason}>
                                                        {truncatedReason}
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                            r.status?.toLowerCase() === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                                                        }`}>
                                                            {r.status || 'Pending'}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6 text-gray-500 text-sm">
                                                        {formattedDate}
                                                    </td>
                                                    <td className="py-4 px-6 text-right space-x-2 flex justify-end items-center">
                                                        <button 
                                                            onClick={() => fetchReportDetails(r.id)}
                                                            className="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center bg-blue-100 text-blue-700 hover:bg-blue-200"
                                                        >
                                                            View
                                                        </button>
                                                        <button 
                                                            onClick={() => handleUpdateReportStatus(r.id, 'resolved')}
                                                            disabled={r.status === 'resolved' || r.status === 'rejected' || actionLoadingId === r.id}
                                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center ${
                                                                r.status === 'resolved' || r.status === 'rejected' || actionLoadingId === r.id
                                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                                    : 'bg-[#10b981] hover:bg-emerald-600 text-white shadow-sm'
                                                            }`}
                                                        >
                                                            {actionLoadingId === r.id ? '...' : 'Approve'}
                                                        </button>
                                                        <button 
                                                            onClick={() => handleUpdateReportStatus(r.id, 'rejected')}
                                                            disabled={r.status === 'resolved' || r.status === 'rejected' || actionLoadingId === r.id}
                                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center ${
                                                                r.status === 'resolved' || r.status === 'rejected' || actionLoadingId === r.id
                                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                                    : 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm'
                                                            }`}
                                                        >
                                                            {actionLoadingId === r.id ? '...' : 'Reject'}
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteReportAction(r.id)}
                                                            disabled={actionLoadingId === r.id}
                                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center ${
                                                                actionLoadingId === r.id 
                                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                                    : 'bg-[#ef4444] hover:bg-red-600 text-white shadow-sm'
                                                            }`}
                                                        >
                                                            {actionLoadingId === r.id ? '...' : 'Delete'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
                            <h3 className="text-xl font-black text-gray-900 tracking-tight">Report Details</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        
                        {/* Body */}
                        <div className="p-6 overflow-y-auto flex-1">
                            {modalLoading ? (
                                <div className="flex justify-center items-center py-12">
                                    <div className="w-8 h-8 border-4 border-[#8b5cf6] border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : selectedReport ? (
                                <div className="space-y-8 animate-in fade-in duration-300">
                                    {/* Status Section */}
                                    <div className="bg-amber-50 rounded-xl p-5 border border-amber-100">
                                        <div className="flex items-center justify-between mb-3">
                                            <div>
                                                <h4 className="text-sm font-bold text-amber-900 uppercase tracking-wider mb-1">Reason for Report</h4>
                                                <p className="text-amber-800 text-base font-medium">{selectedReport.report_reason}</p>
                                            </div>
                                            <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${
                                                selectedReport.report_status?.toLowerCase() === 'pending' ? 'bg-amber-200 text-amber-800' : 'bg-gray-200 text-gray-800'
                                            }`}>
                                                {selectedReport.report_status || 'Pending'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Product Info */}
                                        <div className="space-y-5">
                                            <h4 className="text-lg font-black tracking-tight text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                                                <Package size={20} className="text-[#8b5cf6]" /> Product Details
                                            </h4>
                                            {selectedReport.product_id ? (
                                                <div className="space-y-4">
                                                    {selectedReport.product_image ? (
                                                        <div className="w-full h-48 rounded-xl overflow-hidden bg-gray-100 border border-gray-100 shadow-inner">
                                                            <img 
                                                                src={selectedReport.product_image.startsWith('http') ? selectedReport.product_image : `${API_BASE}/${selectedReport.product_image.replace(/\\/g, '/')}`} 
                                                                alt={selectedReport.product_title}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="w-full h-48 rounded-xl bg-gray-50 flex flex-col items-center justify-center border border-dashed border-gray-200 text-gray-400">
                                                            <Package size={32} className="mb-2 opacity-50" />
                                                            <span className="text-sm font-medium">No Image Available</span>
                                                        </div>
                                                    )}
                                                    
                                                    <div>
                                                        <h5 className="font-bold text-gray-900 text-lg">{selectedReport.product_title}</h5>
                                                        <p className="font-bold text-[#10b981] mt-1">${selectedReport.product_price}</p>
                                                        <p className="text-gray-600 mt-2 text-sm line-clamp-3">{selectedReport.product_description}</p>
                                                        <p className="text-gray-400 text-xs mt-2 font-mono">ID: {selectedReport.product_id}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm font-medium flex items-start gap-3">
                                                    <Flag className="shrink-0 mt-0.5" size={18} />
                                                    This product has been deleted or removed from the system.
                                                </div>
                                            )}
                                        </div>

                                        {/* Users Info */}
                                        <div className="space-y-6">
                                            <div>
                                                <h4 className="text-lg font-black tracking-tight text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                                                    <Users size={20} className="text-blue-500" /> Reporter Details
                                                </h4>
                                                <div className="mt-4 bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                                                    <p className="text-sm text-gray-500 font-medium">Name</p>
                                                    <p className="font-bold text-gray-900 mb-3">{selectedReport.reporter_name || 'Unknown User'}</p>
                                                    <p className="text-sm text-gray-500 font-medium">Email</p>
                                                    <p className="font-medium text-gray-800">{selectedReport.reporter_email || 'N/A'}</p>
                                                </div>
                                            </div>

                                            {selectedReport.product_id && (
                                                <div>
                                                    <h4 className="text-lg font-black tracking-tight text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2 mt-2">
                                                        <Users size={20} className="text-emerald-500" /> Product Owner
                                                    </h4>
                                                    <div className="mt-4 bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                                                        <p className="text-sm text-gray-500 font-medium">Name</p>
                                                        <p className="font-bold text-gray-900 mb-3">{selectedReport.owner_name || 'Unknown User'}</p>
                                                        <p className="text-sm text-gray-500 font-medium">Email</p>
                                                        <p className="font-medium text-gray-800">{selectedReport.owner_email || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500 font-medium">
                                    Report data not found.
                                </div>
                            )}
                        </div>
                        
                        {/* Footer Actions */}
                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/80 flex justify-end gap-3">
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors"
                            >
                                Close
                            </button>
                            {selectedReport && selectedReport.report_status !== 'resolved' && selectedReport.report_status !== 'rejected' && (
                                <>
                                    <button 
                                        onClick={async () => {
                                            await handleUpdateReportStatus(selectedReport.report_id, 'rejected');
                                            setIsModalOpen(false);
                                        }}
                                        className="px-5 py-2.5 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition-colors"
                                    >
                                        Reject Report
                                    </button>
                                    <button 
                                        onClick={async () => {
                                            await handleUpdateReportStatus(selectedReport.report_id, 'resolved');
                                            setIsModalOpen(false);
                                        }}
                                        className="px-5 py-2.5 rounded-xl text-sm font-bold bg-[#10b981] hover:bg-emerald-600 text-white shadow-sm transition-colors"
                                    >
                                        Approve (Remove Product)
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
