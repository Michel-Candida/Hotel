import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ClientRegister.css';

const ClientRegister = () => {
    const [formData, setFormData] = useState({
        client_code: '',
        name: '',
        email: '',
        phone: '',
        document: ''
    });

    const [nextClientCode, setNextClientCode] = useState(null);
    const [loadingCode, setLoadingCode] = useState(false);

    useEffect(() => {
        fetchNextClientCode();
    }, []);

    const fetchNextClientCode = async () => {
        setLoadingCode(true);
        try {
            const { data } = await axios.get('http://localhost:5000/clients/next-code');
            setNextClientCode(data.nextClientCode);
        } catch (error) {
            console.error("Error fetching the next client code:", error);
        } finally {
            setLoadingCode(false);
        }
    };

    const handleInsertClient = () => {
        if (nextClientCode !== null) {
            setFormData((prevData) => ({
                ...prevData,
                client_code: nextClientCode
            }));
        } else {
            alert("Code not loaded yet. Please wait a moment.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.client_code) {
            alert("Please click 'Insert New Client' to generate a code.");
            return;
        }

        try {
            await axios.post('http://localhost:5000/clients', formData);
            alert("Client registered successfully!");

            fetchNextClientCode();

            setFormData({
                client_code: '',
                name: '',
                email: '',
                phone: '',
                document: ''
            });
        } catch (error) {
            console.error("Error registering client:", error);
            alert("Error registering client.");
        }
    };

    return (
        <div className="user-register-container">
            <h2 className="user-register-title">Client Registration</h2>
            <button 
                className="user-register-button" 
                onClick={handleInsertClient} 
                disabled={loadingCode || formData.client_code !== ''}>
                {loadingCode ? "Loading Code..." : "Insert New Client"}
            </button>
            <form className="user-register-form" onSubmit={handleSubmit}>
                <div>
                    <label>Client Code:</label>
                    <input type="text" name="client_code" value={formData.client_code} readOnly />
                </div>
                <div>
                    <label>Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div>
                    <label>Phone:</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
                </div>
                <div>
                    <label>Document:</label>
                    <input type="text" name="document" value={formData.document} onChange={handleChange} required />
                </div>
                <button className="user-register-button" type="submit">Register</button>
            </form>
        </div>
    );
};

export default ClientRegister;
