import React, { useState } from 'react';
import axios from 'axios';
import './UserUpdate.css';

const UserUpdate = () => {
    const [formData, setFormData] = useState({
        clientCode: '',
        name: '',
        email: '',
        phone: '',
        document: ''
    });

    const [loading, setLoading] = useState(false);

    const handleSearchClient = async () => {
        if (!formData.clientCode) {
            alert("Enter a client code.");
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.get(`https://your-backend.com/clients/${formData.clientCode}`);
            if (data) {
                setFormData(data);
            } else {
                alert("Client not found.");
            }
        } catch (error) {
            console.error("Error fetching client:", error);
            alert("Error fetching client.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleUpdateClient = async (e) => {
        e.preventDefault();
        if (!formData.clientCode) {
            alert("Search for a client first.");
            return;
        }

        try {
            await axios.put(`https://your-backend.com/clients/${formData.clientCode}`, formData);
            alert("Client updated successfully!");
        } catch (error) {
            console.error("Error updating client:", error);
            alert("Error updating client.");
        }
    };

    return (
        <div className="user-update-container">
            <h2>Client Update</h2>
            <div className="user-update-search">
                <input 
                    type="text" 
                    name="clientCode" 
                    value={formData.clientCode} 
                    onChange={handleChange} 
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
