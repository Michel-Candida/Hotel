import React, { useState, useEffect } from "react";
import styles from "./RoomRegistration.module.css";

const RoomRegistration = () => {
    const [roomDetails, setRoomDetails] = useState({
        id: "",
        name: "",
        beds: "",
        bathroom: "",
        capacity: "",
        size: "",
        options: [],
    });
    
    // Flag para indicar se o banco de dados já está configurado
    const isDatabaseConfigured = false; // Altere para 'true' quando o banco de dados estiver configurado

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

    useEffect(() => {
        if (isDatabaseConfigured) {
            // Lógica para buscar o último ID do banco de dados
            const fetchLastRoomIdFromDatabase = async () => {
                const lastRoomId = 100; // Exemplo fictício
                setRoomDetails((prev) => ({ ...prev, id: lastRoomId + 1 }));
            };

            fetchLastRoomIdFromDatabase();
        } else {
            // Lógica para gerar um ID localmente (em teste)
            const lastRoomId = localStorage.getItem("lastRoomId") || 0;
            const nextRoomId = Number(lastRoomId) + 1;
            setRoomDetails((prev) => ({ ...prev, id: nextRoomId }));
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRoomDetails({ ...roomDetails, [name]: value });
    };

    const handleOptionChange = (option) => {
        setRoomDetails((prevState) => {
            const options = prevState.options.includes(option)
                ? prevState.options.filter((opt) => opt !== option)
                : [...prevState.options, option];
            return { ...prevState, options };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Room Details Submitted:", roomDetails);
        if (!isDatabaseConfigured) {
            localStorage.setItem("lastRoomId", roomDetails.id);
        }

        alert(`Room registered successfully! Room Code: ${roomDetails.id}`);
        setRoomDetails({
            id: isDatabaseConfigured ? roomDetails.id + 1 : Number(localStorage.getItem("lastRoomId")) + 1,
            name: "",
            beds: "",
            bathroom: "",
            capacity: "",
            size: "",
            options: [],
        });
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Room Registration</h1>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Room Code (Auto-generated)</label>
                    <input type="text" value={roomDetails.id} disabled className={styles.input} />
                </div>

                {[ 
                    { label: "Room Name", name: "name", type: "text" },
                    { label: "Number of Beds", name: "beds", type: "number" },
                    { label: "Number of Bathrooms", name: "bathroom", type: "number" },
                    { label: "Capacity (People)", name: "capacity", type: "number" },
                    { label: "Room Size (m²)", name: "size", type: "number" },
                ].map(({ label, name, type }) => (
                    <div key={name} className={styles.formGroup}>
                        <label className={styles.label}>{label}</label>
                        <input
                            type={type}
                            name={name}
                            value={roomDetails[name]}
                            onChange={handleInputChange}
                            required
                            className={styles.input}
                        />
                    </div>
                ))}

                <div className={styles.formGroup}>
                    <label className={styles.label}>Room Options:</label>
                    <div className={styles.checkboxGroup}>
                        {roomOptions.map((option) => (
                            <label key={option} className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={roomDetails.options.includes(option)}
                                    onChange={() => handleOptionChange(option)}
                                />
                                {option}
                            </label>
                        ))}
                    </div>
                </div>

                <button type="submit" className={styles.button}>Register Room</button>
            </form>
        </div>
    );
};

export default RoomRegistration;
