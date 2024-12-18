import { createContext, useState, useEffect } from "react";

export const authContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const storedAuth = sessionStorage.getItem('auth');
        return storedAuth ? JSON.parse(storedAuth) : {};
    });


    useEffect(() => {
        if (auth?.accessToken) {
            sessionStorage.setItem('auth', JSON.stringify(auth));
        } else {
            sessionStorage.removeItem('auth');
        }
    }, [auth]);

    return (
        <authContext.Provider value={{ auth, setAuth }}>
            {children}
        </authContext.Provider>
    );

};
