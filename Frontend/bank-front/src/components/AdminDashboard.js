import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Alert,
  TablePagination,
  Container,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HistoryIcon from '@mui/icons-material/History';
import CloseIcon from '@mui/icons-material/Close';
import axios from '../api/axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // New state for transactions
  const [selectedUser, setSelectedUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [transactionError, setTransactionError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/users/all-users');
        setUsers(response.data);
        setFilteredUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.email.toLowerCase().includes(searchEmail.toLowerCase())
    );
    setFilteredUsers(filtered);
    setPage(0);
  }, [searchEmail, users]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Updated function to fetch user transactions
  const fetchUserTransactions = async (user) => {
    setTransactionLoading(true);
    setTransactionError('');
    try {
      const response = await axios.get(`/transactions/user/${user.email}`);
      setTransactions(response.data.transactions || []);
    } catch (err) {
      if (err.response?.status === 404) {
        // Handle the "No transactions found" case
        setTransactions([]);
      } else {
        setTransactionError('Failed to fetch transactions. ' + (err.response?.data?.message || ''));
      }
    } finally {
      setTransactionLoading(false);
    }
  };

  // Handle opening transaction dialog
  const handleOpenTransactions = (user) => {
    setSelectedUser(user);
    fetchUserTransactions(user);
  };

  // Handle closing transaction dialog
  const handleCloseTransactions = () => {
    setSelectedUser(null);
    setTransactions([]);
    setTransactionError('');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" gutterBottom component="div">
            Admin Dashboard
          </Typography>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Filter by email"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            sx={{ mt: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <TableContainer component={Paper} elevation={0}>
          <Table sx={{ minWidth: 650 }} aria-label="user table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Balance</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Phone Number</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow
                    key={user._id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>{user.email}</TableCell>
                    <TableCell>${user.balance?.toFixed(2) || '0.00'}</TableCell>
                    <TableCell>{user.phoneNumber || 'N/A'}</TableCell>
                    <TableCell>
                      <Tooltip title="View Transactions">
                        <IconButton
                          onClick={() => handleOpenTransactions(user)}
                          size="small"
                          color="primary"
                        >
                          <HistoryIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="body1" sx={{ py: 2 }}>
                      No users found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Paper>

      {/* Transactions Dialog */}
      <Dialog
        open={Boolean(selectedUser)}
        onClose={handleCloseTransactions}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Transactions - {selectedUser?.email}
            </Typography>
            <IconButton onClick={handleCloseTransactions}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {transactionLoading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : transactionError ? (
            <Alert severity="error">{transactionError}</Alert>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Sender</TableCell>
                    <TableCell>Receiver</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction._id}>
                      <TableCell>
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell>
                        ${transaction.amount?.toFixed(2) || '0.00'}
                      </TableCell>
                      <TableCell>{transaction.senderEmail}</TableCell>
                      <TableCell>{transaction.receiverEmail}</TableCell>
                    </TableRow>
                  ))}
                  {transactions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography variant="body1" sx={{ py: 2 }}>
                          No transactions found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;