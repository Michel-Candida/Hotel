import React, { useState } from "react";
import styles from "./RoomRegistration.module.css";
import axios from "axios";

const RoomRegistration = () => {
    const [roomDetails, setRoomDetails] = useState({
        number_room: "",
        name: "",
        type_room: "",
        category_room: "",
        beds: "",
        size: "",
        options: [],
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const api = axios.create({
        baseURL: "http://localhost:5000/api",
        timeout: 10000
    });

    const roomTypes = ["Single room", "Double room", "Triple room", "Quadruple room"];
    const roomCategories = ["Main house", "Garden", "Tower 1", "Tower 2"];
    const roomOptions = [
        "Double Bed",
        "Twin Bed",
        "Garden View",
        "Beach View",
        "Lake View",
        "Bathroom with Bathtub",
        "Living Area",
        "Cable TV",
        "Wireless Internet",
        "Hair Dryer",
        "In-room Safe",
        "Non-Smoking",
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRoomDetails({ ...roomDetails, [name]: value });
        setError("");
        setSuccess("");
    };

    const handleOptionChange = (option) => {
        setRoomDetails((prevState) => {
            const options = prevState.options.includes(option)
                ? prevState.options.filter((opt) => opt !== option)
                : [...prevState.options, option];
            return { ...prevState, options };
        });
        setError("");
        setSuccess("");
    };

    const validateForm = () => {
        if (roomDetails.name.length < 3) {
            setError("Room name must be at least 3 characters long.");
            return false;
        }

        if (!roomDetails.number_room) {
            setError("Please enter a room number.");
            return false;
        }

        if (roomDetails.beds < 1 || roomDetails.size < 1) {
            setError("Number of beds and room size must be positive values.");
            return false;
        }

        if (!roomDetails.type_room || !roomDetails.category_room) {
            setError("Please select room type and category.");
            return false;
        }

        if (roomDetails.options.length === 0) {
            setError("Please select at least one room option.");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await api.post("/rooms", roomDetails);
            
            setSuccess(`Room ${response.data.room.number_room} registered successfully!`);
            setRoomDetails({
                number_room: "",
                name: "",
                type_room: "",
                category_room: "",
                beds: "",
                size: "",
                options: [],
            });
        } catch (error) {
            console.error("Registration error:", error);
            if (error.response?.data?.message?.includes("already exists")) {
                setError(`Room number ${roomDetails.number_room} already exists.`);
            } else {
                setError(error.response?.data?.message || "Error registering room. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Room Registration</h1>
            
            {error && <div className={styles.error}>{error}</div>}
            {success && <div className={styles.success}>{success}</div>}

            <form onSubmit={handleSubmit}>
                {[ 
                    { label: "Room Number", name: "number_room", type: "text" },
                    { label: "Room Name", name: "name", type: "text" },
                    { label: "Number of Beds", name: "beds", type: "number", min: 1 },
                    { label: "Room Size (m²)", name: "size", type: "number", min: 1 },
                ].map(({ label, name, type, min }) => (
                    <div key={name} className={styles.formGroup}>
                        <label className={styles.label}>{label}</label>
                        <input
                            type={type}
                            name={name}
                            value={roomDetails[name]}
                            onChange={handleInputChange}
                            required
                            className={styles.input}
                            autoComplete="off"
                            min={min}
                        />
                    </div>
                ))}

                <div className={styles.formGroup}>
                    <label className={styles.label}>Type of Room</label>
                    <select
                        name="type_room"
                        value={roomDetails.type_room}
                        onChange={handleInputChange}
                        className={styles.input}
                        required
                    >
                        <option value="" disabled hidden>Select a room type</option>
                        {roomTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Category of Room</label>
                    <select
                        name="category_room"
                        value={roomDetails.category_room}
                        onChange={handleInputChange}
                        className={styles.input}
                        required
                    >
                        <option value="" disabled hidden>Select a category</option>
                        {roomCategories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Room Options:</label>
                    <div className={styles.checkboxGroup}>
                        {roomOptions.map((option) => (
                            <label key={option} className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={roomDetails.options.includes(option)}
                                    onChange={() => handleOptionChange(option)}
                                    autoComplete="off"
                                />
                                {option}
                            </label>
                        ))}
                    </div>
                </div>

                <button 
                    type="submit" 
                    className={styles.button}
                    disabled={loading}
                >
                    {loading ? "Registering..." : "Register Room"}
                </button>
            </form>
        </div>
    );
};

export default RoomRegistration;