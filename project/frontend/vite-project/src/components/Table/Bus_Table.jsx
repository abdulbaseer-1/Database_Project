import React, { useState, useEffect } from 'react';
import table_style from "./Bus_Table.module.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Bus_Table = ({ className }) => {
  const columns = ['Bus ID', 'Start Location', 'End Location', 'Departure Time', 'Type', 'Actions'];
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({ start: '', end: '', time: '', type: '' });
  const [uniqueFilters, setUniqueFilters] = useState({ start: [], end: [], time: [], type: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('https://your-api-url.com/api/buses', {
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.data && Array.isArray(response.data.buses)) {
          const buses = response.data.buses;
          setData(buses);
          setFilteredData(buses);

          setUniqueFilters({
            start: [...new Set(buses.map(b => b.start_location))],
            end: [...new Set(buses.map(b => b.end_location))],
            time: [...new Set(buses.map(b => new Date(b.departure_time).toLocaleString()))],
            type: [...new Set(buses.map(b => b.bus_type || 'Standard'))],
          });
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

  useEffect(() => {
    const filtered = data.filter(bus =>
      (!filters.start || bus.start_location === filters.start) &&
      (!filters.end || bus.end_location === filters.end) &&
      (!filters.time || new Date(bus.departure_time).toLocaleString() === filters.time) &&
      (!filters.type || (bus.bus_type || 'Standard') === filters.type)
    );
    setFilteredData(filtered);
  }, [filters, data]);

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
    navigate(`/Bus_View/${id}`);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const resetFilters = () => {
    setFilters({ start: '', end: '', time: '', type: '' });
  };

  return (
    <div className={`${table_style.table_container} ${className}`}>
      <h2 className={table_style.table_heading}>Available Buses</h2>

      <div className={table_style.filter_container}>
        <select
          value={filters.start}
          onChange={(e) => handleFilterChange('start', e.target.value)}
          className={table_style.filter_select}
        >
          <option value="">Start Location</option>
          {uniqueFilters.start.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>

        <select
          value={filters.end}
          onChange={(e) => handleFilterChange('end', e.target.value)}
          className={table_style.filter_select}
        >
          <option value="">End Location</option>
          {uniqueFilters.end.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>

        <select
          value={filters.time}
          onChange={(e) => handleFilterChange('time', e.target.value)}
          className={table_style.filter_select}
        >
          <option value="">Departure Time</option>
          {uniqueFilters.time.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <select
          value={filters.type}
          onChange={(e) => handleFilterChange('type', e.target.value)}
          className={table_style.filter_select}
        >
          <option value="">Bus Type</option>
          {uniqueFilters.type.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <button className={table_style.reset_button} onClick={resetFilters}>Reset</button>
      </div>

      {isLoading ? (
        <div className={table_style.loading_container}>Loading...</div>
      ) : error ? (
        <div className={table_style.error_container}>Error: {error}</div>
      ) : (
        <table className={table_style.bus_table}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col} className={table_style.table_header}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((bus, index) => (
              <tr key={bus._id || index} className={table_style.table_row}>
                <td className={table_style.table_cell}>{bus.bus_id}</td>
                <td className={table_style.table_cell}>{bus.start_location}</td>
                <td className={table_style.table_cell}>{bus.end_location}</td>
                <td className={table_style.table_cell}>
                  {new Date(bus.departure_time).toLocaleString()}
                </td>
                <td className={table_style.table_cell}>{bus.bus_type || 'Standard'}</td>
                <td className={table_style.table_cell_centered}>
                  <button onClick={() => handleViewDetails(bus._id)} className={table_style.action_button}>View</button>
                  {role === 'admin' && (
                    <button onClick={() => handleDelete(bus._id)} className={table_style.action_button}>Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Bus_Table;
