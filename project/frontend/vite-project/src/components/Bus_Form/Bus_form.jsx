import React, { useState, useEffect } from 'react';
import styles from './Bus_Form.module.css';
const URL = import.meta.env.VITE_BACKEND_URL;

if (!URL) {
  console.error('Environment variables:', import.meta.env);
  throw new Error('VITE_BACKEND_URL is not defined in the environment file');
}

function BusManagementForm() {
  const [buses, setBuses] = useState([]);
  const [busName, setBusName] = useState('');
  const [busNumber, setBusNumber] = useState('');
  const [totalSeats, setTotalSeats] = useState('');
  const [selectedBusId, setSelectedBusId] = useState(null);

  const token = localStorage.getItem('token'); // authorization token , what is local storage ?

  const fetchBuses = async () => {
    try {
      const response = await fetch(`${URL}/api/buses/`);
      const data = await response.json();
      setBuses(data);
    } catch (error) {
      console.error('Error fetching buses:', error);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  const handleAddOrUpdateBus = async (event) => {
    event.preventDefault();

    const busDetails = {
      bus_name: busName,
      bus_number: busNumber,
      total_seats: parseInt(totalSeats, 10),
    };

    try {
      const endpoint = selectedBusId ? `${URL}/api/buses/${selectedBusId}` : `${URL}/api/buses`;
      console.log("end point :" , endpoint);
      const method = selectedBusId ? 'PUT' : 'POST';
      console.log("method :" , method);

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization' : `Bearer ${token}`,
        },
        body: JSON.stringify(busDetails),
      });

      if (response.ok) {
        alert(`Bus ${selectedBusId ? 'updated' : 'added'} successfully!`);
        fetchBuses();
        resetForm();
      } else {
        const errorData = await response.json();
        alert(`Failed to ${selectedBusId ? 'update' : 'add'} bus: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleDeleteBus = async (busId) => {
  if (!window.confirm('Are you sure you want to delete this bus?')) return;

  try {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    if (!token) {
      alert('Authentication token missing. Please log in again.');
      return;
    }

    const response = await fetch(`${URL}/api/buses/${busId}`, {
      method: 'DELETE',
      headers: { // Correct placement of headers
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      alert('Bus deleted successfully!');
      fetchBuses(); // Refresh the bus list after deletion
    } else {
      const errorData = await response.json();
      alert(`Failed to delete bus: ${errorData.message}`);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
  }
};


  const resetForm = () => {
    setBusName('');
    setBusNumber('');
    setTotalSeats('');
    setSelectedBusId(null);
  };

  const handleEditBus = (bus) => {
    setBusName(bus.bus_name);
    setBusNumber(bus.bus_number);
    setTotalSeats(bus.total_seats);
    setSelectedBusId(bus.id);
  };

  return (
    <div className={styles.content_area}>
      <div className={styles.busManagementContainer}>
        <h2>Bus Management</h2>
        <form onSubmit={handleAddOrUpdateBus}>
          <div className={styles.formGroup}>
            <label>Bus Name:</label>
            <input
              type="text"
              value={busName}
              onChange={(e) => setBusName(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Bus Number:</label>
            <input
              type="text"
              value={busNumber}
              onChange={(e) => setBusNumber(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Total Seats:</label>
            <input
              type="number"
              value={totalSeats}
              onChange={(e) => setTotalSeats(e.target.value)}
              required
            />
          </div>
          <button type="submit">{selectedBusId ? 'Update Bus' : 'Add Bus'}</button>
          {selectedBusId && <button type="button" onClick={resetForm}>Cancel</button>}
        </form>

        <h3>Existing Buses</h3>
        <table className={styles.busTable}>
          <thead>
            <tr>
              <th>Bus Name</th>
              <th>Bus Number</th>
              <th>ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {buses.map((bus) => (
              <tr key={bus.id}>
                <td>{bus.bus_name}</td>
                <td>{bus.bus_number}</td>
                <td>{bus.id}</td>
                <td>
                  <button onClick={() => handleEditBus(bus)}>Edit</button>
                  <button onClick={() => handleDeleteBus(bus.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BusManagementForm;
