import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

const UserInfo = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [editableInfo, setEditableInfo] = useState(null);
    const { authUser } = useContext(AuthContext);

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
            await axios.put(`http://localhost:3000/users/${authUser.id}`, editableInfo);
            // Gérer la réponse - par exemple, mettre à jour l'affichage des informations
        } catch (error) {
            console.error(error);
        }
    };

    if (!userInfo) return <div>Chargement...</div>;

    return (
        <div>
            <h2>Informations de l'utilisateur</h2>
            <form onSubmit={handleUpdate}>
                <div>
                    <label htmlFor="username">Nom d'utilisateur :</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={editableInfo.username}
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
                    <label htmlFor="address">Adresse :</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={editableInfo.address}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="paymentMethod">Méthode de paiement :</label>
                    <input
                        type="text"
                        id="paymentMethod"
                        name="paymentMethod"
                        value={editableInfo.paymentMethod}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Mettre à jour</button>
            </form>
        </div>
    );
};

export default UserInfo;
