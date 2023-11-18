import React, { useState } from 'react';
import axios from 'axios';

const SignIn = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        address: '',
        paymentMethod: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/users', formData);
            // Implémentez une redirection ou affichez un message de confirmation ici
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h2>Inscription</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Nom d'utilisateur :</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
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
                    <label htmlFor="address">Adresse :</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="paymentMethod">Méthode de paiement :</label>
                    <input
                        type="text"
                        id="paymentMethod"
                        name="paymentMethod"
                        value={formData.paymentMethod}
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
                <button type="submit">Inscrire</button>
            </form>
        </div>
    );
};

export default SignIn;
