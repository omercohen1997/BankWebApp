import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const Signup = () => {
    const emailRef = useRef();

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailTouched, setEmailTouched] = useState(false);

    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const [message, setMessage] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [showVerification, setShowVerification] = useState(false);


    useEffect(() => {
        emailRef.current.focus();
    }, []);

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!validEmail) {
            setMessage('Please enter a valid email address.');
            return;
        }

        try {
            await axios.post('/auth/signup', { email, password, phoneNumber });
            setEmail('');
            setMessage('Signup successful! Please check your email for the verification code.');
            setShowVerification(true);
        } catch (error) {
            setMessage(error.response?.data?.message || 'An error occurred');
        }
    };

    const handleVerification = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            await axios.post('/auth/signup/verify-email', { email, code: verificationCode });
            setMessage('Email verified successfully!');
        } catch (error) {
            setMessage(error.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div>
            <h2>Signup</h2>
            {!showVerification ? (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            ref={emailRef}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={setEmailTouched} // same as: onBlur={() => setEmailTouched(true)}
                            onFocus={() => setEmailTouched(false)}
                            required
                        />
                        {emailTouched && email && !validEmail && (
                            <p style={{ color: 'red' }}>Please enter a valid email address.</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="phoneNumber">Phone Number:</label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Signup</button>
                </form>
            ) : (
                <form onSubmit={handleVerification}>
                    <div>
                        <label htmlFor="verificationCode">Verification Code:</label>
                        <input
                            type="text"
                            id="verificationCode"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Verify Email</button>
                </form>
            )}
            {message && <p>{message}</p>}
        </div>
    );
};

export default Signup;
