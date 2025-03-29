import React, { useState, useEffect } from "react";
import styles from "./RoomRegistration.module.css";
import axios from "axios";

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
    
    const isDatabaseConfigured = true;

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
            const fetchLastRoomIdFromDatabase = async () => {
                const lastRoomId = 100;
                setRoomDetails((prev) => ({ ...prev, id: lastRoomId + 1 }));
            };

            fetchLastRoomIdFromDatabase();
        } else {
            const lastRoomId = localStorage.getItem("lastRoomId") || 0;
            const nextRoomId = Number(lastRoomId) + 1;
            setRoomDetails((prev) => ({ ...prev, id: nextRoomId }));
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (value < 0) {
            alert("The value cannot be negative!");
            return;
        }
    
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
 
    const handleSubmit = async (e) => {
        e.preventDefault();
      
        if (roomDetails.name.length < 3) {
          alert("Room name must be at least 3 characters long.");
          return;
        }
      
        if (roomDetails.beds < 1 || roomDetails.bathroom < 1 || roomDetails.capacity < 1 || roomDetails.size < 1) {
          alert("No numeric field can be negative or zero.");
          return;
        }
      
        if (roomDetails.options.length === 0) {
          alert("Please select at least one room option.");
          return;
        }
      
        try {
          const response = await axios.post("http://localhost:5000/rooms", roomDetails);
          alert(`Room registered successfully! Room Code: ${response.data.room.room_id}`);
        } catch (error) {
          console.error(error);
          alert("Error registering room!");
        }
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
                            autoComplete="off"
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
                                    autoComplete="off"
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
