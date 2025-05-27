import React, { useState, useEffect } from 'react';
import Navbar_style from './Navbar.module.css';
import { Link } from 'react-router-dom';

function Navbar({ className }) {
    const [role, setRole] = useState(null);
    const [error, setError] = useState(null); // To store any fetch errors

    useEffect(() => {
        const fetchRole = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error("User not authenticated. Please log in.");
                }

                const response = await fetch('/api/user/role', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }

                const data = await response.json();
                if (!data.role) {
                    throw new Error("No role returned from server.");
                }

                setRole(data.role); // Set user role in state
            } catch (error) {
                console.error('Error fetching role:', error.message);
                setError(error.message); // Save the error to state
            }
        };

        fetchRole();
    }, []);

    return (
        <div className={`${Navbar_style.navbar} ${className}`}>
            <Link to="/Home">Home</Link>
            <Link to="/Bookings">Bookings</Link>
            <Link to="/Settings">Settings</Link>
            <Link to="/ContactUs">ContactUs</Link>
            {role === 'admin' && <Link to="/Query">Query</Link>}
            {error && <p className={Navbar_style.error}>Error: {error}</p>}
        </div>
    );
}

export default Navbar;
