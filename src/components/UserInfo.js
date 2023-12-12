import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom'; 
import './style.css';

const UserInfo = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [editableInfo, setEditableInfo] = useState(null);
    const [updateMessage, setUpdateMessage] = useState(''); 
    const [Message, setMessage] = useState(''); 
    const { authUser, logout } = useContext(AuthContext);
    const navigate = useNavigate(); 
    const [paymentInfo, setPaymentInfo] = useState({
        type: '',
        cardNumber: '',
        threeDigitCode: '',
        user_id: authUser.id
    });
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const backendUrl = "http://127.0.0.1:3000";

    useEffect(() => {
        if (authUser && authUser.id) {
            //axios.get(`http://localhost:3000/users/${authUser.id}`)
            axios.get(`${backendUrl}/users/${authUser.id}`)

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
    const handlePaymentInfoChange = (e) => {
        setPaymentInfo({ ...paymentInfo, [e.target.name]: e.target.value });
    };
    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://172.17.35.228:3000/api/payment-method`, paymentInfo);
            if (response.status === 200) {
                console.log("A new payment method has been added")
                setMessage('A new payment method has been added.'); // Message de confirmation
            } else {

                setMessage('Erreur lors de la mise à jour.'); // Message d'erreur
            }
        } catch (error) {
            console.error(error);
            setMessage('Erreur lors de la mise à jour.'); // Message d'erreur
        }

        // Ici, ajoutez la logique pour envoyer les informations de paiement au service de paiement
        // Assurez-vous que la communication avec le service de paiement est sécurisée
    };
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            // const response = await axios.put(`http://localhost:3000/users/${authUser.id}`, editableInfo);
            const response = await axios.put(`${backendUrl}/users/${authUser.id}`, editableInfo);
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
    const handleDeleteAccount = async () => {
        // Ici, ajoutez la logique pour envoyer une requête de suppression de compte
        // Par exemple, vous pourriez faire une requête DELETE à votre API
        try {
            // const response = await axios.delete(`http://localhost:3000/users/${authUser.id}`);
            const response = await axios.delete(`${backendUrl}/users/${authUser.id}`);

            if (response.status === 204) {
                // Gérez la suppression réussie ici, par exemple :
                logout(); // Déconnectez l'utilisateur
                navigate('/log-in'); // Redirigez vers la page de connexion
            } else {
                // Gérez les erreurs ici
            }
        } catch (error) {
            console.error('Erreur lors de la suppression du compte', error);
            // Gérez les erreurs ici
        }
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

                <button type="submit">Mettre à jour</button>
            </form>
            {updateMessage && <p>{updateMessage}</p>} {/* Affichage du message */}
            <div>

            <button onClick={() => setShowPaymentForm(!showPaymentForm)}>
                Ajouter une méthode de paiement
            </button>

            {showPaymentForm && (
                <form onSubmit={handlePaymentSubmit}>
                    <div>
        <label htmlFor="type">Card type:</label>
        <input
            type="text"
            id="type"
            name="type"
            value={paymentInfo.type}
            onChange={handlePaymentInfoChange}
        />
    </div>
    <div>
        <label htmlFor="cardNumber">CardNumber :</label>
        <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={paymentInfo.cardNumber}
            onChange={handlePaymentInfoChange}
        />
    </div>
    <div>
        <label htmlFor="threeDigitCode">threeDigitCode :</label>
        <input
            type="text"
            id="threeDigitCode"
            name="threeDigitCode"
            value={paymentInfo.threeDigitCode}
            onChange={handlePaymentInfoChange}
        />
    </div>

        <button type="submit">Soumettre la méthode de paiement</button>
        </form>
        )}
        {Message && <p>{Message}</p>} {/* Affichage du message */}
    <div>
    <button onClick={handleLogout}>Déconnexion</button> {/* Ajout du bouton de déconnexion */} - {/* Bouton pour supprimer le compte */}
                <button onClick={handleDeleteAccount} className="delete-account-btn">
                    Supprimer le compte
                </button>
    </div>
    </div>
    </div>
    );
};

export default UserInfo;
