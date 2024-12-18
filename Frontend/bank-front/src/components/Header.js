import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Button } from '@mui/material';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authContext } from '../context/AuthProvider';
import axios from '../api/axios';


const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(authContext);

    const handleLogout = async () => {
        try {

            const response = await axios.post('/auth/logout');
            console.log(response?.data);

            setAuth({});
            navigate('/login');
        }
        catch (error) {
            console.error("Logout failed: ", error);
        }

        
    }
    return (
        <AppBar position="static">
            <Toolbar>
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                    <IconButton edge="start" color="inherit" aria-label="bank icon" sx={{ mr: 1 }}>
                        <BusinessCenterIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{
                        flexGrow: 1,
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1.4rem'
                    }}>
                        OC Bank
                    </Typography>
                </Link>

                <Box sx={{ display: 'flex', gap: 2, marginLeft: 'auto' }}>
                    {auth?.accessToken ? (
                        <Button color="inherit" onClick={handleLogout}>
                            Logout
                        </Button>
                    ) : location.pathname === '/login' ? (
                        <Button component={Link} to="/signup" color="inherit">
                            Signup
                        </Button>
                    ) : location.pathname === '/signup' ? (
                        <Button component={Link} to="/login" color="inherit">
                            Login
                        </Button>
                    ) : null
                    }
                </Box>
            </Toolbar>
        </AppBar>
    );
};
export default Header;
