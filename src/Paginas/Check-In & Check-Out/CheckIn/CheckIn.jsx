import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import './checkin.css';

const CheckIn = () => {
    const API_BASE_URL = "http://localhost:5000/api";
    
    const [formData, setFormData] = useState({
        client_code: "",
        name: "",
        email: "",
        phone: "",
        document: "",
        number_room: "",
        checkin_date: "",
        checkout_date: "",
        number_of_people: 1,
        companions: [],
    });

    const [allRooms, setAllRooms] = useState([]);
    const [roomSearchTerm, setRoomSearchTerm] = useState("");
    const [isRoomAvailable, setIsRoomAvailable] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [availabilityLoading, setAvailabilityLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/rooms`);
                setAllRooms(response.data);
            } catch (error) {
                console.error("Error loading rooms:", error);
            }
        };
        fetchRooms();
    }, []);

    const checkRoomAvailability = async () => {
        const { number_room, checkin_date, checkout_date } = formData;

        if (number_room && checkin_date && checkout_date) {
            setAvailabilityLoading(true);
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/check-availability`, 
                    { 
                        params: { 
                            number_room, 
                            checkin_date, 
                            checkout_date 
                        } 
                    }
                );
                setIsRoomAvailable(response.data.success);
                setErrorMessage(response.data.message);
            } catch (error) {
                console.error("Error checking availability:", error);
                setIsRoomAvailable(false);
                setErrorMessage(error.response?.data?.message || "Error checking room availability");
            } finally {
                setAvailabilityLoading(false);
            }
        }
    };

    useEffect(() => {
        checkRoomAvailability();
    }, [formData.number_room, formData.checkin_date, formData.checkout_date]);

    const handleClientCodeChange = async (e) => {
        const client_code = e.target.value;
        setFormData(prev => ({ ...prev, client_code }));
    
        if (client_code.trim().length >= 3) {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/clients/code/${client_code}`
                );
                
                if (response.data.success && response.data.client) {
                    setFormData(prev => ({
                        ...prev,
                        name: response.data.client.name || "",
                        email: response.data.client.email || "",
                        phone: response.data.client.phone || "",
                        document: response.data.client.document || ""
                    }));
                } else {
                    // Limpa os campos se não encontrar
                    setFormData(prev => ({
                        ...prev,
                        name: "",
                        email: "",
                        phone: "",
                        document: ""
                    }));
                }
            } catch (error) {
                console.error("Error loading client data:", error);
                if (error.response?.status !== 404) {
                    alert("Error loading client data");
                }
            }
        }
    };

    const handleRoomNumberChange = (e) => {
        const number_room = e.target.value;
        setRoomSearchTerm(number_room);
        setFormData(prev => ({ ...prev, number_room }));
    };

    const handleCheckinDateChange = (e) => {
        const checkin_date = e.target.value;
        setFormData(prev => ({ 
            ...prev, 
            checkin_date,
            checkout_date: prev.checkout_date && prev.checkout_date < checkin_date ? "" : prev.checkout_date
        }));
    };

    const handleCheckoutDateChange = (e) => {
        const checkout_date = e.target.value;
        if (checkout_date >= formData.checkin_date) {
            setFormData(prev => ({ ...prev, checkout_date }));
        } else {
            alert("Check-out date must be after check-in date");
        }
    };

    const handleAddCompanion = () => {
        if (formData.number_of_people < 5) {
            setFormData(prev => ({
                ...prev,
                number_of_people: prev.number_of_people + 1,
                companions: [
                    ...prev.companions,
                    { name: "", date_of_birth: "", document: "" },
                ],
            }));
        }
    };

    const handleRemoveCompanion = () => {
        if (formData.companions.length > 0) {
            setFormData(prev => ({
                ...prev,
                number_of_people: prev.number_of_people - 1,
                companions: prev.companions.slice(0, -1)
            }));
        }
    };

    const handleCompanionChange = (index, e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updated = [...prev.companions];
            updated[index] = { ...updated[index], [name]: value };
            return { ...prev, companions: updated };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!isRoomAvailable) {
            alert("Please select available room and dates first");
            return;
        }
    
        setSubmitting(true);
        
        try {
            const response = await axios.post(
                `${API_BASE_URL}/checkin`, 
                {
                    ...formData,
                    checkin_date: formData.checkin_date,
                    checkout_date: formData.checkout_date
                }
            );
            
            if (response.status === 201) {
                setFormData({
                    client_code: "",
                    name: "",
                    email: "",
                    phone: "",
                    document: "",
                    number_room: "",
                    checkin_date: "",
                    checkout_date: "",
                    number_of_people: 1,
                    companions: [],
                });
                
                alert("Check-in completed successfully! Reservation ID: " + response.data.reservation_id);
            }
        } catch (error) {
            console.error("Error submitting check-in:", error);
            alert(error.response?.data?.error || "Error completing check-in");
        } finally {
            setSubmitting(false);
        }
    };

    const filteredRooms = allRooms.filter(room =>
        room.number_room.toLowerCase().includes(roomSearchTerm.toLowerCase()) ||
        room.name.toLowerCase().includes(roomSearchTerm.toLowerCase())
    );

    return (
        <div className="checkin-container">
            <h1>Check-In</h1>
            
            <form className="checkin-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Client Code:</label>
                    <input
                        type="text"
                        value={formData.client_code}
                        onChange={handleClientCodeChange}
                        required
                    />
                </div>

                {formData.name && (
                    <>
                        <div className="form-group">
                            <label>Name:</label>
                            <input type="text" value={formData.name} readOnly />
                        </div>
                        <div className="form-group">
                            <label>Email:</label>
                            <input type="email" value={formData.email} readOnly />
                        </div>
                        <div className="form-group">
                            <label>Phone:</label>
                            <input type="text" value={formData.phone} readOnly />
                        </div>
                        <div className="form-group">
                            <label>Document:</label>
                            <input type="text" value={formData.document} readOnly />
                        </div>
                    </>
                )}

                <div className="form-group">
                    <label>Check-In Date:</label>
                    <input
                        type="date"
                        value={formData.checkin_date}
                        onChange={handleCheckinDateChange}
                        min={new Date().toISOString().split('T')[0]}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Check-Out Date:</label>
                    <input
                        type="date"
                        value={formData.checkout_date}
                        onChange={handleCheckoutDateChange}
                        min={formData.checkin_date || new Date().toISOString().split('T')[0]}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Room Number:</label>
                    <input
                        type="text"
                        value={formData.number_room}
                        onChange={handleRoomNumberChange}
                        list="roomOptions"
                        required
                    />
                    <datalist id="roomOptions">
                        {filteredRooms.map(room => (
                            <option key={room.number_room} value={room.number_room}>
                                {room.name} ({room.type_room})
                            </option>
                        ))}
                    </datalist>
                </div>

                <div className="add-remove-buttons">
                    <button 
                        type="button" 
                        onClick={handleAddCompanion}
                        className="add-companion"
                        disabled={formData.number_of_people >= 5}
                    >
                        Add Companion
                    </button>
                    <button
                        type="button"
                        onClick={handleRemoveCompanion}
                        disabled={formData.companions.length === 0}
                        className="remove-companion"
                    >
                        Remove Companion
                    </button>
                </div>

                {formData.companions.map((companion, index) => (
                    <div key={index} className="companion-container">
                        <h3>Companion {index + 1}</h3>
                        <div className="form-group">
                            <label>Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={companion.name}
                                onChange={(e) => handleCompanionChange(index, e)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Date of Birth:</label>
                            <input
                                type="date"
                                name="date_of_birth"
                                value={companion.date_of_birth}
                                onChange={(e) => handleCompanionChange(index, e)}
                                required
                                max={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                        <div className="form-group">
                            <label>Document:</label>
                            <input
                                type="text"
                                name="document"
                                value={companion.document}
                                onChange={(e) => handleCompanionChange(index, e)}
                                required
                            />
                        </div>
                    </div>
                ))}

                <button 
                    type="submit" 
                    className={`checkin-button ${submitting ? 'submitting' : ''}`}
                    disabled={!isRoomAvailable || submitting || 
                             !formData.client_code || !formData.checkin_date || 
                             !formData.checkout_date || !formData.number_room}
                >
                    {submitting ? (
                        <>
                            <span className="spinner"></span> Processing...
                        </>
                    ) : (
                        "Confirm Check-In"
                    )}
                </button>

                {availabilityLoading && <p className="loading-message">Checking availability...</p>}
                {!isRoomAvailable && <p className="error-message">{errorMessage}</p>}
            </form>

            
            <button 
                    onClick={() => navigate('/MainMenu')} 
                    className="back-button"
                >
                    &larr; Menu
                </button>
        </div>
    );
};

export default CheckIn;