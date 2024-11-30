import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ element: Component, roles, ...rest }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/" />;
    }

    try {
        const decodedToken = jwtDecode(token);
        const userRoles = decodedToken.role;

        if (!roles.includes(userRoles)) {
            return <Navigate to="/not-authorized" />;
        }

        return <Component {...rest} />;
    } catch (error) {
        console.error('Invalid token:', error);
        return <Navigate to="/" />;
    }
};

export default ProtectedRoute;
