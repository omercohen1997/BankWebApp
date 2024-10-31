import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, CircularProgress, Alert } from '@mui/material';
import axios from '../api/axios'

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{6,20}$/;
const PHONE_NUMBER_REGEX = /^05\d(-\d{7}|\d{7})$/;

const Signup = () => {
  const emailRef = useRef();
  const navigate = useNavigate(); 

  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState('');
  const [validConfirmPassword, setValidConfirmPassword] = useState(false);
  const [confirmPasswordFocus, setConfirmPasswordFocus] = useState(false);


  const [phoneNumber, setPhoneNumber] = useState('');
  const [validPhoneNumber, setValidPhoneNumber] = useState(false);
  const [phoneNumberFocus, setPhoneNumberFocus] = useState(false);


  const [message, setMessage] = useState('');

  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    emailRef.current.focus();
  }, []);


  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email])


  useEffect(() => {
    setValidPassword(PASSWORD_REGEX.test(password));
    setValidConfirmPassword(password === confirmPassword);
  }, [password, confirmPassword])


  useEffect(() => {
    setValidPhoneNumber(PHONE_NUMBER_REGEX.test(phoneNumber));
  }, [phoneNumber])



  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!validEmail) {
      setMessage('Invalid email');
      return;
    }

    if (!validPassword) {
      setMessage('Invalid password')
      return;
    }

    if (!validConfirmPassword) {
      setMessage('The passwords do not match');
      return;
    }
    if (!validPhoneNumber) {
      setMessage('Invalid Phone Number')
      return;
    }

    setLoading(true);

    try {
      await axios.post('/auth/signup', { email, password, phoneNumber });
      //setEmail(''); i cleared it after the vertification so i can just show the passcode textbox.
      setPassword('');
      setConfirmPassword('');
      setPhoneNumber('');
      setVerificationCode(''); //TODO:redundant: the state will change only after the signup in setVerificationCode
      setMessage('Signup successful! Please check your email for the verification code.');
      setShowVerification(true);

    } catch (error) {
      if (!error?.response) {
        setMessage('No Server Response');
      } else if (error.response?.status === 409) {
        setMessage('Username Taken');
      } else {
        setMessage('Registration Failed')
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    setMessage('');
    //setEmail('');
    setLoading(true);

    try {
      await axios.post('/auth/signup/verify-email', { email, code: verificationCode });
      setMessage('Email verified successfully!');
      setVerificationCode('');
      //TODO:: add the history think (from, { replace: true } ) like in login
      navigate('/login');
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', my: 4, p: 3, boxShadow: 3, borderRadius: 2 }}>
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
        Signup
      </Typography>


      {message && (
        <Alert severity={message.includes('successful') ? 'success' : 'error'} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      {!showVerification ? (
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            inputRef={emailRef}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setEmailFocus(false)}
            onBlur={() => setEmailFocus(true)}
            error={!validEmail && emailFocus && email}
            helperText={!validEmail && emailFocus && email && 'Enter a valid email address.'}
            required
            margin="normal"
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setPasswordFocus(false)}
            onBlur={() => setPasswordFocus(true)}
            error={!validPassword && passwordFocus && password}
            helperText={
              !validPassword && passwordFocus && password &&
              'Password must be 6-20 characters with uppercase, lowercase, digit, and special character.'
            }
            required
            margin="normal"
          />
          <TextField
            label="Confirm Password"
            variant="outlined"
            fullWidth
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onFocus={() => setConfirmPasswordFocus(false)}
            onBlur={() => setConfirmPasswordFocus(true)}
            error={!validConfirmPassword && confirmPasswordFocus && confirmPassword}
            helperText={!validConfirmPassword && confirmPasswordFocus && confirmPassword &&
              'Passwords must match.'}
            required
            margin="normal"
          />
          <TextField
            label="Phone Number"
            variant="outlined"
            fullWidth
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            onFocus={() => setPhoneNumberFocus(false)}
            onBlur={() => setPhoneNumberFocus(true)}
            error={!validPhoneNumber && phoneNumberFocus && phoneNumber}
            helperText={
              !validPhoneNumber && phoneNumberFocus &&
              phoneNumber && 'Phone format: 05X-XXXXXXX or 05XXXXXXXX'
            }
            required
            margin="normal"
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Signup'}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerification}>
          <TextField
            label="Verification Code"
            variant="outlined"
            fullWidth
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Verify Email'}
          </Button>
        </form>
      )}
    </Box>
  );
};

export default Signup;