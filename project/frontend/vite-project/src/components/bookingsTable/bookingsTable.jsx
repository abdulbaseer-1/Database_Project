import React, { useState, useEffect } from 'react';
import axios from 'axios';
import table_style from './BookingTable.module.css';

const URL = import.meta.env.VITE_BACKEND_URL;

const BookingsTable = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${URL}/api/bookings/my`, {
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.data && Array.isArray(response.data.bookings)) {
          setBookings(response.data.bookings);
        } else {
          throw new Error('Invalid bookings data format');
        }
      } catch (error) {
        setError(error.message);
        console.error('Error fetching bookings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyBookings();
  }, []);

  const deleteBooking = async (id) => {
    try {
      await axios.delete(`${URL}/api/bookings/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      // Update the bookings list after successful deletion
      setBookings((prevBookings) => prevBookings.filter((booking) => booking.booking_id !== id));
    } catch (error) {
      console.error('Error deleting booking:', error.message);
      setError('Failed to delete booking. Please try again.');
    }
  };

  return (
    <div>
      {isLoading ? (
        <div className={table_style.loading_container}>Loading...</div>
      ) : error ? (
        <div className={table_style.error_container}>Error: {error}</div>
      ) : (
        <table className={table_style.booking_table}>
          <thead>
            <tr>
              <th>Route</th>
              <th>Seat Number</th>
              <th>Passenger Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr key={booking.booking_id || index}>
                <td>{`${booking._source} → ${booking.destination}`}</td>
                <td>{booking.seat_number}</td>
                <td>{booking.passenger_name}</td>
                <td>
                  <button onClick={() => deleteBooking(booking.booking_id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BookingsTable;
