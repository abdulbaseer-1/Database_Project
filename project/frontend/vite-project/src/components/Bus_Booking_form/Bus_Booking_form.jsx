import React, { useState, useEffect } from 'react';
import { useBusContext } from '../contexts/bustableContext.jsx';
import styles from './Bus_Booking_form.module.css';
const URL = import.meta.env.VITE_BACKEND_URL;

if (!URL) {
  console.error('Environment variables:', import.meta.env);
  throw new Error('VITE_BACKEND_URL is not defined in the environment file');
}

function BusBookingForm() {
  const { selectedBus } = useBusContext(); // Accessing the selected bus data from context

  const [passengerName, setPassengerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
    const [departureTime, setDepartureTime] = useState('');
  const [departureLocation, setDepartureLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [seatNumber, setSeatNumber] = useState('');
  const [busType, setBusType] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    // Automatically populate fields when `selectedBus` changes
    if (selectedBus) {
      setDepartureLocation(selectedBus.startLocation || '');
      setDestination(selectedBus.endLocation || '');
      setDepartureTime(selectedBus.departureTime || '');
      setBusType(selectedBus.type || 'Standard');
    }
  }, [selectedBus]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const seatNumbersArray = seatNumber
      .split(',')
      .map((seat) => seat.trim())
      .filter((seat) => !isNaN(seat) && Number(seat) > 0);

    if (seatNumbersArray.length === 0) {
      alert('Please enter valid seat numbers.');
      return;
    }

    const bookingDetails = {
      passengerName,
      contactNumber,
      departureTime,
      departureLocation,
      destination,
      seatNumbers: seatNumbersArray,
      busType,
    };

    try {
      const response = await fetch(`${URL}/api/bookings/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingDetails),
      });

      if (response.ok) {
        console.log('Booking Details:', bookingDetails);
        alert('Bus booking submitted successfully!');
      } else {
        const errorData = await response.json();
        console.error('Error submitting booking:', errorData.message || response.statusText);
        alert('Failed to submit booking.');
      }
    } catch (error) {
      console.error('Network Error:', error);
      alert('An error occurred. Please check your network and try again.');
    }
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
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Contact Number:</label>
              <input
                type="text"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                required
              />
            </div>
          </div>
          <div className={styles.inlineGroup}>
            <div className={styles.formGroup}>
              <label>Destination:</label>
              <input
                type="text"
                value={destination}
                readOnly
              />
            </div>
            <div className={styles.formGroup}>
              <label>Departure Location:</label>
              <input
                type="text"
                value={departureLocation}
                readOnly
              />
            </div>
          </div>
          <div className={styles.inlineGroup}>
            <div className={styles.formGroup}>
              <label>Departure:</label>
              <input
                type="text"
                value={departureTime}
                readOnly
              />
            </div>
          </div>
          <div className={styles.inlineGroup}>
            <div className={styles.formGroup}>
              <label>Seat Numbers:</label>
              <input
                type="text"
                value={seatNumber}
                onChange={(e) => setSeatNumber(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Bus Type:</label>
              <input
                type="text"
                value={busType}
                readOnly
              />
            </div>
          </div>
          <button type="submit" className={styles.submitButton}>Book Seats</button>
        </form>
      </div>
    </div>
  );
}

export default BusBookingForm;
