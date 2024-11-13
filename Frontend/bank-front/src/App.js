import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Signup from './components/Signup';
import Login from './components/Login';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import Unauthorized from './components/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';
import Missing from './components/Missing';
import HomePage from './components/HomePage';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>

                {/* Public routes */}
                <Route index element={<HomePage />} />
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
                <Route path="unauthorized" element={<Unauthorized />} />

                {/* Protected routes */}
                <Route path="admin" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <AdminDashboard />
                    </ProtectedRoute>
                } />

                <Route path="dashboard" element={
                    <ProtectedRoute allowedRoles={['user']}>
                        <UserDashboard />
                    </ProtectedRoute>
                } />
                <Route path="*" element={<Missing />} />
            </Route>
        </Routes>
    );
};

export default App;
