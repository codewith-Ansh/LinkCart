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
                                                    <td className="py-4 px-6 text-right space-x-2 flex justify-end">
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
        </div>
    );
};

export default AdminPanel;
