import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress
} from '@mui/material';
import {
  AccountBalance,
  Send as SendIcon,
  ArrowUpward,
  ArrowDownward
} from '@mui/icons-material';
import axios from '../api/axios';

const Dashboard = () => {
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [receiverEmail, setReceiverEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMoney, setSendingMoney] = useState(false);

  useEffect(() => {
    Promise.all([fetchBalance(), fetchTransactions()])
      .finally(() => setLoading(false));
  }, []);

  const fetchBalance = async () => {
    try {
      const response = await axios.get('/users/balance');
      setBalance(response.data.balance);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch balance');
      console.error('Balance fetch error:', err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('/transactions');
      setTransactions(response.data.transactions);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch transactions');
      console.error('Transactions fetch error:', err);
    }
  };

  const handleSendMoney = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSendingMoney(true);

    try {
      const response = await axios.post('/transactions/send', {
        receiverEmail,
        amount: parseFloat(amount)
      });
      
      setSuccess('Transaction completed successfully');
      setReceiverEmail('');
      setAmount('');
      await Promise.all([fetchBalance(), fetchTransactions()]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send money');
      console.error('Send money error:', err);
    } finally {
      setSendingMoney(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Balance Display */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'primary.main',
              color: 'white'
            }}
            elevation={3}
          >
            <AccountBalance sx={{ fontSize: 40, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Current Balance
            </Typography>
            <Typography variant="h3">
              ${balance?.toFixed(2) ?? '0.00'}
            </Typography>
          </Paper>
        </Grid>

        {/* Send Money Form */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }} elevation={3}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SendIcon /> Send Money
            </Typography>
            <Box component="form" onSubmit={handleSendMoney} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Receiver's Email"
                type="email"
                value={receiverEmail}
                onChange={(e) => setReceiverEmail(e.target.value)}
                required
                margin="normal"
                disabled={sendingMoney}
              />
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                margin="normal"
                inputProps={{ min: "0.01", step: "0.01" }}
                disabled={sendingMoney}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                startIcon={sendingMoney ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                disabled={sendingMoney}
              >
                {sendingMoney ? 'Sending...' : 'Send Money'}
              </Button>
            </Box>
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {success}
              </Alert>
            )}
          </Paper>
        </Grid>

        {/* Transaction History */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }} elevation={3}>
            <Typography variant="h6" gutterBottom>
              Transaction History
            </Typography>
            <List>
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <React.Fragment key={transaction._id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Typography variant="body1">
                            {`To: ${transaction.receiverEmail}`}
                          </Typography>
                        }
                        secondary={new Date(transaction.createdAt).toLocaleDateString()}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ArrowUpward color="error" />
                        <Typography
                          variant="body1"
                          color="error"
                          sx={{ fontWeight: 'medium' }}
                        >
                          -${transaction.amount.toFixed(2)}
                        </Typography>
                      </Box>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))
              ) : (
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography variant="body1" color="text.secondary" align="center">
                        No transactions found
                      </Typography>
                    }
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
