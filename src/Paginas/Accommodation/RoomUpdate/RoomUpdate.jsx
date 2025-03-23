import React, { useState } from "react";
import axios from "axios"; 
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

    const fetchRoomData = () => {
        setLoading(true);
        setError("");
    
        axios
            .get(`http://localhost:5000/api/rooms/${roomCode}`)  
            .then((response) => {
                setRoomDetails(response.data);
            })
            .catch((err) => {
                setRoomDetails(null);
                setError("Room not found. Please check the code.");
            })
            .finally(() => {
                setLoading(false);
            });
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
    
        if (
            roomDetails.beds < 1 ||
            roomDetails.bathroom < 1 ||
            roomDetails.capacity < 1 ||
            roomDetails.size < 1
        ) {
            alert("Nenhum campo numérico pode ser negativo ou zero.");
            return;
        }
    
        if (roomDetails.name.length < 3) {
            alert("O nome do quarto deve ter pelo menos 3 caracteres.");
            return;
        }
    
        if (roomDetails.options.length === 0) {
            alert("Por favor, selecione pelo menos uma opção para o quarto.");
            return;
        }
    
        setLoading(true);
    
        axios
            .put(`http://localhost:5000/api/rooms/${roomCode}`, roomDetails) 
            .then(() => {
                alert("Room updated successfully!");
            })
            .catch((err) => {
                setError("Error updating the room.");
            })
            .finally(() => {
                setLoading(false);
            });
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
                    {[{
                        label: "Room Name/Code", name: "name", type: "text"
                    }, {
                        label: "Number of Beds", name: "beds", type: "number"
                    }, {
                        label: "Number of Bathrooms", name: "bathroom", type: "number"
                    }, {
                        label: "Capacity (People)", name: "capacity", type: "number"
                    }, {
                        label: "Room Size (m²)", name: "size", type: "number"
                    }].map(({ label, name, type }) => (
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

                    <button type="submit" className={styles.updateButton}>
                        {loading ? "Updating..." : "Update Room"}
                    </button>
                </form>
            )}
        </div>
    );
};

export default RoomUpdate;
