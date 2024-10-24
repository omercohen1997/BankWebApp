import React, { useState, useRef, useEffect } from 'react';
import axios from '../api/axios'

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{6,20}$/;
const PHONE_NUMBER_REGEX = /^05\d(-\d{7}|\d{7})$/;

const Signup = () => {
    const emailRef = useRef();

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
        setEmail('');
        setLoading(true);

        try {
            await axios.post('/auth/signup/verify-email', { email, code: verificationCode });
            setMessage('Email verified successfully!');
            setVerificationCode('');
        } catch (error) {
            setMessage(error.response?.data?.message || 'An error occurred');
        } finally {
            setLoading(false);
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
                            onBlur={setEmailFocus} // same as: onBlur={() => setEmailFocus(true)}
                            onFocus={() => setEmailFocus(false)}
                            required
                        />
                        {//TODO: reuse
                            emailFocus && email && !validEmail && (
                                <p style={{ color: 'red', fontSize: '0.9em', fontWeight: 'normal', marginTop: '5px' }}>
                                    Enter a valid email address.
                                </p>
                            )}
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={setPasswordFocus}
                            onFocus={() => setPasswordFocus(false)}
                            required
                        />
                        {passwordFocus && password && !validPassword && (
                            <p style={{ color: 'red', fontSize: '0.9em', fontWeight: 'normal', marginTop: '5px' }}>
                                Password must be 6-20 characters and include at least one of each: lowercase and uppercase letter, digit, and special character.
                            </p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="confirmPassword">Confirm Password:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onBlur={setConfirmPasswordFocus}
                            onFocus={() => setConfirmPasswordFocus(false)}
                            required
                        />
                        {confirmPasswordFocus && confirmPassword && !validConfirmPassword && (
                            <p style={{ color: 'red', fontSize: '0.9em', fontWeight: 'normal', marginTop: '5px' }}>
                                The passwords must match.
                            </p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="phoneNumber">Phone Number:</label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            onBlur={setPhoneNumberFocus}
                            onFocus={() => setPhoneNumberFocus(false)}
                            required
                        />
                        {phoneNumberFocus && phoneNumber && !validPhoneNumber && (
                            <p style={{ color: 'red', fontSize: '0.9em', fontWeight: 'normal', marginTop: '5px' }}>
                                Phone number format must be: 05X-XXXXXXX or 05XXXXXXXX
                            </p>
                        )}
                    </div>
                    <button type="submit" disabled={loading}>Signup</button>
                    {/* Show loading text or spinner */}
                    {loading && <p style={{ color: 'blue' }}>Loading...</p>}
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
                    <button type="submit" disabled={loading}>Verify Email</button>
                    {loading && <p style={{ color: 'blue' }}>Verifying...</p>}
                </form>
            )}
            {message && <p>{message}</p>}
        </div>
    );
};

export default Signup;
