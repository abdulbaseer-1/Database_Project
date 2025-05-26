
import React, { useState } from 'react';
import styles from './Bus_Booking_form.module.css';

function BusBookingForm() {
    const [passengerName, setPassengerName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [email, setEmail] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [departureTime, setDepartureTime] = useState('');
    const [departureLocation, setDepartureLocation] = useState('');
    const [destination, setDestination] = useState('');
    const [numberOfPassengers, setNumberOfPassengers] = useState(1);

    const handleSubmit = (event) => {
        event.preventDefault();
        const bookingDetails = {
            passengerName,
            contactNumber,
            email,
            departureDate,
            departureTime,
            departureLocation,
            destination,
            numberOfPassengers
        };
        console.log('Booking Details:', bookingDetails);
        alert('Bus booking submitted successfully!');
    };

    return (
        <div className={styles.content_area}>
            <div className={styles.busBookingContainer}>
                <h2>Bus Booking Form</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.inlineGroup}>
                        <div className={styles.formGroup}>
                            <label>Passenger Name:</label>
                            <input
                                type="text"
                                value={passengerName}
                                onChange={(e) => setPassengerName(e.target.value)}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Contact Number:</label>
                            <input
                                type="text"
                                value={contactNumber}
                                onChange={(e) => setContactNumber(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={styles.inlineGroup}>
                        <div className={styles.formGroup}>
                            <label>Email:</label>
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Departure Date:</label>
                            <input
                                type="date"
                                value={departureDate}
                                onChange={(e) => setDepartureDate(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={styles.inlineGroup}>
                        <div className={styles.formGroup}>
                            <label>Departure Time:</label>
                            <input
                                type="text"
                                value={departureTime}
                                onChange={(e) => setDepartureTime(e.target.value)}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Departure Location:</label>
                            <input
                                type="text"
                                value={departureLocation}
                                onChange={(e) => setDepartureLocation(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={styles.inlineGroup}>
                        <div className={styles.formGroup}>
                            <label>Destination:</label>
                            <input
                                type="text"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Number of Passengers:</label>
                            <input
                                type="number"
                                value={numberOfPassengers}
                                onChange={(e) => setNumberOfPassengers(e.target.value)}
                                min="1"
                            />
                        </div>
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default BusBookingForm;
