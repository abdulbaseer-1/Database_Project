import React, { useState, useEffect } from 'react';
import table_style from "./Bus_Table.module.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Bus_Table = ({ className }) => {
  const columns = ['Bus ID', 'Start Location', 'End Location', 'Departure Time', 'Actions'];
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('https://your-api-url.com/api/buses', {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.data && Array.isArray(response.data.buses)) {
          setData(response.data.buses);
        } else {
          throw new Error('Data format is incorrect');
        }
      } catch (error) {
        setError(error.message);
        console.error('Error fetching bus data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://your-api-url.com/api/buses/${id}`);
      setData(prev => prev.filter(bus => bus._id !== id));
    } catch (error) {
      console.error('Error deleting bus:', error);
      alert('Failed to delete bus.');
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/Bus_View/${id}`); // Passing ID via URL param
  };

  if (isLoading) {
    return <div className={table_style.loading_container}>Loading...</div>;
  }

  if (error) {
    return <div className={table_style.error_container}>Error: {error}</div>;
  }

  return (
    <div className={`${table_style.table_container} ${className}`}>
      <table className={`${table_style.bus_table} ${className}`}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col} className={table_style.table_header}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((bus, index) => (
            <tr key={bus._id || index} className={table_style.table_row}>
              <td className={table_style.table_cell}>{bus.bus_id}</td>
              <td className={table_style.table_cell}>{bus.start_location}</td>
              <td className={table_style.table_cell}>{bus.end_location}</td>
              <td className={table_style.table_cell}>
                {new Date(bus.departure_time).toLocaleString()}
              </td>
              <td className={table_style.table_cell_centered}>
                <button 
                  onClick={() => handleViewDetails(bus._id)} 
                  className={table_style.action_button}
                >
                  View
                </button>
                {role === 'admin' && (
                  <button 
                    onClick={() => handleDelete(bus._id)} 
                    className={table_style.action_button}
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Bus_Table;
