import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import './style.css';

const LogIn = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const { login } = useContext(AuthContext);
    const [errorMessage, setErrorMessage] = useState('');

    const backendUrl = "http://127.0.0.1:3000";


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleGoToSignUp = () => {
        navigate('/sign-in'); // Assurez-vous que le chemin est correct
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            //const response = await axios.post('http://localhost:3000/login', formData);
            const response = await axios.post(`${backendUrl}/login`, formData);

            if (response.status === 200) {
                login({ id: response.data.id }); // Mise à jour de l'état d'authentification avec l'ID
                navigate('/user-info'); // Navigation vers la page des informations de l'utilisateur
            } else {
                // Gérer les autres réponses
            }
        } catch (error) {
            console.error(error);
            setErrorMessage('Username/Password is incorrect.');

            // Afficher un message d'erreur à l'utilisateur
        }
    };
    

    return (
        <div className="container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Sign In</button>
            </form>
            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <div>
            <button type="button" onClick={handleGoToSignUp}>Sign Up</button> {/* Ajout du bouton */}
            </div>
        </div>
    );
};

export default LogIn;
