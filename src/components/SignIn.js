import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './style.css';



const SignIn = () => {
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const navigate = useNavigate();
    const handleGoToLogin = () => {
        navigate('/log-in'); // Assurez-vous que le chemin est correct
    };


    const [formData, setFormData] = useState({
        username: '',
        fullName: '',
        email: '',
        phoneNumber: '',
        shippingAddress: '',
        password: ''
    });
    const backendUrl = "http://127.0.0.1:3000";


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            //await axios.post('http://localhost:3000/users', formData);
            await axios.post(`${backendUrl}/users`, formData);

            setMessage('Inscription réussie.'); // Afficher le message de confirmation
            setMessageType('success');

        } catch (error) {
            console.error(error);
            setMessage('Erreur lors de l\'inscription.'); // Afficher un message d'erreur
            setMessageType('error');

        }
    };

    return (
        <div className="container">
            <h2>Inscription</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">username :</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="fullName">fullName :</label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="email">Email :</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="phoneNumber">phoneNumber :</label>
                    <input
                        type="text"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="shippingAddress">shippingAddress :</label>
                    <input
                        type="text"
                        id="shippingAddress"
                        name="shippingAddress"
                        value={formData.shippingAddress}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="password">Mot de passe :</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">S'inscrire</button>
                {message && <p className={`${messageType}-message`}>{message}</p>}

            </form>
            <div>
            <button type="button" onClick={handleGoToLogin}>Se connecter</button> {/* Ajout du bouton pour revenir à la connexion */}

            </div>

        </div>
    );
};

export default SignIn;
