import React, { useState, useEffect, useContext } from 'react'; 
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom'; 
import './style.css';

const UserInfo = () => {
    const [editableMode, setEditableMode] = useState(false); //user info appears but not editable, until user clicks "update" btn
    const [userInfo, setUserInfo] = useState(null);
    const [editableInfo, setEditableInfo] = useState(null);
    const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
    const [updateMessage, setUpdateMessage] = useState(''); 
    const [Message, setMessage] = useState(''); 
    const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' });
    const { authUser, logout } = useContext(AuthContext);

    const [addresses, setAddresses] = useState([]);
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [editedAddress, setEditedAddress] = useState({});

    const navigate = useNavigate(); 
    const [paymentInfo, setPaymentInfo] = useState({
        type: '',
        cardNumber: '',
        threeDigitCode: '',
        user_id: authUser.id
    });

    const [newAddress, setNewAddress] = useState({
        street: '',
        city: '',
        zipCode: '',
        country: ''
    });

    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [messageType, setMessageType] = useState('');

    const backendUrl = "http://127.0.0.1:3000";

    const loadAddresses = () => {
        if (authUser && authUser.id) {
            axios.get(`${backendUrl}/users/${authUser.id}/addresses`)
                .then(response => {
                    setAddresses(response.data);
                })
                .catch(error => {
                    console.error(error);
                    // possible error msg (afficher à l'utilisateur)
                });
        }
    };

    useEffect(() => {
        if (authUser && authUser.id) {
            loadAddresses();

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
    
    const handleToggleEditableMode = () => {
        //make user info editable
        setEditableMode(!editableMode);
    }

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
                setUserInfo(editableInfo); // Mettre à jour userInfo avec les données éditées
                setUpdateMessage('Successfully updated user info.');
                setMessageType('success');
                setEditableMode(false); // Optionnel, pour sortir du mode édition
                // ...
            }
             else {
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
                setUpdateMessage('Successfully Updated Password.');
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

    //Handle Addresses
    const handleAddAddress = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${backendUrl}/users/${authUser.id}/addresses`, newAddress);
            if (response.status === 201) {
                // Ajoutez la nouvelle adresse à votre état local 'addresses'
                setAddresses([...addresses, response.data]);
                // Réinitialisez le formulaire
                setNewAddress({ street: '', city: '', zipCode: '', country: '' });
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'adresse', error);
            // Gérez l'erreur ici
        }
    };
    const startEditing = (address) => {
        setEditingAddressId(address.id);
        setEditedAddress({...address});
    };
    const handleUpdateAddress = async (addressId, updatedAddress) => {
        try {
            const response = await axios.put(`${backendUrl}/addresses/${addressId}`, updatedAddress);
            if (response.status === 200) {
                // Mise à jour de l'état local avec la nouvelle adresse
                setAddresses(addresses.map(address => address.id === addressId ? {...address, ...updatedAddress} : address));
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'adresse', error);
            // Gérez l'erreur ici
        }
    };
    const saveAddress = async (addressId) => {
        try {
            // Utilisation de handleUpdateAddress pour envoyer les modifications
            await handleUpdateAddress(addressId, editedAddress);
    
            // Réinitialisation de l'état d'édition
            setEditingAddressId(null);
            setEditedAddress({});
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de l\'adresse', error);
            // Gérez l'erreur ici
        }
    };
    const handleDeleteAddress = async (addressId) => {
        try {
            const response = await axios.delete(`${backendUrl}/addresses/${addressId}`);
            if (response.status === 204) {
                // Supprimer l'adresse de l'état local
                setAddresses(addresses.filter(address => address.id !== addressId));
            }
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'adresse', error);
            // Gérez l'erreur ici
        }
    };

    if (!userInfo) return <div>Loading...</div>;

    return (
        <div>
            <div className="container-user" >
                <div> </div>
                <h2>User Information</h2>
                <div> </div>
            </div>
        <div className="container-user">
            <div className="info-column">
                {editableMode ? (
                    <form onSubmit={handleUpdate}>
                        {/* User info inputs */}
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
                        <button type="submit">Update</button>
                    </form>
                ) : (
                    <div>
                        <h3>Personal information</h3>
                        <p><b>Username:</b> {userInfo.username}</p>
                        <p><b>First and Last Name:</b> {userInfo.fullName}</p>
                        <p><b>Email Address:</b> {userInfo.email}</p>
                        <p><b>Phone Number:</b> {userInfo.phoneNumber}</p>
                        <button onClick={handleToggleEditableMode}>Update</button>
                    </div>
                )}
                {updateMessage && <p className={`${messageType}-message`}>{updateMessage}</p>}

                
                    <h3>Adresses</h3>
                    <div className="addresses">
                        {addresses.map((address) => (
                        <div key={address.id} className="address">
                            {editingAddressId === address.id ? (
                            <div>
                                <input
                                type="text"
                                value={editedAddress.street || address.street}
                                onChange={e => setEditedAddress({...editedAddress, street: e.target.value})}
                                />
                                <input
                                    type="text"
                                    value={editedAddress.city || address.city}
                                    onChange={e => setEditedAddress({...editedAddress, city: e.target.value})}
                                />
                                <input
                                    type="text"
                                    value={editedAddress.zipCode || address.zipCode}
                                    onChange={e => setEditedAddress({...editedAddress, zipCode: e.target.value})}
                                />
                                <input
                                    type="text"
                                    value={editedAddress.country || address.country}
                                    onChange={e => setEditedAddress({...editedAddress, country: e.target.value})}
                                />
                            </div>
                        ) : (
                            
                            <div className='address-list'>
                                <p>Street: {address.street}</p>
                                <p>City: {address.city}</p>
                                <p>Postal Code: {address.zipCode}</p>
                                <p>Country: {address.country}</p>
                            </div>
                        )}
                        {editingAddressId === address.id ? (
                                <button onClick={() => saveAddress(address.id)}>Save</button>
                            ) : (
                                <button onClick={() => startEditing(address)}>Edit</button>
                            )}
                            -
                            <button onClick={() => handleDeleteAddress(address.id)}>Delete</button>
                    </div>
                    ))}
                </div>
            
            </div>
            {/* addresses part */}
            
            

            <div className="card-column">
                {/* addresses part  */}
                <h3>Add an address</h3>
                <form onSubmit={handleAddAddress} className='address-form'>
                    <div>
                        <label htmlFor="street">Street:</label>
                        <input
                            type="text"
                            id="street"
                            name="street"
                            value={newAddress.street}
                            onChange={e => setNewAddress({...newAddress, street: e.target.value})}
                        />
                    </div>
                    <div>
                    <label htmlFor="city">City:</label>
                    <input
                        type="text"
                        id="city"
                        name="city"
                        value={newAddress.city}
                        onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                    />
                    </div>
                <div>
                    <label htmlFor="zipCode">Postal Code:</label>
                    <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={newAddress.zipCode}
                        onChange={e => setNewAddress({...newAddress, zipCode: e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="country">Country:</label>
                    <input
                        type="text"
                        id="country"
                        name="country"
                        value={newAddress.country}
                        onChange={e => setNewAddress({...newAddress, country: e.target.value})}
                    />
                </div>
                <button type="submit" className='address-btn'>Add this address</button>
            </form>


            <button onClick={toggleChangePasswordForm}>Change Password</button>
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
{/* {updateMessage && <p className={`${messageType}-message`}>{updateMessage}</p>} */}
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

        <button type="submit">Update Card Info</button>
        </form>
        )}
        {Message && <p className={`${messageType}-message`}>{Message}</p>}

    <div>
    <button onClick={handleLogout} className="logout-btn">Log Out</button> {/* Ajout du bouton de déconnexion */} {/* Bouton pour supprimer le compte */}
                <button onClick={handleDeleteAccount} className="delete-account-btn">
                    Delete Account
                </button>
    </div>
    </div>
    </div>
    </div>
    </div>
    );
};

export default UserInfo;