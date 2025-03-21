import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
    const [reservations, setReservations] = useState([]);
    const [checkedInGuests, setCheckedInGuests] = useState([]);
    const [availableRooms, setAvailableRooms] = useState([]);
    const [pendingReservations, setPendingReservations] = useState([]);

    useEffect(() => {
        // Buscar dados no back-end para popular a tela
        const fetchData = async () => {
            try {
                const reservationsResponse = await axios.get('http://localhost:5000/reservations');
                const checkedInResponse = await axios.get('http://localhost:5000/checkedin');
                const roomsResponse = await axios.get('http://localhost:5000/rooms');
                const pendingResponse = await axios.get('http://localhost:5000/pending-reservations');
                
                setReservations(reservationsResponse.data);
                setCheckedInGuests(checkedInResponse.data);
                setAvailableRooms(roomsResponse.data.filter(room => room.isAvailable));
                setPendingReservations(pendingResponse.data);
            } catch (error) {
                console.error("Error fetching data for dashboard:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Hotel Dashboard</h1>

            <div className="dashboard-section">
                <h2>Current Reservations</h2>
                <ul>
                    {reservations.map(reservation => (
                        <li key={reservation.id}>
                            <span>{reservation.clientName} - Room: {reservation.roomNumber}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="dashboard-section">
                <h2>Checked-In Guests</h2>
                <ul>
                    {checkedInGuests.map(guest => (
                        <li key={guest.id}>
                            <span>{guest.name} - Room: {guest.roomNumber}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="dashboard-section">
                <h2>Available Rooms</h2>
                <ul>
                    {availableRooms.map(room => (
                        <li key={room.id}>
                            <span>Room {room.id} - {room.name}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="dashboard-section">
                <h2>Pending Reservations</h2>
                <ul>
                    {pendingReservations.map(reservation => (
                        <li key={reservation.id}>
                            <span>{reservation.clientName} - Room: {reservation.roomNumber}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;
