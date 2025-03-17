import React, { useState } from "react";
import styles from "./RoomUpdate.module.css";

const RoomUpdate = () => {
    const [roomCode, setRoomCode] = useState("");
    const [roomDetails, setRoomDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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

    // Simulação de um banco de dados (substituir por API depois)
    const mockDatabase = {
        "101": {
            name: "Suite Deluxe",
            beds: 2,
            bathroom: 1,
            capacity: 4,
            size: 35,
            options: ["Double Bed", "Garden View", "Wireless Internet"],
        },
        "102": {
            name: "Standard Room",
            beds: 1,
            bathroom: 1,
            capacity: 2,
            size: 25,
            options: ["Twin Bed", "Cable TV", "Non-Smoking"],
        },
    };

    // Buscar quarto pelo código
    const fetchRoomData = () => {
        setLoading(true);
        setTimeout(() => {
            if (mockDatabase[roomCode]) {
                setRoomDetails(mockDatabase[roomCode]);
                setError("");
            } else {
                setRoomDetails(null);
                setError("Room not found. Please check the code.");
            }
            setLoading(false);
        }, 1000);
    };

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
        console.log("Updated Room Details:", roomDetails);
        alert("Room updated successfully!");
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Update Room</h1>

            {/* Campo para buscar o quarto */}
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Enter room code"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                    className={styles.input}
                />
                <button onClick={fetchRoomData} className={styles.button}>
                    {loading ? "Searching..." : "Search"}
                </button>
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {roomDetails && (
                <form onSubmit={handleSubmit}>
                    {[
                        { label: "Room Name/Code", name: "name", type: "text" },
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

                    <button type="submit" className={styles.updateButton}>Update Room</button>
                </form>
            )}
        </div>
    );
};

export default RoomUpdate;
