import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import './checkin.css';  // Import the custom CSS

const CheckIn = () => {
    const [formData, setFormData] = useState({
        clientCode: "",
        name: "",
        email: "",
        phone: "",
        document: "",
        room_id: "", // Alterado de roomNumber para room_id
        checkin_date: "", // Alterado de checkInDate para checkin_date
        checkout_date: "", // Alterado de checkOutDate para checkout_date
        number_of_people: 1, // Alterado de numberOfPeople para number_of_people
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
                        checkin_date: "", // Reset check-in date
                        checkout_date: "", // Reset checkout date
                        room_id: "", // Reset room_id
                        companions: [], // Reset companions
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

    const checkRoomAvailability = async (room_id, checkin_date, checkout_date) => {
        if (!room_id || !checkin_date || !checkout_date) return;

        setIsRoomAvailable(false); // Disable the button while checking availability

        try {
            const response = await axios.get("http://localhost:5000/check-room-availability", {
                params: { room_id, checkin_date, checkout_date },
            });

            setIsRoomAvailable(response.data.available); // Update availability

            if (!response.data.available) {
                alert("The selected room is already occupied during this period!");
            }
        } catch (error) {
            console.error("Error checking room availability:", error);
            alert("Error checking availability.");
        }
    };

    const handleRoomNumberChange = (e) => {
        const room_id = e.target.value;  // Alterado para room_id
        setFormData((prevState) => ({ ...prevState, room_id }));

        if (formData.checkin_date && formData.checkout_date) {
            checkRoomAvailability(room_id, formData.checkin_date, formData.checkout_date);
        }
    };

    const handleCheckinDateChange = (e) => {
        const checkin_date = e.target.value;
        setFormData((prevState) => ({ ...prevState, checkin_date }));

        if (formData.room_id) {
            checkRoomAvailability(formData.room_id, checkin_date, formData.checkout_date);
        }
    };

    const handleCheckoutDateChange = (e) => {
        const checkout_date = e.target.value;

        if (new Date(checkout_date) < new Date(formData.checkin_date)) {
            alert("Check-out date cannot be earlier than check-in date.");
            return;
        }

        setFormData((prevState) => ({ ...prevState, checkout_date }));
    };

    const handleAddCompanion = () => {
        setFormData((prevState) => ({
            ...prevState,
            number_of_people: prevState.number_of_people + 1, // Alterado para number_of_people
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
                number_of_people: prevState.number_of_people - 1, // Alterado para number_of_people
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
        <div className="checkin-container">
            <h1>Check-In</h1>
            <form className="checkin-form" onSubmit={handleSubmit}>
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
                            <label>Room Number (Room ID):</label>
                            <input
                                type="text"
                                name="room_id"  // Alterado para room_id
                                value={formData.room_id}
                                onChange={handleRoomNumberChange}
                                required
                            />
                        </div>

                        <div>
                            <label>Check-In Date:</label>
                            <input
                                type="date"
                                name="checkin_date"  // Alterado para checkin_date
                                value={formData.checkin_date}
                                onChange={handleCheckinDateChange}
                                required
                            />
                        </div>

                        <div>
                            <label>Check-Out Date:</label>
                            <input
                                type="date"
                                name="checkout_date"  // Alterado para checkout_date
                                value={formData.checkout_date}
                                onChange={handleCheckoutDateChange}
                                required
                            />
                        </div>
                    </>
                )}

                <div className="add-remove-buttons">
                    <button type="button" onClick={handleAddCompanion} className="neels add-companion-button">
                        Add Companion
                    </button>
                    <button 
                        type="button" 
                        onClick={handleRemoveCompanion} 
                        disabled={formData.companions.length === 0} 
                        className="neels remove-companion-button"
                    >
                        Remove Companion
                    </button>
                </div>

                {formData.companions.map((companion, index) => (
                    <div key={index} className="companion-container">
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
                    className="checkin-button"
                    type="submit"
                    disabled={!isRoomAvailable || !formData.checkin_date || !formData.room_id}
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
