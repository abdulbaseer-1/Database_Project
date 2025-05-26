
import axios from 'axios';
import styles from './BookBus.module.css';
import React, { useState } from 'react';

function BookBus() {
    const [passengerName, setPassengerName] = useState('');
    const [cnic, setCnic] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [departureCity, setDepartureCity] = useState('');
    const [destinationCity, setDestinationCity] = useState('');
    const [travelDate, setTravelDate] = useState('');
    const [busType, setBusType] = useState('');
    const [numberOfSeats, setNumberOfSeats] = useState('');
    const [cnicImage, setCnicImage] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const bookingForm = new FormData();
        bookingForm.append('passengerName', passengerName);
        bookingForm.append('cnic', cnic);
        bookingForm.append('phone', phone);
        bookingForm.append('email', email);
        bookingForm.append('departureCity', departureCity);
        bookingForm.append('destinationCity', destinationCity);
        bookingForm.append('travelDate', travelDate);
        bookingForm.append('busType', busType);
        bookingForm.append('numberOfSeats', numberOfSeats);
        bookingForm.append('cnicImage', cnicImage);

        try {
            console.log("Booking Form : ", bookingForm);

            const request = axios.post("https://backend-two-henna-56.vercel.app/api/bookings", bookingForm, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            alert("Bus booked successfully!")
        } catch (error) {
            console.log("Error submitting form", error);
        }
    };

    return (
        <div>
            <div className={styles.content_area}>
                <div className={styles.bookBusContainer}>
                    <h2>Book a Bus</h2>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.inlineGroup}>
                            <div className={styles.formGroup}>
                                <label>Passenger Name:</label>
                                <input
                                    type="text"
                                    id="passenger-name"
                                    value={passengerName}
                                    onChange={(e) => setPassengerName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>CNIC Number:</label>
                                <input
                                    type="text"
                                    id="cnic"
                                    value={cnic}
                                    maxLength={13}
                                    onChange={(e) => setCnic(e.target.value.replace(/[^0-9]/g, ''))}
                                    required
                                />
                            </div>
                        </div>
                        <div className={styles.inlineGroup}>
                            <div className={styles.formGroup}>
                                <label>Phone:</label>
                                <input
                                    type="text"
                                    id="phone"
                                    value={phone}
                                    maxLength={11}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className={styles.inlineGroup}>
                            <div className={styles.formGroup}>
                                <label>Departure City:</label>
                                <input
                                    type="text"
                                    id="departure-city"
                                    value={departureCity}
                                    onChange={(e) => setDepartureCity(e.target.value)}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Destination City:</label>
                                <input
                                    type="text"
                                    id="destination-city"
                                    value={destinationCity}
                                    onChange={(e) => setDestinationCity(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className={styles.inlineGroup}>
                            <div className={styles.formGroup}>
                                <label>Travel Date:</label>
                                <input
                                    type="date"
                                    id="travel-date"
                                    value={travelDate}
                                    onChange={(e) => setTravelDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Bus Type:</label>
                                <select
                                    id="bus-type"
                                    value={busType}
                                    onChange={(e) => setBusType(e.target.value)}
                                    required
                                >
                                    <option value="">Select Bus Type</option>
                                    <option value="ac">AC</option>
                                    <option value="non-ac">Non-AC</option>
                                </select>
                            </div>
                        </div>
                        <div className={styles.inlineGroup}>
                            <div className={styles.formGroup}>
                                <label>Number of Seats:</label>
                                <input
                                    type="text"
                                    id="number-of-seats"
                                    value={numberOfSeats}
                                    onChange={(e) => setNumberOfSeats(e.target.value.replace(/[^0-9]/g, ''))}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>CNIC Image:</label>
                                <input
                                    type="file"
                                    id="cnic-image"
                                    onChange={(e) => setCnicImage(e.target.files[0])}
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default BookBus;
