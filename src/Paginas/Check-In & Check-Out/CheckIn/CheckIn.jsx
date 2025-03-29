import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import './checkin.css';

const CheckIn = () => {
    const [formData, setFormData] = useState({
        client_code: "",
        name: "",
        email: "",
        phone: "",
        document: "",
        room_id: "",
        checkin_date: "",
        checkout_date: "",
        number_of_people: 1,
        companions: [],
    });

    const [isRoomAvailable, setIsRoomAvailable] = useState(true);

    const handleClientCodeChange = async (e) => {
        const client_code = e.target.value;
        setFormData((prevState) => ({ ...prevState, client_code }));

        if (client_code.trim().length > 0) {
            try {
                const { data } = await axios.get(
                    `http://localhost:5000/clients/${client_code}`
                );
                if (data) {
                    setFormData((prevState) => ({
                        ...prevState,
                        name: data.name || "",
                        email: data.email || "",
                        phone: data.phone || "",
                        document: data.document || "",
                        checkin_date: "",
                        checkout_date: "", 
                        room_id: "", 
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

    const checkRoomAvailability = async (room_id, checkin_date, checkout_date) => {
        if (!room_id || !checkin_date || !checkout_date) return;

        setIsRoomAvailable(false); 

        try {
            const response = await axios.post("http://localhost:5000/checkin", {
                client_code: formData.client_code,
                room_id: room_id,
                checkin_date: checkin_date,
                checkout_date: checkout_date,
                number_of_people: formData.number_of_people,
                companions: formData.companions,
            });

            if (response.data.message === "The room is already booked during this period.") {
                setIsRoomAvailable(false); 
                alert(response.data.message);  
            } else {
                setIsRoomAvailable(true);  
            }
        } catch (error) {
            console.error("Error checking room availability:", error);
            alert("Error checking availability.");
        }
    };

    const handleRoomNumberChange = (e) => {
        const room_id = e.target.value;
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
        if (formData.number_of_people < 5) { // Max limit for example
            setFormData((prevState) => ({
                ...prevState,
                number_of_people: prevState.number_of_people + 1,
                companions: [
                    ...prevState.companions,
                    { name: "", phone: "", document: "" },
                ],
            }));
        } else {
            alert("Maximum number of people reached.");
        }
    };

    const handleRemoveCompanion = () => {
        if (formData.companions.length > 0) {
            const updatedCompanions = [...formData.companions];
            updatedCompanions.pop();

            setFormData((prevState) => ({
                ...prevState,
                number_of_people: prevState.number_of_people - 1,
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
    
        // Verifica se a sala ainda está disponível antes de enviar os dados
        if (!isRoomAvailable) {
            alert("A sala não está disponível para as datas selecionadas.");
            return;
        }
    
        // Validar e logar os dados antes de enviar
        console.log("Form Data: ", formData);
    
        const dataToSend = {
            ...formData,
            checkin_date: new Date(formData.checkin_date).toISOString().split('T')[0],
            checkout_date: new Date(formData.checkout_date).toISOString().split('T')[0],
            client_code: parseInt(formData.client_code, 10), // Assegura que seja número
            room_id: parseInt(formData.room_id, 10),        // Assegura que seja número
            number_of_people: parseInt(formData.number_of_people, 10)  // Assegura que seja número
        };
    
        console.log("Sending Data: ", dataToSend); // Log para ver o que está sendo enviado
    
        try {
            await axios.post("http://localhost:5000/checkin", dataToSend);
            alert("Check-in successfully completed!");
        } catch (error) {
            console.error("Error completing check-in:", error);
            console.log("Response Error:", error.response);  // Log da resposta de erro
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
                        name="client_code"
                        value={formData.client_code}
                        onChange={handleClientCodeChange}
                        required
                        autoComplete="off"
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
                            <label>Room ID:</label>
                            <input
                                type="text"
                                name="room_id"
                                value={formData.room_id}
                                onChange={handleRoomNumberChange}
                                required
                                autoComplete="off"
                            />
                        </div>

                        <div>
                            <label>Check-In Date:</label>
                            <input
                                type="date"
                                name="checkin_date"
                                value={formData.checkin_date}
                                onChange={handleCheckinDateChange}
                                required
                                autoComplete="off"
                            />
                        </div>

                        <div>
                            <label>Check-Out Date:</label>
                            <input
                                type="date"
                                name="checkout_date"
                                value={formData.checkout_date}
                                onChange={handleCheckoutDateChange}
                                required
                                autoComplete="off"
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
                                autoComplete="off"
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
                                autoComplete="off"
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
                                autoComplete="off"
                            />
                        </div>
                    </div>
                ))}

                <button
                    className="checkin-button"
                    type="submit"
                    disabled={!isRoomAvailable || !formData.checkin_date || !formData.room_id}
                >
                    {isRoomAvailable ? 'Confirm Check-In' : 'Checking Availability...'}
                </button>
            </form>

            <Link to="/MainMenu" className="back-button">
                Back
            </Link>
        </div>
    );
};

export default CheckIn;
