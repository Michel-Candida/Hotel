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

    // Função para buscar o cliente
    const handleSearchClient = async () => {
        if (!clientCode) {
            alert("Please enter a client code.");
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.get(`http://localhost:5000/clients/${clientCode}`);

            if (data && Object.keys(data).length > 0) {
                setFormData(prevState => ({
                    ...prevState,
                    ...data
                }));
            } else {
                alert("Client not found.");
            }
        } catch (error) {
            console.error("Error fetching client:", error);
            alert("Error fetching client. Please try again.");
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
            alert("Error updating client. Please check the data and try again.");
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
            <form className="user-update-form" onSubmit={handleUpdateClient}>
                <div>
                    <label>Name:</label>
                    <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        required 
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
                    />
                </div>
                <button type="submit">Update Client</button>
            </form>
        </div>
    );
};

export default UserUpdate;
