import React, { useState, useEffect } from 'react';
import styles from './Route_Form.module.css';

const URL = import.meta.env.VITE_BACKEND_URL;

if (!URL) {
  console.error('Environment variables:', import.meta.env);
  throw new Error('VITE_BACKEND_URL is not defined in the environment file');
}

function Routes() {
  const [routes, setRoutes] = useState([]);
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [busId, setBusId] = useState('');
  const [editingRouteId, setEditingRouteId] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await fetch(`${URL}/api/routes`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setRoutes(data);
      } else {
        console.error('Failed to fetch routes');
      }
    } catch (error) {
      console.error('Error fetching routes:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const routeDetails = {
      _source: source,
      destination,
      departure_time: departureTime,
      arrival_time: arrivalTime,
      bus_id: busId,
    };

    try {
      const method = editingRouteId ? 'PUT' : 'POST';
      const endpoint = editingRouteId ? `${URL}/api/routes/${editingRouteId}` : `${URL}/api/routes`;

      console.log("endpoint : ", endpoint);
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(routeDetails),
      });

      if (response.ok) {
        alert(editingRouteId ? 'Route updated successfully!' : 'Route added successfully!');
        setEditingRouteId(null);
        fetchRoutes();
        resetForm();
      } else {
        const errorData = await response.json();
        console.error('Error submitting route:', errorData.message || response.statusText);
        alert('Failed to submit route.');
      }
    } catch (error) {
      console.error('Error submitting route:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleEdit = (route) => {
    setSource(route._source);
    setDestination(route.destination);
    setDepartureTime(route.departure_time);
    setArrivalTime(route.arrival_time);
    setBusId(route.bus_id);
    setEditingRouteId(route.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this route?')) return;

    try {
      const response = await fetch(`${URL}/api/routes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.ok) {
        alert('Route deleted successfully!');
        fetchRoutes();
      } else {
        console.error('Failed to delete route');
        alert('Failed to delete route.');
      }
    } catch (error) {
      console.error('Error deleting route:', error);
    }
  };

  const resetForm = () => {
    setSource('');
    setDestination('');
    setDepartureTime('');
    setArrivalTime('');
    setBusId('');
  };

  return (
    <div className={styles.routesManagementContainer}>
      <h2>Manage Routes</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Source:</label>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Destination:</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Departure Time:</label>
          <input
            type="datetime-local"
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Arrival Time:</label>
          <input
            type="datetime-local"
            value={arrivalTime}
            onChange={(e) => setArrivalTime(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Bus ID:</label>
          <input
            type="number"
            value={busId}
            onChange={(e) => setBusId(e.target.value)}
            required
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          {editingRouteId ? 'Update Route' : 'Add Route'}
        </button>
      </form>

      <h3>Existing Routes</h3>
      <table className={styles.routesTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Source</th>
            <th>Destination</th>
            <th>Departure Time</th>
            <th>Arrival Time</th>
            <th>Bus ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((route) => (
            <tr key={route.id}>
              <td>{route.id}</td>
              <td>{route._source}</td>
              <td>{route.destination}</td>
              <td>{new Date(route.departure_time).toLocaleString()}</td>
              <td>{new Date(route.arrival_time).toLocaleString()}</td>
              <td>{route.bus_id}</td>
              <td>
                <button onClick={() => handleEdit(route)} className={styles.editButton}>Edit</button>
                <button onClick={() => handleDelete(route.id)} className={styles.deleteButton}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Routes;