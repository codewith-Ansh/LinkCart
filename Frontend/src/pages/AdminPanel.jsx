import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Package, Flag, LogOut, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [reports, setReports] = useState([]);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalReports: 0
    });

    const navigate = useNavigate();

    // Fetch data
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const fetchUsers = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/admin/users', {
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
                const res = await fetch('http://localhost:5000/api/admin/products', {
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
                const res = await fetch('http://localhost:5000/api/reports', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setReports(data);
                }
            } catch (err) {
                console.error(err);
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
            const res = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
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
            const res = await fetch(`http://localhost:5000/api/admin/products/${productId}`, {
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
    const handleDismissReport = async (reportId) => {
        const token = localStorage.getItem('token');

        try {
            const res = await fetch(`http://localhost:5000/api/reports/${reportId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                setReports(prev => prev.filter(r => r.id !== reportId));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleRemoveListing = async (reportId) => {
        const token = localStorage.getItem('token');
        const report = reports.find(r => r.id === reportId);
        if (!report) return;

        try {
            if (report.product_id) {
                await fetch(`http://localhost:5000/api/admin/products/${report.product_id}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProducts(prev => prev.filter(p => p.id !== report.product_id));
            }

            await fetch(`http://localhost:5000/api/reports/${reportId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            setReports(prev => prev.filter(r => r.id !== reportId));

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex min-h-screen">
            <aside className="w-64 bg-white border-r p-4">
                <h1 className="text-xl font-bold mb-4">Admin Panel</h1>

                {menuItems.map(item => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className="flex gap-2 p-2 w-full"
                        >
                            <Icon size={18} />
                            {item.label}
                        </button>
                    );
                })}

                <button onClick={handleLogout} className="mt-4 text-red-500">
                    Logout
                </button>
            </aside>

            <main className="flex-1 p-6">
                {activeSection === 'users' && (
                    <div>
                        {users.map(u => (
                            <div key={u.custom_id}>
                                {u.full_name} - {u.status}
                                <button onClick={() => handleUserAction(u.custom_id, u.status)}>
                                    Toggle
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {activeSection === 'products' && (
                    <div>
                        {products.map(p => (
                            <div key={p.id}>
                                {p.title}
                                <button onClick={() => handleRemoveProduct(p.id)}>Delete</button>
                            </div>
                        ))}
                    </div>
                )}

                {activeSection === 'reports' && (
                    <div>
                        {reports.map(r => (
                            <div key={r.id}>
                                {r.reason}
                                <button onClick={() => handleDismissReport(r.id)}>Dismiss</button>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminPanel;