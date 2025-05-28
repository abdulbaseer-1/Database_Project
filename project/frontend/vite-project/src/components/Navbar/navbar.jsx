import React, { useContext } from 'react';
import { UserContext } from '../../components/contexts/userContexts.jsx';
import Navbar_style from './Navbar.module.css';
import { Link } from 'react-router-dom';

function Navbar({ className }) {
    const { role, isLoading, error } = useContext(UserContext);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className={`${Navbar_style.navbar} ${className}`}>
            <Link to="/Home">Home</Link>
            <Link to="/Bookings">Bookings</Link>
            <Link to="/Settings">Settings</Link>
            <Link to="/ContactUs">Contact us</Link>
            <Link to="/Query"> Query</Link>
            {role === 'admin' && <Link to="/Query">Query</Link>}
            {/* {error && <p className={Navbar_style.error}>Error: {error}</p>} */}
        </div>
    );
}

export default Navbar;
