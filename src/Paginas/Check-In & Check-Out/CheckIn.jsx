import React, { useState } from "react";
import axios from "axios";
import "./Check.css";
import { Link } from "react-router-dom";

const CheckIn = () => {
    const [formData, setFormData] = useState({
        clientCode: "",
        name: "",
        email: "",
        phone: "",
        document: "",
        roomNumber: "",
        checkInDate: "",
        checkOutDate: "",
        numberOfPeople: 1,
        companions: [],
    });

    const [isRoomAvailable, setIsRoomAvailable] = useState(true);

    const handleClientCodeChange = async (e) => {
        const clientCode = e.target.value;
        setFormData((prevState) => ({ ...prevState, clientCode }));

        if (clientCode.trim().length > 0) {
            try {
                const { data } = await axios.get(
                    `http://localhost:5000/clients/${clientCode}`
                );
                if (data) {
                    setFormData((prevState) => ({
                        ...prevState,
                        name: data.name || "",
                        email: data.email || "",
                        phone: data.phone || "",
                        document: data.document || "",
                        checkInDate: "",
                        checkOutDate: "",
                        roomNumber: "",
                        companions: [],
                    }));
                } else {
                    alert("Client not found!");
                }
            } catch (error) {
                console.error("Error fetching client data:", error);
                alert("Error fetching client data.");
            }
        }
    };

    const checkRoomAvailability = async (roomNumber, checkInDate) => {
        if (!roomNumber || !checkInDate) return;
    
        setIsRoomAvailable(false); // Desabilita o botão enquanto a verificação está em andamento.
    
        try {
            const response = await axios.get(
                "http://localhost:5000/check-room-availability",
                {
                    params: { room_number: roomNumber, checkin_date: checkInDate },
                }
            );
    
            setIsRoomAvailable(response.data.available); // Atualiza a disponibilidade
    
            if (!response.data.available) {
                alert("The selected room is already occupied on this date!");
            }
        } catch (error) {
            console.error("Error checking room availability:", error);
            alert("Error checking availability.");
        }
    };
    
    const handleRoomNumberChange = (e) => {
        const roomNumber = e.target.value;
        setFormData((prevState) => ({ ...prevState, roomNumber }));
    
        if (formData.checkInDate) {
            checkRoomAvailability(roomNumber, formData.checkInDate);
        }
    };
    
    const handleCheckInDateChange = (e) => {
        const checkInDate = e.target.value;
        setFormData((prevState) => ({ ...prevState, checkInDate }));
    
        if (formData.roomNumber) {
            checkRoomAvailability(formData.roomNumber, checkInDate);
        }
    }

    const handleCheckOutDateChange = (e) => {
        setFormData((prevState) => ({ ...prevState, checkOutDate: e.target.value }));
    };

    const handleAddCompanion = () => {
        setFormData((prevState) => ({
            ...prevState,
            numberOfPeople: prevState.numberOfPeople + 1,
            companions: [
                ...prevState.companions,
                { name: "", phone: "", document: "" },
            ],
        }));
    };

    const handleRemoveCompanion = () => {
        if (formData.companions.length > 0) {
            const updatedCompanions = [...formData.companions];
            updatedCompanions.pop(); 

            setFormData((prevState) => ({
                ...prevState,
                numberOfPeople: prevState.numberOfPeople - 1,
                companions: updatedCompanions,
            }));
        }
    };

    const handleCompanionChange = (index, e) => {
        const { name, value } = e.target;
        const updatedCompanions = [...formData.companions];
        updatedCompanions[index] = { ...updatedCompanions[index], [name]: value };
        setFormData({ ...formData, companions: updatedCompanions });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isRoomAvailable) {
            alert("The selected room is occupied. Please choose another.");
            return;
        }

        try {
            await axios.post("http://localhost:5000/checkin", formData);
            alert("Check-in successfully completed!");
        } catch (error) {
            console.error("Error completing check-in:", error);
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
                    </>
                )}

                {formData.name && (
                    <>
                        <div>
                            <label>Room Number:</label>
                            <input
                                type="text"
                                name="roomNumber"
                                value={formData.roomNumber}
                                onChange={handleRoomNumberChange}
                                required
                            />
                        </div>

                        <div>
                            <label>Check-In Date:</label>
                            <input
                                type="date"
                                name="checkInDate"
                                value={formData.checkInDate}
                                onChange={handleCheckInDateChange}
                                required
                            />
                        </div>

                        <div>
                            <label>Check-Out Date:</label>
                            <input
                                type="date"
                                name="checkOutDate"
                                value={formData.checkOutDate}
                                onChange={handleCheckOutDateChange}
                                required
                            />
                        </div>
                    </>
                )}

                <div>
                    <button type="button" onClick={handleAddCompanion}>
                        Add Companion
                    </button>
                    <button type="button" onClick={handleRemoveCompanion} disabled={formData.companions.length === 0}>
                        Remove Companion
                    </button>
                </div>

                {formData.companions.map((companion, index) => (
                    <div key={index}>
                        <div>
                            <label>Companion Name {index + 1}:</label>
                            <input
                                type="text"
                                name="name"
                                value={companion.name}
                                onChange={(e) => handleCompanionChange(index, e)}
                                required
                            />
                        </div>
                        <div>
                            <label>Companion Phone {index + 1}:</label>
                            <input
                                type="text"
                                name="phone"
                                value={companion.phone}
                                onChange={(e) => handleCompanionChange(index, e)}
                                required
                            />
                        </div>
                        <div>
                            <label>Companion Document {index + 1}:</label>
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
                    className="cheking-button"
                    type="submit"
                    disabled={!isRoomAvailable || !formData.checkInDate || !formData.roomNumber}
                >
                    Confirm Check-In
                </button>
            </form>

            <Link to="/MainMenu" className="back-button">
                Back
            </Link>
        </div>
    );
};

export default CheckIn;
