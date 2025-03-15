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
        document: '',
        roomNumber: '',
        checkInDate: '',
        numberOfPeople: 1,
        companions: []
    });

    const handleClientCodeChange = async (e) => {
    const clientCode = e.target.value;
    setFormData({ ...formData, clientCode });

    if (clientCode.length > 0) {
        try {
            const { data } = await axios.get(`http://localhost:5000/reservas/${clientCode}`); // 🛠 Confirme a URL aqui
            
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
            alert("Client not found!");
        }
    }
};
    
    const handleCompanionCodeChange = async (index, e) => {
        const companionCode = e.target.value;
        const companions = [...formData.companions];
    
        companions[index] = { ...companions[index], code: companionCode };
    
        if (companionCode.length > 0) {
            try {
                const { data } = await axios.get(`http://localhost:5000/companions/${companionCode}`);
                
                companions[index] = {
                    ...companions[index],
                    name: data.name,
                    email: data.email
                };
            } catch (error) {
                console.error("Erro ao buscar acompanhante:", error);
                alert("Companion not found!");
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
            await axios.post('http://localhost:5000/checkin', formData);
            alert("Check-in successfully completed!");
        } catch (error) {
            console.error("Erro ao fazer check-in:", error);
            alert("Error completing check-in.");
        }
    };

    return (
        <div>
            <h1>Check-In</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Client Code:</label>
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
                            <label>Name:</label>
                            <input type="text" value={formData.name} readOnly />
                        </div>
                        <div>
                            <label>Email:</label>
                            <input type="email" value={formData.email} readOnly />
                        </div>
                        <div>
                            <label>Phone:</label>
                            <input type="text" value={formData.phone} readOnly />
                        </div>
                        <div>
                            <label>Document:</label>
                            <input type="text" value={formData.document} readOnly />
                        </div>
                        <div>
                            <label>Room Number:</label>
                            <input
                                type="text"
                                name="roomNumber"
                                value={formData.roomNumber}
                                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label>Check-In Date:</label>
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
                                Add Companion
                            </button>
                        </div>
                        {formData.companions.map((companion, index) => (
                            <div key={index}>
                                <label>Companion Code {index + 1}:</label>
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
                                            <label>Companion Name {index + 1}:</label>
                                            <input type="text" value={companion.name} readOnly />
                                        </div>
                                        <div>
                                            <label>Companion Email {index + 1}:</label>
                                            <input type="email" value={companion.email} readOnly />
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                        <button type="submit">Confirm Check-In</button>
                    </>
                )}
            </form>
            <Link to="/" className="back-button">Back</Link>
        </div>
    );
};

export default CheckIn;
