import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <h1>Login Page</h1>
            <p>This is a placeholder for the login page.</p>
            <Link to="/" style={{ color: 'var(--primary-color)', textDecoration: 'none', marginTop: '1rem' }}>Back to Home</Link>
        </div>
    );
};

export default Login;
