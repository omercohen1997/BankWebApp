// src/Login.js
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { authContext } from '../context/AuthProvider';
import axios from '../api/axios'
const Login = () => {
    const { setAuth } = useContext(authContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

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

        console.log(email, password);

        try {

            const response = await axios.post('/auth/login', { email, password });

            const accessToken = response?.data?.accessToken;
            //const roles = response?.data?.role;
            //setAuth({email,roles,accessToken});
            setAuth({ accessToken });

            //localStorage.setItem('token', accessToken);

            setEmail('');
            setPassword('');

            navigate('/dashboard');
        } catch (err) {
            if (!err?.response) {
                setErrorMessage('No Server Response');
            } else if (err.response?.status === 400) {
                setErrorMessage('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrorMessage('Wrong email or password.');
            } else {
                setErrorMessage('Login Failed');
            }
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {errorMessage && <p> {errorMessage}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        ref={emailRef}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete='off'
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
