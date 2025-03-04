import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserRegister.css';

const UserRegister = () => {
    const [formData, setFormData] = useState({
        clientCode: '',
        name: '',
        email: '',
        phone: '',
        address: ''
    });

    const [nextClientCode, setNextClientCode] = useState(null);
    const [loadingCode, setLoadingCode] = useState(false); 

    useEffect(() => {
        fetchNextClientCode();
    }, []);

    const fetchNextClientCode = async () => {
        setLoadingCode(true);
        try {
            const { data } = await axios.get('https://seu-backend.com/clientes/proximo-codigo');
            setNextClientCode(data.nextClientCode);
        } catch (error) {
            console.error("Erro ao buscar o próximo código de cliente:", error);
        } finally {
            setLoadingCode(false);
        }
    };

    const handleInsertClient = () => {
        if (nextClientCode !== null) {
            setFormData((prevData) => ({
                ...prevData,
                clientCode: nextClientCode
            }));
        } else {
            alert("Código ainda não carregado. Aguarde um momento.");
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
        if (!formData.clientCode) {
            alert("Por favor, clique em 'Inserir Novo Cliente' para gerar um código.");
            return;
        }

        try {
            await axios.post('https://seu-backend.com/clientes', formData);
            alert("Cliente registrado com sucesso!");

            fetchNextClientCode();

            setFormData({
                clientCode: '',
                name: '',
                email: '',
                phone: '',
                address: ''
            });
        } catch (error) {
            console.error("Erro ao registrar cliente:", error);
            alert("Erro ao registrar cliente.");
        }
    };

    return (
        <div className="container">
            <h2>Cadastro de Cliente</h2>
            <button 
                className="insert-button" 
                onClick={handleInsertClient} 
                disabled={loadingCode || formData.clientCode !== ''}>
                {loadingCode ? "Carregando Código..." : "Inserir Novo Cliente"}
            </button>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Código do Cliente:</label>
                    <input type="text" name="clientCode" value={formData.clientCode} readOnly />
                </div>
                <div>
                    <label>Nome:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div>
                    <label>Telefone:</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
                </div>
                <div>
                    <label>Endereço:</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} required />
                </div>
                <button type="submit">Registrar</button>
            </form>
        </div>
    );
};

export default UserRegister;
