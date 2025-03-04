import React, { useState } from 'react';
import axios from 'axios';
import './Check.css';
import { Link } from 'react-router-dom';

const CheckIn = () => {
    const [formData, setFormData] = useState({
        clientCode: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        roomNumber: '',
        checkInDate: '',
        numberOfPeople: 1,
        companions: []
    });

    // Função para buscar cliente no back-end
    const handleClientCodeChange = async (e) => {
        const clientCode = e.target.value;
        setFormData({ ...formData, clientCode }); // Atualiza o código digitado

        if (clientCode.length > 0) {
            try {
                const { data } = await axios.get(`https://seu-backend.com/clientes/${clientCode}`);
                
                setFormData({
                    ...formData,
                    clientCode,
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    address: data.address,
                });
            } catch (error) {
                console.error("Erro ao buscar cliente:", error);
                alert("Cliente não encontrado!");
            }
        }
    };

    // Função para buscar dados do acompanhante
    const handleCompanionCodeChange = async (index, e) => {
        const companionCode = e.target.value;
        const companions = [...formData.companions];

        companions[index] = { ...companions[index], code: companionCode };

        if (companionCode.length > 0) {
            try {
                const { data } = await axios.get(`https://seu-backend.com/companions/${companionCode}`);
                
                companions[index] = {
                    ...companions[index],
                    name: data.name,
                    email: data.email
                };
            } catch (error) {
                console.error("Erro ao buscar acompanhante:", error);
                alert("Acompanhante não encontrado!");
            }
        }

        setFormData({ ...formData, companions });
    };

    // Adicionar um novo acompanhante
    const handleAddCompanion = () => {
        setFormData({
            ...formData,
            numberOfPeople: formData.numberOfPeople + 1,
            companions: [...formData.companions, { code: '', name: '', email: '' }]
        });
    };

    // Submeter o formulário
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://seu-backend.com/checkin', formData);
            alert("Check-in realizado com sucesso!");
        } catch (error) {
            console.error("Erro ao fazer check-in:", error);
            alert("Erro ao realizar check-in.");
        }
    };

    return (
        <div>
            <h1>Check-In</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Código do Cliente:</label>
                    <input
                        type="text"
                        name="clientCode"
                        value={formData.clientCode}
                        onChange={handleClientCodeChange}
                        required
                    />
                </div>
                {formData.name && (
                    <>
                        <div>
                            <label>Nome:</label>
                            <input type="text" value={formData.name} readOnly />
                        </div>
                        <div>
                            <label>Email:</label>
                            <input type="email" value={formData.email} readOnly />
                        </div>
                        <div>
                            <label>Telefone:</label>
                            <input type="text" value={formData.phone} readOnly />
                        </div>
                        <div>
                            <label>Endereço:</label>
                            <input type="text" value={formData.address} readOnly />
                        </div>
                        <div>
                            <label>Número do Quarto:</label>
                            <input
                                type="text"
                                name="roomNumber"
                                value={formData.roomNumber}
                                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label>Data de Check-In:</label>
                            <input
                                type="date"
                                name="checkInDate"
                                value={formData.checkInDate}
                                onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <button type="button" onClick={handleAddCompanion}>
                                Adicionar Acompanhante
                            </button>
                        </div>
                        {formData.companions.map((companion, index) => (
                            <div key={index}>
                                <label>Código do Acompanhante {index + 1}:</label>
                                <input
                                    type="text"
                                    name="code"
                                    value={companion.code}
                                    onChange={(e) => handleCompanionCodeChange(index, e)}
                                    required
                                />
                                {companion.name && (
                                    <>
                                        <div>
                                            <label>Nome do Acompanhante {index + 1}:</label>
                                            <input type="text" value={companion.name} readOnly />
                                        </div>
                                        <div>
                                            <label>Email do Acompanhante {index + 1}:</label>
                                            <input type="email" value={companion.email} readOnly />
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                        <button type="submit">Confirmar Check-In</button>
                    </>
                )}
            </form>
            <Link to="/" className="back-button">Voltar</Link>
        </div>
    );
};

export default CheckIn;
