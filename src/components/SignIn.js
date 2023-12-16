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
        // shippingAddress: '',
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

            setMessage('Registration Successful.'); // Afficher le message de confirmation
            setMessageType('success');

        } catch (error) {
            console.error(error);
            setMessage('Registration Error.'); // Afficher un message d'erreur
            setMessageType('error');

        }
    };

    return (
        <div className="container">
            <h2>Inscription</h2>
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
                    <label htmlFor="fullName">First and Last Name:</label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="email">Email Address:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="phoneNumber">Phone Number:</label>
                    <input
                        type="text"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
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
                <button type="submit">S'inscrire</button>
                {message && <p className={`${messageType}-message`}>{message}</p>}

            </form>
            <div>
            <button type="button" onClick={handleGoToLogin}>Sign In</button> {/* Ajout du bouton pour revenir à la connexion */}

            </div>

        </div>
    );
};

export default SignIn;
