import React from 'react'
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { Navigate } from 'react-router-dom';

interface Props {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;
