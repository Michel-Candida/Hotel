import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './checkout.css';

const CheckOut = () => {
    const [formData, setFormData] = useState({
        clientCode: '',
        name: '',
        email: '',
        phone: '',
        document: '',
        roomNumber: '',
        checkInDate: '',
        checkOutDate: '',
        companions: []
    });

    const [loading, setLoading] = useState(false);

    const handleClientCodeChange = async (e) => {
        const rawCode = e.target.value;
        const clientCode = rawCode.trim();

        setFormData((prev) => ({ ...prev, clientCode: rawCode }));

        if (clientCode.length > 0) {
            setLoading(true);
            try {
                console.log("🔍 Buscando reserva com clientCode:", clientCode);
                const { data } = await axios.get(`http://localhost:5000/api/reservations/${clientCode}`);
                setFormData((prev) => ({
                    ...prev,
                    name: data.client.name,
                    email: data.client.email,
                    phone: data.client.phone,
                    document: data.client.document,
                    roomNumber: data.roomNumber,
                    checkInDate: data.checkInDate,
                    companions: data.companions || [],
                }));
            } catch (error) {
                console.error("❌ Error fetching reservation:", error);
                alert("Reserva não encontrada!");
                setFormData((prev) => ({
                    ...prev,
                    name: '',
                    email: '',
                    phone: '',
                    document: '',
                    roomNumber: '',
                    checkInDate: '',
                    companions: []
                }));
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/checkout', {
                ...formData,
                checkOutDate: new Date().toISOString().split('T')[0]
            });
            alert("Check-Out realizado com sucesso!");
        } catch (error) {
            console.error("Erro ao processar check-out:", error);
            alert(error.response?.data?.error || "Erro ao concluir o check-out.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-container">
            <h1>Check-Out</h1>
            <form className="checkout-form" onSubmit={handleSubmit}>
                <div>
                    <label>Client Code:</label>
                    <input
                        type="text"
                        name="clientCode"
                        value={formData.clientCode}
                        onChange={handleClientCodeChange}
                        required
                        disabled={loading}
                        autoComplete="off"
                    />
                </div>
                {loading && <p>Carregando dados da reserva...</p>}
                {formData.name && !loading && (
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
                            <label>Documento:</label>
                            <input type="text" value={formData.document} readOnly />
                        </div>
                        <div>
                            <label>Quarto:</label>
                            <input type="text" value={formData.roomNumber} readOnly />
                        </div>
                        <div>
                            <label>Data Check-In:</label>
                            <input type="date" value={formData.checkInDate} readOnly />
                        </div>
                        <div>
                            <label>Data Check-Out:</label>
                            <input type="date" value={formData.checkOutDate || new Date().toISOString().split('T')[0]} readOnly />
                        </div>
                        {formData.companions.length > 0 && (
                            <div className="companion-container">
                                <h3>Acompanhantes:</h3>
                                {formData.companions.map((companion, index) => (
                                    <div key={index}>
                                        <label>Acompanhante {index + 1}:</label>
                                        <input type="text" value={companion.name} readOnly />
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="buttons">
                            <button type="submit" className="checkout-button" disabled={loading}>
                                {loading ? "Processando..." : "Confirmar Check-Out"}
                            </button>
                        </div>
                    </>
                )}
            </form>
            <Link to="/" className="back-button">Voltar</Link>
        </div>
    );
};

export default CheckOut;
