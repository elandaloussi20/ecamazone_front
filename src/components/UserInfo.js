import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom'; 
import './style.css';

const UserInfo = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [editableInfo, setEditableInfo] = useState(null);
    const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
    const [updateMessage, setUpdateMessage] = useState(''); 
    const [Message, setMessage] = useState(''); 
    const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' });
    const { authUser, logout } = useContext(AuthContext);
    const navigate = useNavigate(); 
    const [paymentInfo, setPaymentInfo] = useState({
        type: '',
        cardNumber: '',
        threeDigitCode: '',
        user_id: authUser.id
    });
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [messageType, setMessageType] = useState('');

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
                setMessageType('success');

            } else {

                setMessage('Update Error.'); // Message d'erreur
                setMessageType('error');

            }
        } catch (error) {
            console.error(error);
            setMessage('Update Error.'); // Message d'erreur
            setMessageType('error');

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
                setUpdateMessage('Successfully updated user info.'); // Message de confirmation
                setMessageType('success');

            } else {
                setUpdateMessage('Update Error.'); // Message d'erreur
                setMessageType('error');

            }
        } catch (error) {
            console.error(error);
            setUpdateMessage('Update Error.'); // Message d'erreur
            setMessageType('error');

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
            console.error('Error Deleting Account', error);
            // Gérez les erreurs ici
        }
    };
    const toggleChangePasswordForm = () => {
        setShowChangePasswordForm(!showChangePasswordForm);
    };
    const handlePasswordChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };
    
    const handleSubmitPasswordChange = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${backendUrl}/change-password/${authUser.id}`, passwords);
            if (response.status === 200) {
                setUpdateMessage('Successfully Updated Psasword.');
                setMessageType('success');

            } else {
                setUpdateMessage('Password Update Error.');
                setMessageType('error');

            }
        } catch (error) {
            console.error(error);
            setUpdateMessage('Password Update Error.');
            setMessageType('error');

        }
    };

    if (!userInfo) return <div>Loading...</div>;

    return (
        <div className="container">
            <h2>User Information</h2>
            <form onSubmit={handleUpdate}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={editableInfo.username}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="fullName">First and Last Name :</label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={editableInfo.fullName}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="email">Email Address:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={editableInfo.email}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="phoneNumber">Phone Number:</label>
                    <input
                        type="text"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={editableInfo.phoneNumber}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="shippingAddress">Shipping Address:</label>
                    <input
                        type="text"
                        id="shippingAddress"
                        name="shippingAddress"
                        value={editableInfo.shippingAddress}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit">Update</button>
            </form>
            <button onClick={toggleChangePasswordForm}>Modifier le mot de passe</button>
            {showChangePasswordForm && (
                    <form onSubmit={handleSubmitPasswordChange}>
                    <div>
                        <label htmlFor="oldPassword">Previous Password:</label>
                        <input
                            type="password"
                            id="oldPassword"
                            name="oldPassword"
                            value={passwords.oldPassword}
                            onChange={handlePasswordChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="newPassword">New Password:</label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={passwords.newPassword}
                            onChange={handlePasswordChange}
                        />
                    </div>
                    <button type="submit">Update Password</button>
                    </form>
            )}
{updateMessage && <p className={`${messageType}-message`}>{updateMessage}</p>}
            <div>

            <button onClick={() => setShowPaymentForm(!showPaymentForm)}>
                Add a Payment Method
            </button>

            {showPaymentForm && (
                <form onSubmit={handlePaymentSubmit}>
                    <div>
        <label htmlFor="type">Card Type:</label>
        <input
            type="text"
            id="type"
            name="type"
            value={paymentInfo.type}
            onChange={handlePaymentInfoChange}
        />
    </div>
    <div>
        <label htmlFor="cardNumber">Card Number:</label>
        <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={paymentInfo.cardNumber}
            onChange={handlePaymentInfoChange}
        />
    </div>
    <div>
        <label htmlFor="threeDigitCode">Three-digit Code:</label>
        <input
            type="text"
            id="threeDigitCode"
            name="threeDigitCode"
            value={paymentInfo.threeDigitCode}
            onChange={handlePaymentInfoChange}
        />
    </div>

        <button type="submit">Log Out</button>
        </form>
        )}
        {Message && <p className={`${messageType}-message`}>{Message}</p>}

    <div>
    <button onClick={handleLogout}>Log Out</button> {/* Ajout du bouton de déconnexion */} - {/* Bouton pour supprimer le compte */}
                <button onClick={handleDeleteAccount} className="delete-account-btn">
                    Delete Account
                </button>
    </div>
    </div>
    </div>
    );
};

export default UserInfo;
