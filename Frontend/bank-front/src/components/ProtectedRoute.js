import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authContext } from '../context/AuthProvider';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { auth } = useContext(authContext);
    const location = useLocation();

    try {
        // If user is not logged in at all, redirect to /login
        if (!auth?.accessToken) {
            return <Navigate to="/login" state={{ from: location }} replace />;
        }

        const decoded = jwtDecode(auth.accessToken);
        const userRole = decoded.UserInfo.role;

        // If user logged in but wrong role, redirect to /unauthorized
        if (!allowedRoles.includes(userRole)) {
            return <Navigate to="/unauthorized" replace />;
        }

        return children;
        
    } catch (error) {
        // If token is invalid, redirect to login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
};

export default ProtectedRoute;