import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
        companions: [],
        reservationId: null,
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleClientCodeChange = async (e) => {
        const clientCode = e.target.value;
        setFormData((prev) => ({ ...prev, clientCode }));

        if (clientCode.length > 0) {
            setLoading(true);
            try {
                const { data } = await axios.get(`http://localhost:5000/api/reservations/${clientCode}`);
                const reservation = data.reservation;
                const client = reservation.client;

                setFormData((prev) => ({
                    ...prev,
                    reservationId: reservation.reservation_id,
                    name: client.name,
                    email: client.email,
                    phone: client.phone,
                    document: client.document,
                    roomNumber: reservation.number_room,
                    checkInDate: reservation.check_in_date.split('T')[0],
                    companions: reservation.companions || [],
                }));
            } catch (error) {
                console.error("Erro ao buscar reserva:", error);
                alert("Reserva não encontrada.");
                setFormData((prev) => ({
                    ...prev,
                    name: '',
                    email: '',
                    phone: '',
                    document: '',
                    roomNumber: '',
                    checkInDate: '',
                    checkOutDate: '',
                    companions: [],
                    reservationId: null,
                }));
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.reservationId) {
            alert("Reserva inválida.");
            return;
        }
        setLoading(true);
        try {
            await axios.post(`http://localhost:5000/api/reservations/checkout/${formData.reservationId}`);
            alert("Check-out realizado com sucesso!");
            navigate('/MainMenu');
        } catch (error) {
            console.error("Erro ao fazer check-out:", error);
            alert("Erro ao processar check-out.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-container">
            <h1>Check-Out</h1>
            <form className="checkout-form" onSubmit={handleSubmit}>
                <div>
                    <label>Código do Cliente:</label>
                    <input
                        type="text"
                        value={formData.clientCode}
                        onChange={handleClientCodeChange}
                        required
                        disabled={loading}
                    />
                </div>
                {loading && <p>Carregando dados...</p>}
                {formData.name && !loading && (
                    <>
                        <div><label>Nome:</label><input type="text" value={formData.name} readOnly /></div>
                        <div><label>Email:</label><input type="email" value={formData.email} readOnly /></div>
                        <div><label>Telefone:</label><input type="text" value={formData.phone} readOnly /></div>
                        <div><label>Documento:</label><input type="text" value={formData.document} readOnly /></div>
                        <div><label>Quarto:</label><input type="text" value={formData.roomNumber} readOnly /></div>
                        <div><label>Check-in:</label><input type="date" value={formData.checkInDate} readOnly /></div>
                        <div><label>Check-out:</label><input type="date" value={new Date().toISOString().split('T')[0]} readOnly /></div>

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
                            <button type="submit" disabled={loading}>
                                {loading ? 'Processando...' : 'Confirmar Check-Out'}
                            </button>
                        </div>
                    </>
                )}
            </form>
            <button onClick={() => navigate('/MainMenu')} className="back-button">
                &larr; Menu
            </button>
        </div>
    );
};

export default CheckOut;
