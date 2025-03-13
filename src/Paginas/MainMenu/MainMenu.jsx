import React from 'react';
import { Link } from 'react-router-dom';
import './MainMenu.css'; // You can create a CSS file for styling

const MainMenu = () => {
    const menuItems = [
        { name: 'Login', path: '/Login' },
        { name: 'User Update', path: '/UserUpdate' },
        { name: 'User Register', path: '/UserRegister' },
        { name: 'Search User', path: '/SearchUser' },
        { name: 'Check In', path: '/CheckIn' },
        { name: 'Check Out', path: '/CheckOut' },
    ];

    return (
        <div className="main-menu">
            {menuItems.map((item) => (
                <Link key={item.name} to={item.path} className="menu-item">
                    <div className="icon">{/* Add your icon here */}</div>
                    <div className="label">{item.name}</div>
                </Link>
            ))}
        </div>
    );
};

export default MainMenu;
