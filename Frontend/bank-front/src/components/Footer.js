import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

const Footer = () => {
    return (
        <AppBar position="static" sx={{ top: 'auto', bottom: 0 }}>
            <Toolbar>
                <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%',  }}>
                    <Typography variant="body3" color="inherit" align="center" >
                        &copy; {new Date().getFullYear()} OC Bank. Made by Omer Cohen.
                    </Typography>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Footer;
