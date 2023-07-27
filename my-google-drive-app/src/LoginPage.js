import React from 'react';
import { Link } from 'react-router-dom';

const LoginPage = () => {
    return (
        <div>
            <h2>Login Page</h2>
            <a href="http://localhost:5000/auth" target="_blank" rel="noopener noreferrer">
                Log in with Google
            </a>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Link to="/analytics">Click here to view analytics (requires login and Access Token)</Link>

            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Link to="/revoke-access">Revoke Access (requires login and Access Token)</Link>
        </div>
    );
};

export default LoginPage;
