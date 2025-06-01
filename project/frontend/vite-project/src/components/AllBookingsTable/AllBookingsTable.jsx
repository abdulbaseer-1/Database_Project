import React, { useState, useEffect } from 'react';
import axios from 'axios';
import table_style from './AllBookingsTable.module.css';

const URL = import.meta.env.VITE_BACKEND_URL;

const AllBookingsTable = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    _source: '',
    destination: '',
    departure_time: '',
    passenger_name: '',
    user_id: '',
  });
  const [uniqueFilters, setUniqueFilters] = useState({
    _source: [],
    destination: [],
    departure_time: [],
    passenger_name: [],
    user_id: [],
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${URL}/api/bookings/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.data && Array.isArray(response.data.bookings)) {
          setBookings(response.data.bookings);
          setFilteredData(response.data.bookings); // Initialize filtered data
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

    fetchBookings();
  }, []);


  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await axios.get(`${URL}/api/bookings/filters`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data) {
          setUniqueFilters({
            _source: response.data._source || [],
            destination: response.data.destination || [],
            departure_time: response.data.departure_time || [],
            passenger_name: response.data.passenger_name || [],
            user_id: response.data.user_id || [],
          });
        }
      } catch (error) {
        console.error('Error fetching filter data:', error);
      }
    };

    fetchFilters();
  }, []);

  useEffect(() => {
    const filtered = bookings.filter((booking) =>
      (!filters._source || booking._source === filters._source) &&
      (!filters.destination || booking.destination === filters.destination) &&
      (!filters.departure_time || new Date(booking.departure_time).toLocaleString() === filters.departure_time) &&
      (!filters.passenger_name || booking.passenger_name === filters.passenger_name) &&
      (!filters.user_id || booking.user_id === filters.user_id)
    );
    setFilteredData(filtered);
  }, [filters, bookings]);

  const handleFilterChange = (filterKey, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [filterKey]: value }));
  };

  const deleteBooking = async (id) => {
    try {
      await axios.delete(`${URL}/api/bookings/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking.booking_id !== id)
      );
    } catch (error) {
      console.error('Error deleting booking:', error.message);
      setError('Failed to delete booking. Please try again.');
    }
  };

  return (
    <div className={table_style.main_container}> {/* looking at the table below, it looks menacing but is pretty simple, its just a simple table using a nested ternary operator */}
      {isLoading ? (
        <div className={table_style.loading_container}>Loading...</div>
      ) : error ? (
        <div className={table_style.error_container}>Error: {error}</div>
      ) : (
        <>
          <div className={table_style.filters_container}>
            {Object.keys(uniqueFilters).map((filterKey) => (
              <select
                key={filterKey}
                value={filters[filterKey]}
                onChange={(e) => handleFilterChange(filterKey, e.target.value)}
              >
                <option value="">{`Filter by ${filterKey}`}</option>
                {uniqueFilters[filterKey].map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ))}
          </div>
          <table className={table_style.booking_table}>
            <thead>
              <tr>
                <th>Route</th>
                <th>Departure Time</th>
                <th>Seat Number</th>
                <th>Passenger Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((booking, index) => (
                <tr key={booking.id || index}>
                  <td>{`${booking._source} → ${booking.destination}`}</td>
                  <td>{booking.departure_time}</td>
                  <td>{booking.seat_number}</td>
                  <td>{booking.passenger_name}</td>
                  <td>
                    <button onClick={() => deleteBooking(booking.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default AllBookingsTable;
