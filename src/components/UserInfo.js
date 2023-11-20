import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom'; // Importez useNavigate
import './style.css';

const UserInfo = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [editableInfo, setEditableInfo] = useState(null);
    const [updateMessage, setUpdateMessage] = useState(''); // État pour le message de confirmation
    const { authUser, logout } = useContext(AuthContext);
    const navigate = useNavigate(); // Utilisez useNavigate pour la redirection


    useEffect(() => {
        if (authUser && authUser.id) {
            axios.get(`http://localhost:3000/users/${authUser.id}`)
                .then(response => {
                    setUserInfo(response.data);
                    setEditableInfo(response.data); // Initialise les informations éditables
                })
                .catch(error => console.error(error));
        }
    }, [authUser]);

    const handleChange = (e) => {
        setEditableInfo({ ...editableInfo, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:3000/users/${authUser.id}`, editableInfo);
            if (response.status === 200) {
                setUpdateMessage('Informations mises à jour avec succès.'); // Message de confirmation
            } else {
                setUpdateMessage('Erreur lors de la mise à jour.'); // Message d'erreur
            }
        } catch (error) {
            console.error(error);
            setUpdateMessage('Erreur lors de la mise à jour.'); // Message d'erreur
        }
    };
    const handleLogout = () => {
        logout(); // Appelle la fonction de déconnexion de AuthContext
        navigate('/log-in'); // Redirige vers la page de connexion
    };

    if (!userInfo) return <div>Chargement...</div>;

    return (
        <div className="container">
            <h2>Informations de l'utilisateur</h2>
            <form onSubmit={handleUpdate}>
                <div>
                    <label htmlFor="username">username :</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={editableInfo.username}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="fullName">fullName :</label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={editableInfo.fullName}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="email">Email :</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={editableInfo.email}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="phoneNumber">phoneNumber :</label>
                    <input
                        type="text"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={editableInfo.phoneNumber}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="shippingAddress">shippingAddress :</label>
                    <input
                        type="text"
                        id="shippingAddress"
                        name="shippingAddress"
                        value={editableInfo.shippingAddress}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="billingAddress">billingAddress :</label>
                    <input
                        type="text"
                        id="billingAddress"
                        name="billingAddress"
                        value={editableInfo.billingAddress}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="cardHolderName">cardHolderName :</label>
                    <input
                        type="text"
                        id="cardHolderName"
                        name="cardHolderName"
                        value={editableInfo.cardHolderName}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="cardLastFourDigits">cardLastFourDigits :</label>
                    <input
                        type="text"
                        id="cardLastFourDigits"
                        name="cardLastFourDigits"
                        value={editableInfo.cardLastFourDigits}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="cardExpirationDate">cardExpirationDate :</label>
                    <input
                        type="text"
                        id="cardExpirationDate"
                        name="cardExpirationDate"
                        value={editableInfo.cardExpirationDate}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="cardType">cardType :</label>
                    <input
                        type="text"
                        id="cardType"
                        name="cardType"
                        value={editableInfo.cardType}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Mettre à jour</button>
            </form>
            {updateMessage && <p>{updateMessage}</p>} {/* Affichage du message */}
            <div>
            <button onClick={handleLogout}>Déconnexion</button> {/* Ajout du bouton de déconnexion */}

            </div>


        </div>
    );
};

export default UserInfo;
