import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Package, Flag, LogOut, Menu, X } from 'lucide-react';

const AdminPanel = () => {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Initialize mock data
    const mockUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
        { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', status: 'Active' },
        { id: 3, name: 'Mike Chen', email: 'mike@example.com', status: 'Disabled' },
        { id: 4, name: 'Emily Davis', email: 'emily@example.com', status: 'Active' }
    ];

    const mockReports = [
        { id: 1, productTitle: 'iPhone 13 Pro', productId: 2, reason: 'Fake Product', reporter: 'User123' },
        { id: 2, productTitle: 'Designer Bag', productId: 5, reason: 'Scam', reporter: 'User456' },
        { id: 3, productTitle: 'Concert Tickets', productId: 6, reason: 'Spam', reporter: 'User789' }
    ];

    // State management
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [reports, setReports] = useState([]);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalReports: 0
    });

    // Load data from localStorage on mount
    useEffect(() => {
        // Load users
        const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
        setUsers(savedUsers.length > 0 ? savedUsers : mockUsers);

        // Load products from myListings
        const savedProducts = JSON.parse(localStorage.getItem('myListings') || '[]');
        setProducts(savedProducts);

        // Load reports
        const savedReports = JSON.parse(localStorage.getItem('reports') || '[]');
        setReports(savedReports);
    }, []);

    // Update stats when data changes
    useEffect(() => {
        setStats({
            totalUsers: users.length,
            totalProducts: products.length,
            totalReports: reports.length
        });
    }, [users, products, reports]);

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'products', label: 'Products', icon: Package },
        { id: 'reports', label: 'Reports', icon: Flag }
    ];

    // PART 1: Users Management
    const handleUserAction = (userId, currentStatus) => {
        const updatedUsers = users.map(user => {
            if (user.id === userId) {
                return {
                    ...user,
                    status: currentStatus === 'Active' ? 'Disabled' : 'Active'
                };
            }
            return user;
        });
        setUsers(updatedUsers);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
    };

    // PART 2: Products Management
    const handleRemoveProduct = (productId) => {
        const updatedProducts = products.filter(product => product.id !== productId);
        setProducts(updatedProducts);
        localStorage.setItem('myListings', JSON.stringify(updatedProducts));
    };

    // PART 3: Reports Management
    const handleDismissReport = (reportId) => {
        const updatedReports = reports.filter(report => report.id !== reportId);
        setReports(updatedReports);
        localStorage.setItem('reports', JSON.stringify(updatedReports));
    };

    const handleRemoveListing = (reportId) => {
        // Find the report to get product ID
        const report = reports.find(r => r.id === reportId);
        
        if (report && report.productId) {
            // Remove product from listings
            const updatedProducts = products.filter(product => product.id !== report.productId);
            setProducts(updatedProducts);
            localStorage.setItem('myListings', JSON.stringify(updatedProducts));
        }
        
        // Remove report
        const updatedReports = reports.filter(r => r.id !== reportId);
        setReports(updatedReports);
        localStorage.setItem('reports', JSON.stringify(updatedReports));
    };

    return (
        <div className="admin-panel">
            {/* Mobile Menu Button */}
            <button 
                className="mobile-menu-btn"
                onClick={() => setSidebarOpen(!sidebarOpen)}
            >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="admin-logo">Admin Panel</div>
                <nav className="admin-nav">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                className={`admin-nav-item ${activeSection === item.id ? 'active' : ''}`}
                                onClick={() => {
                                    setActiveSection(item.id);
                                    setSidebarOpen(false);
                                }}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                    <button className="admin-nav-item logout">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                {/* Dashboard Section */}
                {activeSection === 'dashboard' && (
                    <div className="admin-section">
                        <h1 className="admin-section-title">Dashboard</h1>
                        <div className="admin-stats-grid">
                            <div className="admin-stat-card">
                                <div className="stat-icon users-icon">
                                    <Users size={24} />
                                </div>
                                <div className="stat-info">
                                    <p className="stat-label">Total Users</p>
                                    <p className="stat-value">{stats.totalUsers}</p>
                                </div>
                            </div>
                            <div className="admin-stat-card">
                                <div className="stat-icon products-icon">
                                    <Package size={24} />
                                </div>
                                <div className="stat-info">
                                    <p className="stat-label">Total Products</p>
                                    <p className="stat-value">{stats.totalProducts}</p>
                                </div>
                            </div>
                            <div className="admin-stat-card">
                                <div className="stat-icon reports-icon">
                                    <Flag size={24} />
                                </div>
                                <div className="stat-info">
                                    <p className="stat-label">Total Reports</p>
                                    <p className="stat-value">{stats.totalReports}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Users Section */}
                {activeSection === 'users' && (
                    <div className="admin-section">
                        <h1 className="admin-section-title">Users Management</h1>
                        <div className="admin-table-container">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id}>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <span className={`status-badge ${user.status.toLowerCase()}`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    className={`action-btn ${user.status === 'Active' ? 'danger' : 'success'}`}
                                                    onClick={() => handleUserAction(user.id, user.status)}
                                                >
                                                    {user.status === 'Active' ? 'Disable' : 'Enable'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Products Section */}
                {activeSection === 'products' && (
                    <div className="admin-section">
                        <h1 className="admin-section-title">Products Management</h1>
                        <div className="admin-table-container">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Seller</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product.id}>
                                            <td>{product.title}</td>
                                            <td>{product.seller}</td>
                                            <td>
                                                <span className={`status-badge ${product.status.toLowerCase()}`}>
                                                    {product.status}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    className="action-btn danger"
                                                    onClick={() => handleRemoveProduct(product.id)}
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Reports Section */}
                {activeSection === 'reports' && (
                    <div className="admin-section">
                        <h1 className="admin-section-title">Reports Management</h1>
                        <div className="reports-list">
                            {reports.length === 0 ? (
                                <p className="empty-state-message">No reports to display</p>
                            ) : (
                                reports.map((report) => (
                                    <div key={report.id} className="report-card">
                                        <div className="report-info">
                                            <h3 className="report-product-title">{report.productTitle}</h3>
                                            <p className="report-reason">Reason: {report.reason}</p>
                                            {report.description && (
                                                <p className="report-reporter">Description: {report.description}</p>
                                            )}
                                        </div>
                                        <div className="report-actions">
                                            <button
                                                className="action-btn secondary"
                                                onClick={() => handleDismissReport(report.id)}
                                            >
                                                Dismiss
                                            </button>
                                            <button
                                                className="action-btn danger"
                                                onClick={() => handleRemoveListing(report.id)}
                                            >
                                                Remove Listing
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminPanel;
