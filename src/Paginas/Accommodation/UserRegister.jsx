import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserRegister.css';

const UserRegister = () => {
    const [formData, setFormData] = useState({
        client_code: '',
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

    // Busca o próximo código disponível no backend
    const fetchNextClientCode = async () => {
        setLoadingCode(true);
        try {
            const { data } = await axios.get('http://localhost:5000/clientes/proximo-codigo');
            setNextClientCode(data.nextClientCode);
        } catch (error) {
            console.error("Erro ao buscar o próximo código de cliente:", error);
        } finally {
            setLoadingCode(false);
        }
    };

    // Insere o próximo código disponível no formulário
    const handleInsertClient = () => {
        if (nextClientCode !== null) {
            setFormData((prevData) => ({
                ...prevData,
                client_code: nextClientCode
            }));
        } else {
            alert("Código ainda não carregado. Aguarde um momento.");
        }
    };

    // Atualiza os valores do formulário
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Envia os dados do formulário para o backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.client_code) {
            alert("Por favor, clique em 'Inserir Novo Cliente' para gerar um código.");
            return;
        }

        try {
            await axios.post('http://localhost:5000/clientes', formData);
            alert("Cliente registrado com sucesso!");

            fetchNextClientCode();

            setFormData({
                client_code: '',
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
                disabled={loadingCode || formData.client_code !== ''}>
                {loadingCode ? "Carregando Código..." : "Inserir Novo Cliente"}
            </button>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Código do Cliente:</label>
                    <input type="text" name="clientCode" value={formData.client_code} readOnly />
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
