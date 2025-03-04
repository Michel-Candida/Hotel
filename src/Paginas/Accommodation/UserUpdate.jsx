import React, { useState } from 'react';
import axios from 'axios';
import './UserUpdate.css';

const UserUpdate = () => {
    const [formData, setFormData] = useState({
        clientCode: '',
        name: '',
        email: '',
        phone: '',
        address: ''
    });

    const [loading, setLoading] = useState(false);

    const handleSearchClient = async () => {
        if (!formData.clientCode) {
            alert("Digite um código de cliente.");
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.get(`https://seu-backend.com/clientes/${formData.clientCode}`);
            if (data) {
                setFormData(data);
            } else {
                alert("Cliente não encontrado.");
            }
        } catch (error) {
            console.error("Erro ao buscar cliente:", error);
            alert("Erro ao buscar cliente.");
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
            alert("Busque um cliente primeiro.");
            return;
        }

        try {
            await axios.put(`https://seu-backend.com/clientes/${formData.clientCode}`, formData);
            alert("Cadastro atualizado com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar cliente:", error);
            alert("Erro ao atualizar cliente.");
        }
    };

    return (
        <div className="container">
            <h2>Atualização de Cliente</h2>
            <div className="client-search">
                <input 
                    type="text" 
                    name="clientCode" 
                    value={formData.clientCode} 
                    onChange={handleChange} 
                    placeholder="Digite o código do cliente"
                />
                <button className="search-button" onClick={handleSearchClient} disabled={loading}>
                    {loading ? "Buscando..." : "Buscar Cliente"}
                </button>
            </div>
            <form onSubmit={handleUpdateClient}>
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
                <button type="submit">Atualizar Cadastro</button>
            </form>
        </div>
    );
};

export default UserUpdate;
