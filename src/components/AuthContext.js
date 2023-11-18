import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(null);

    const login = (user) => {
        setAuthUser(user);
    };

    const logout = () => {
        setAuthUser(null);
    };

    return (
        <AuthContext.Provider value={{ authUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
