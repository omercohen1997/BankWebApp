import React, { useEffect, useState, useContext, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authContext } from '../context/AuthProvider';
import axios from '../api/axios';
import {jwtDecode} from 'jwt-decode';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';

const Login = () => {
    const { setAuth } = useContext(authContext);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const emailRef = useRef();

    useEffect(() => {
        emailRef.current.focus();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setErrorMessage('Both email and password are required.');
            return;
        }

        try {
            const response = await axios.post('/auth/login', { email, password });
            const accessToken = response?.data?.accessToken;

            const decoded = jwtDecode(accessToken);
            const role = decoded.UserInfo.role;

            setAuth({ accessToken, email, role });

            setEmail('');
            setPassword('');

            if (from !== '/') {
                navigate(from, { replace: true });
            } else {
                role === 'admin' ? navigate('/admin', { replace: true }) : navigate('/dashboard', { replace: true });
            }
        } catch (err) {
            if (!err?.response) {
                setErrorMessage('No Server Response');
            } else if (err.response?.status === 400) {
                setErrorMessage('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrorMessage('Wrong email or password.');
            } else if (err.response?.status === 403) {
                setErrorMessage('User is not verified');
            } else {
                setErrorMessage('Login Failed');
            }
        }
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 8 }}>
            <Typography 
             variant="h4"
             align="center"
             gutterBottom
             sx={{
               fontWeight: 'bold',
               color: 'primary.main',
               letterSpacing: 1.5,
               textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
             }}
           >
                Login
            </Typography>

            {errorMessage && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {errorMessage}
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        type="email"
                        id="email"
                        value={email}
                        inputRef={emailRef}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="off"
                        required
                    />
                    <TextField
                        label="Password"
                        variant="outlined"
                        fullWidth
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Login
                    </Button>
                </Box>
            </form>
        </Container>
    );
};

export default Login;
