import React, { useState, useEffect } from 'react';
import table_style from './Bus_Table.module.css';
import { useBusContext } from '../contexts/bustableContext.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const URL = import.meta.env.VITE_BACKEND_URL;

if (!URL) {
  console.error('Environment variables:', import.meta.env);
  throw new Error('VITE_BACKEND_URL is not defined in the environment file');
}

const Bus_Table = ({ className }) => {
  const columns = ['Bus ID', 'Start Location', 'End Location', 'Departure Time', 'Type', 'Actions'];
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({ start: '', end: '', time: '', type: '' });
  const [uniqueFilters, setUniqueFilters] = useState({ start: [], end: [], time: [], type: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setSelectedBus } = useBusContext(); // Extract context

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${URL}/api/buses/bustable`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.data && Array.isArray(response.data.buses)) {
          const buses = response.data.buses;
          setData(buses);
          setFilteredData(buses);
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
    const fetchFilters = async () => {
      try {
        const response = await axios.get(`${URL}/api/buses/filters`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.data) {
          setUniqueFilters({
            start: response.data.startLocations,
            end: response.data.endLocations,
            time: response.data.departureTimes,
            type: response.data.busTypes,
          });
        }
      } catch (error) {
        console.error('Error fetching filter data:', error);
      }
    };

    fetchFilters();
  }, []);

  useEffect(() => {
    const filtered = data.filter(bus =>
      (!filters.start || bus._source === filters.start) &&
      (!filters.end || bus.destination === filters.end) &&
      (!filters.time || new Date(bus.departure_time).toLocaleString() === filters.time) &&
      (!filters.type || (bus.bus_type || 'Standard') === filters.type)
    );
    setFilteredData(filtered);
  }, [filters, data]);

  const handleBooking = (bus) => {
    setSelectedBus({
      busId: bus.bus_id,
      startLocation: bus._source,
      endLocation: bus.destination,
      departureTime: new Date(bus.departure_time).toLocaleString(),
      type: bus.bus_type || 'Standard',
    });
    navigate('/BookBus'); // Navigate to the booking page
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
                <td className={table_style.table_cell}>{bus._source}</td>
                <td className={table_style.table_cell}>{bus.destination}</td>
                <td className={table_style.table_cell}>
                  {new Date(bus.departure_time).toLocaleString()}
                </td>
                <td className={table_style.table_cell}>{bus.bus_type || 'Standard'}</td>
                <td className={table_style.table_cell_centered}>
                  <button
                    onClick={() => handleBooking(bus)}
                    className={table_style.action_button}
                  >
                    Book Seats
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

export default Bus_Table;
