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
    const [paymentInfo, setPaymentInfo] = useState({
        cardHolderName: '',
        cardNumber: '',
        cardExpirationDate: '',
        cardCVC: '',
    });
    const [showPaymentForm, setShowPaymentForm] = useState(false);

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
    const handlePaymentInfoChange = (e) => {
        setPaymentInfo({ ...paymentInfo, [e.target.name]: e.target.value });
    };
    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        // Ici, ajoutez la logique pour envoyer les informations de paiement au service de paiement
        // Assurez-vous que la communication avec le service de paiement est sécurisée
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
    const handleDeleteAccount = async () => {
        // Ici, ajoutez la logique pour envoyer une requête de suppression de compte
        // Par exemple, vous pourriez faire une requête DELETE à votre API
        try {
            const response = await axios.delete(`http://localhost:3000/users/${authUser.id}`);
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
                {/* <div>
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
                </div> */}
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
    <label htmlFor="cardHolderName">Nom sur la carte :</label>
    <input
        type="text"
        id="cardHolderName"
        name="cardHolderName"
        value={paymentInfo.cardHolderName}
        onChange={handlePaymentInfoChange}
    />
</div>
<div>
    <label htmlFor="cardNumber">Numéro de la carte :</label>
    <input
        type="text"
        id="cardNumber"
        name="cardNumber"
        value={paymentInfo.cardNumber}
        onChange={handlePaymentInfoChange}
    />
</div>
<div>
    <label htmlFor="cardExpirationDate">Date d'expiration (MM/YY) :</label>
    <input
        type="text"
        id="cardExpirationDate"
        name="cardExpirationDate"
        value={paymentInfo.cardExpirationDate}
        onChange={handlePaymentInfoChange}
    />
</div>
<div>
    <label htmlFor="cardCVC">CVC :</label>
    <input
        type="text"
        id="cardCVC"
        name="cardCVC"
        value={paymentInfo.cardCVC}
        onChange={handlePaymentInfoChange}
    />
</div>
                    <button type="submit">Soumettre la méthode de paiement</button>
                </form>
            )}



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
