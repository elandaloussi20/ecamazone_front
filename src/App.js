import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignIn from './components/SignIn';
import LogIn from './components/LogIn';
import UserInfo from './components/UserInfo';
import { AuthProvider } from './components/AuthContext';

const App = () => {
    return (
        <AuthProvider>
<Router>
    <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/log-in" element={<LogIn />} />
        <Route path="/user-info" element={<UserInfo />} />
        {/* Redirection vers LogIn si aucune route ne correspond */}
        <Route path="*" element={<Navigate to="/log-in" replace />} />
    </Routes>
</Router>
        </AuthProvider>
    );
};

export default App;
