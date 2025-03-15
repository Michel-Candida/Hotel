import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserRegister.css';

const UserRegister = () => {
    const [formData, setFormData] = useState({
        client_code: '',
        name: '',
        email: '',
        phone: '',
        document: ''
    });

    const [loadingCode, setLoadingCode] = useState(false);

    useEffect(() => {
        generateClientCode();
    }, []);

    const generateClientCode = async () => {
        setLoadingCode(true);
        try {
            // Chama o endpoint que retorna o próximo código do cliente
            const { data } = await axios.get('http://localhost:5000/clients/next-code');
            setFormData((prevData) => ({
                ...prevData,
                client_code: data.nextClientCode
            }));
        } catch (error) {
            console.error("Erro ao obter código do cliente:", error);
        } finally {
            setLoadingCode(false);
        }
    };

    // Update form values
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
            alert("Erro ao gerar código do cliente. Tente novamente.");
            return;
        }
    
        try {
            // Envia os dados para o back-end
            await axios.post('http://localhost:5000/clients', formData);
            alert("Cliente registrado com sucesso!");
    
            // Gera um novo código após o registro
            generateClientCode();
    
            // Reseta o formulário
            setFormData({
                client_code: '',
                name: '',
                email: '',
                phone: '',
                document: ''
            });
        } catch (error) {
            console.error("Erro ao registrar cliente:", error);
            alert(error.response?.data?.error || "Erro ao registrar cliente.");
        }
    };

    return (
        <div className="container">
            <h2>Client Registration</h2>
            <form onSubmit={handleSubmit}>
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
                <button type="submit" disabled={loadingCode}>
                    {loadingCode ? "Generating Code..." : "Register"}
                </button>
            </form>
        </div>
    );
};

export default UserRegister;
