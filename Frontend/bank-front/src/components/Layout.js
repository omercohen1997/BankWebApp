import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { Box } from '@mui/material';

const Layout = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <main style={{ flex: 1 }}>
                <Outlet />
            </main>
            <Footer />
        </Box>
    );
};

export default Layout;
