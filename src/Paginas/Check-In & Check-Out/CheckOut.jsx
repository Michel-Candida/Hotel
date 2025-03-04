import React, { useState } from 'react';
import axios from 'axios';
import './Check.css';
import { Link } from 'react-router-dom';

const CheckOut = () => {
    const [formData, setFormData] = useState({
        clientCode: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        roomNumber: '',
        checkInDate: '',
        checkOutDate: '',
        companions: []
    });

    // Buscar cliente pelo código no back-end
    const handleClientCodeChange = async (e) => {
        const clientCode = e.target.value;
        setFormData({ ...formData, clientCode });

        if (clientCode.length > 0) {
            try {
                const { data } = await axios.get(`https://seu-backend.com/reservas/${clientCode}`);
                
                setFormData({
                    ...formData,
                    clientCode,
                    name: data.client.name,
                    email: data.client.email,
                    phone: data.client.phone,
                    address: data.client.address,
                    roomNumber: data.roomNumber,
                    checkInDate: data.checkInDate,
                    companions: data.companions || []
                });
            } catch (error) {
                console.error("Erro ao buscar reserva:", error);
                alert("Reserva não encontrada!");
            }
        }
    };

    // Submeter o Check-Out
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://seu-backend.com/checkout', { ...formData, checkOutDate: new Date().toISOString().split('T')[0] });
            alert("Check-Out realizado com sucesso!");
        } catch (error) {
            console.error("Erro ao fazer check-out:", error);
            alert("Erro ao realizar check-out.");
        }
    };

    return (
        <div>
            <h1>Check-Out</h1>
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
                            <input type="text" value={formData.roomNumber} readOnly />
                        </div>
                        <div>
                            <label>Data de Check-In:</label>
                            <input type="date" value={formData.checkInDate} readOnly />
                        </div>
                        <div>
                            <label>Data de Check-Out:</label>
                            <input type="date" value={formData.checkOutDate || new Date().toISOString().split('T')[0]} readOnly />
                        </div>
                        {formData.companions.length > 0 && (
                            <div>
                                <h3>Acompanhantes:</h3>
                                {formData.companions.map((companion, index) => (
                                    <div key={index}>
                                        <div>
                                            <label>Nome do Acompanhante {index + 1}:</label>
                                            <input type="text" value={companion.name} readOnly />
                                        </div>
                                        <div>
                                            <label>Email do Acompanhante {index + 1}:</label>
                                            <input type="email" value={companion.email} readOnly />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <button type="submit">Confirmar Check-Out</button>
                    </>
                )}
            </form>
            <Link to="/" className="back-button">Voltar</Link>
        </div>
    );
};

export default CheckOut;
