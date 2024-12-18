import React from 'react';
import { Box, Typography, Button, Grid, Paper, Container } from '@mui/material';
import {
    AccountBalance as BankIcon, Security as SecurityIcon, CreditCard as CardIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const features = [
        {
            icon: <SecurityIcon color="primary" sx={{ fontSize: 60 }} />,
            title: 'Advanced Security',
            description: 'Protect your finances with our state-of-the-art security measures.'
        },
        {
            icon: <CardIcon color="primary" sx={{ fontSize: 60 }} />,
            title: 'Easy Banking',
            description: 'Manage your account, transfer funds, and watch your profile with just a few clicks.'
        },
        {

            icon: <BankIcon color="primary" sx={{ fontSize: 60 }} />,
            title: 'Simplified Banking',
            description: 'Enjoy access to your accounts and transactions, anytime, anywhere.'

        }
    ];

    return (
        <Box>
            <Box
                sx={{
                    backgroundColor: 'primary.main',
                    color: 'white',
                    py: 8,
                    textAlign: 'center'
                }}
            >
                <Container maxWidth="md">
                    <Typography variant="h2" gutterBottom>
                        Welcome to OC Bank
                    </Typography>
           

                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <Button
                            component={Link}
                            to="/login"
                            variant="contained"
                            size="large"
                            style={{
                                backgroundColor: 'green',
                                color: 'white'  
                            }}
                        >
                            Login
                        </Button>
                        <Button
                            component={Link}
                            to="/signup"
                            variant="contained"
                            size="large"
                            style={{
                                backgroundColor: 'green',
                                color: 'white'  
                            }}
                        >
                            Sign Up
                        </Button>
                    </Box>
                </Container>
            </Box>

            <Container sx={{ py: 7 }}>
                <Grid container spacing={3}>
                    {features.map((feature, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 4,
                                    textAlign: 'center',
                                    height: '100%'
                                }}
                            >
                                {feature.icon}
                                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                                    {feature.title}
                                </Typography>
                                <Typography variant="body2">
                                    {feature.description}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            <Box
                sx={{
                    backgroundColor: 'background.paper',
                    py: 6,
                    textAlign: 'center'
                }}
            >
                <Container maxWidth="md">

                    <Typography variant="h6" sx={{ mb: 3 }}>
                        Join OC Bank and experience modern, secure, and convenient banking.
                    </Typography>
                    <Button
                        component={Link}
                        to="/signup"
                        variant="contained"
                        color="primary"
                        size="large"
                    >
                        Open an Account
                    </Button>
                </Container>
            </Box>
        </Box>
    );
};

export default HomePage;