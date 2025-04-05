import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const api = axios.create({
        baseURL: 'http://localhost:5000/api',
        timeout: 10000
    });

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^[0-9]+$/;
        return phoneRegex.test(phone);
    };

    const validateDocument = (document) => {
        const documentRegex = /^[a-zA-Z0-9]+$/;
        return documentRegex.test(document);
    };

    const handleSearchClient = async () => {
        if (!clientCode.trim()) {
            setErrorMessage("Por favor, insira um código de cliente.");
            return;
        }

        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await api.get(`/clients/code/${clientCode}`);
            
            if (response.data) {
                setFormData({
                    name: response.data.client.name || '',
                    email: response.data.client.email || '',
                    phone: response.data.client.phone || '',
                    document: response.data.client.document || ''
                });
            } else {
                setErrorMessage("Cliente não encontrado.");
            }
        } catch (error) {
            console.error("Erro ao buscar cliente:", error);
            if (error.response?.status === 404) {
                setErrorMessage("Cliente não encontrado. Verifique o código.");
            } else {
                setErrorMessage("Erro ao buscar cliente. Tente novamente.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdateClient = async (e) => {
        e.preventDefault();

        if (!clientCode) {
            setErrorMessage("Busque um cliente primeiro.");
            return;
        }

        // Validações
        if (!validateEmail(formData.email)) {
            setErrorMessage("Formato de e-mail inválido");
            return;
        }

        if (!validatePhone(formData.phone)) {
            setErrorMessage("Telefone deve conter apenas números");
            return;
        }

        if (!validateDocument(formData.document)) {
            setErrorMessage("Documento deve conter apenas letras e números");
            return;
        }

        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await api.put(`/clients/${clientCode}`, {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                document: formData.document
            });

            if (response.status === 200) {
                setSuccessMessage("Cliente atualizado com sucesso!");
                // Atualiza os dados locais com a resposta do servidor
                setFormData(response.data.client);
            }
        } catch (error) {
            console.error("Erro ao atualizar cliente:", error);
            if (error.response?.data?.message?.includes("Document already exists")) {
                setErrorMessage("Documento já existe. Por favor use um diferente.");
            } else {
                setErrorMessage(error.response?.data?.message || "Erro ao atualizar cliente.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="user-update-container">
            <div className="Update-Register-back">
                <button 
                    onClick={() => navigate('/MainMenu')} 
                    className="Update-back-button"
                >
                    &larr; Menu
                </button>
                <h2>Atualizar Cliente</h2>
            </div>
            
            <div className="user-update-search">
                <input 
                    type="text" 
                    value={clientCode} 
                    onChange={(e) => setClientCode(e.target.value)} 
                    placeholder="Digite o código do cliente"
                    autoComplete="off"
                />
                <button 
                    className="user-update-search-button" 
                    onClick={handleSearchClient} 
                    disabled={loading || !clientCode.trim()}
                >
                    {loading ? "Buscando..." : "Buscar Cliente"}
                </button>
            </div>

            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
            
            <form className="user-update-form" onSubmit={handleUpdateClient}>
                <div>
                    <label>Nome:</label>
                    <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        required 
                        placeholder="Nome completo"
                        autoComplete="off"
                    />
                </div>
                <div>
                    <label>E-mail:</label>
                    <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                        placeholder="Endereço de e-mail"
                        autoComplete="off"
                    />
                </div>
                <div>
                    <label>Telefone:</label>
                    <input 
                        type="text" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleChange} 
                        required 
                        placeholder="Número de telefone"
                        autoComplete="off"
                    />
                </div>
                <div>
                    <label>Documento:</label>
                    <input 
                        type="text" 
                        name="document" 
                        value={formData.document} 
                        onChange={handleChange} 
                        required 
                        placeholder="Documento (apenas letras e números)"
                        autoComplete="off"
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={loading || !clientCode}
                    className="update-button"
                >
                    {loading ? "Atualizando..." : "Atualizar Cliente"}
                </button>
            </form>
        </div>
    );
};

export default UserUpdate;