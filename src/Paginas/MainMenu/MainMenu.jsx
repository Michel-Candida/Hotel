import React from 'react';
import { Link } from 'react-router-dom';
import { BsBarChartLineFill, BsFillPersonFill, BsFillHouseDoorFill, BsSearch } from 'react-icons/bs'; 
import { FaUserEdit, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa'; 
import './MainMenu.css'

const MainMenu = () => {
    const menuItems = [
        { name: 'Client Register', path: '/ClientRegister', icon: <BsFillPersonFill /> },
        { name: 'User Update', path: '/UserUpdate', icon: <FaUserEdit /> },
        { name: 'Search User', path: '/SearchUser', icon: <BsSearch /> },
        { name: 'Room Register', path: '/RoomRegistration', icon: <BsFillHouseDoorFill /> },
        { name: 'Room Update', path: '/RoomUpdate', icon: <BsFillHouseDoorFill /> },
        { name: 'Dashboard', path: '/Dashboard', icon: <BsBarChartLineFill /> },
        { name: 'Check In', path: '/CheckIn', icon: <FaSignInAlt /> },
        { name: 'Check Out', path: '/CheckOut', icon: <FaSignOutAlt /> },
    ];

    return (
        <div className="main-menu">
            {menuItems.map((item) => (
                <Link key={item.name} to={item.path} className="menu-item">
                    {item.icon}
                    <div className="label">{item.name}</div>
                </Link>
            ))}
        </div>
    );
};

export default MainMenu;
