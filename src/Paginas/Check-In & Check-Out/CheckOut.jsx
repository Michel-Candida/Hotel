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

    const handleClientCodeChange = async (e) => {
        const clientCode = e.target.value;
        setFormData({ ...formData, clientCode });

        if (clientCode.length > 0) {
            try {
                const { data } = await axios.get(`https://your-backend.com/reservations/${clientCode}`);
                setFormData({
                    ...formData,
                    clientCode,
                    name: data.client.name,
                    email: data.client.email,
                    phone: data.client.phone,
                    document: data.client.document,
                    roomNumber: data.roomNumber,
                    checkInDate: data.checkInDate,
                    companions: data.companions || []
                });
            } catch (error) {
                console.error("Error fetching reservation:", error);
                alert("Reservation not found!");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://your-backend.com/checkout', { ...formData, checkOutDate: new Date().toISOString().split('T')[0] });
            alert("Check-Out successfully completed!");
        } catch (error) {
            console.error("Error during check-out:", error);
            alert("Error completing check-out.");
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
                            <input type="text" value={formData.roomNumber} readOnly />
                        </div>
                        <div>
                            <label>Check-In Date:</label>
                            <input type="date" value={formData.checkInDate} readOnly />
                        </div>
                        <div>
                            <label>Check-Out Date:</label>
                            <input type="date" value={formData.checkOutDate || new Date().toISOString().split('T')[0]} readOnly />
                        </div>
                        {formData.companions.length > 0 && (
                            <div className="companion-container">
                                <h3>Companions:</h3>
                                {formData.companions.map((companion, index) => (
                                    <div key={index}>
                                        <div>
                                            <label>Companion Name {index + 1}:</label>
                                            <input type="text" value={companion.name} readOnly />
                                        </div>
                                        <div>
                                            <label>Companion Email {index + 1}:</label>
                                            <input type="email" value={companion.email} readOnly />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="buttons">
                            <button type="submit" className="checkout-button">Confirm Check-Out</button>
                        </div>
                    </>
                )}
            </form>
            <Link to="/" className="back-button">Back</Link>
        </div>
    );
};

export default CheckOut;
