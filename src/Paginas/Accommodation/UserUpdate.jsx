import React, { useState } from 'react';
import axios from 'axios';
import './UserUpdate.css';

const UserUpdate = () => {
    const [clientCode, setClientCode] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        document: ''
    });

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Função para validar email
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Função para validar telefone (somente números)
    const validatePhone = (phone) => {
        const phoneRegex = /^[0-9]+$/;
        return phoneRegex.test(phone);
    };

    // Função para validar documento (somente letras e números)
    const validateDocument = (document) => {
        const documentRegex = /^[a-zA-Z0-9]+$/;
        return documentRegex.test(document);
    };

    // Função para buscar o cliente
    const handleSearchClient = async () => {
        if (!clientCode) {
            alert("Please enter a client code.");
            return;
        }

        setLoading(true);
        setErrorMessage('');
        try {
            const { data } = await axios.get(`http://localhost:5000/clients/${clientCode}`);

            if (data && Object.keys(data).length > 0) {
                setFormData(prevState => ({
                    ...prevState,
                    ...data
                }));
            } else {
                setErrorMessage("Client code not found.");
            }
        } catch (error) {
            console.error("Error fetching client:", error);
            setErrorMessage("Error fetching client. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Função para lidar com alterações nos campos
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Função para atualizar o cliente
    const handleUpdateClient = async (e) => {
        e.preventDefault();

        if (!clientCode) {
            alert("Please search for a client first.");
            return;
        }

        if (!validateEmail(formData.email)) {
            setErrorMessage("Invalid email format");
            return;
        }

        if (!validatePhone(formData.phone)) {
            setErrorMessage("Phone number must contain only numbers");
            return;
        }

        if (!validateDocument(formData.document)) {
            setErrorMessage("Document must contain only letters and numbers");
            return;
        }

        try {
            const response = await axios.put(`http://localhost:5000/clients/${clientCode}`, formData);

            // Verificar se a atualização foi bem-sucedida
            if (response.status === 200) {
                alert("Client updated successfully!");
            } else {
                alert("Unexpected response from the server.");
            }
        } catch (error) {
            console.error("Error updating client:", error);
            if (error.response?.data?.message?.includes("Document already exists")) {
                setErrorMessage("Document already exists. Please use a different one.");
            } else {
                setErrorMessage("Error updating client. Please check the data and try again.");
            }
        }
    };

    return (
        <div className="user-update-container">
            <h2>Client Update</h2>
            <div className="user-update-search">
                <input 
                    type="text" 
                    value={clientCode} 
                    onChange={(e) => setClientCode(e.target.value)} 
                    placeholder="Enter client code"
                />
                <button 
                    className="user-update-search-button" 
                    onClick={handleSearchClient} 
                    disabled={loading}
                >
                    {loading ? "Searching..." : "Search Client"}
                </button>
            </div>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <form className="user-update-form" onSubmit={handleUpdateClient}>
                <div>
                    <label>Name:</label>
                    <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        required 
                        placeholder="Enter full name"
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                        placeholder="Enter email address"
                    />
                </div>
                <div>
                    <label>Phone:</label>
                    <input 
                        type="text" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleChange} 
                        required 
                        placeholder="Enter phone number"
                    />
                </div>
                <div>
                    <label>Document:</label>
                    <input 
                        type="text" 
                        name="document" 
                        value={formData.document} 
                        onChange={handleChange} 
                        required 
                        placeholder="Enter document (letters and numbers only)"
                    />
                </div>
                <button type="submit">Update Client</button>
            </form>
        </div>
    );
};

export default UserUpdate;
