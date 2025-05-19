import React from 'react';
import Navbar_style from  './Navbar.module.css';
import { Link } from 'react-router-dom'; 

function Navbar({ className }) {
    const role = localStorage.getItem('role');

    return (
        <div className={`${Navbar_style.navbar} ${className}`}>
            <div><br /></div>
            <Link to="/">Home</Link>
            <Link to="/Bookings">Bookings</Link>
            <Link to="/Settings">Settings</Link>
            <Link to="/ContactUs">Contact us</Link>
        </div>
    );
}

export default Navbar;