import pool from '../database/db.js';

export default {
  getAllBuses: async (req, res, next) => {
    try {
      const [buses] = await pool.query('SELECT * FROM buses');
      res.json(buses);
    } catch (err) {
      console.error('Error fetching all buses:', err);
      next(err);
    }
  },

  getBusCustom: async (req, res, next) => {
    try {
      const { departure_time, _source, destination } = req.body;

      if (!departure_time || !_source || !destination) {
        return res.status(400).json({ message: 'All fields are required: departure_time, _source, destination' });
      }

      const [buses] = await pool.query(
        'SELECT * FROM routes WHERE departure_time = ? AND _source = ? AND destination = ?',
        [departure_time, _source, destination]
      );

      if (buses.length === 0) {
        return res.status(404).json({ message: 'No routes found for the given criteria' });
      }

      res.json(buses);
    } catch (err) {
      console.error('Error fetching custom bus routes:', err);
      next(err);
    }
  },

  getBusForBookingsTable : async (req, res) => {
    // Initialize base query and parameters
    let query = `
      SELECT 
        buses.id AS bus_id, 
        routes._source, 
        routes.destination, 
        routes.departure_time, 
        buses.bus_type 
      FROM 
        routes 
      INNER JOIN 
        buses 
      ON 
        routes.bus_id = buses.id `; // Always true, used as a base for adding conditions dynamically

    const queryParams = []; // not need here, but maybe i use later

    try {
      const [rows] = await pool.query(query, queryParams);

      res.json({ buses: rows });
    } catch (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "Server error occurred while querying buses." });
    }

  },

  getFilteredData : async (req, res) => { // to get data for drp options in bus booking form

  console.log("inside get fitered data");
  try {
    const [startLocations] = await pool.query('SELECT DISTINCT _source FROM routes');
    const [endLocations] = await pool.query('SELECT DISTINCT destination FROM routes');
    const [departureTimes] = await pool.query('SELECT DISTINCT departure_time FROM routes');
    const [busTypes] = await pool.query('SELECT DISTINCT bus_type FROM buses');

    res.json({
      startLocations: startLocations.map(row => row._source),
      endLocations: endLocations.map(row => row.destination),
      departureTimes: departureTimes.map(row => new Date(row.departure_time).toLocaleString()),
      busTypes: busTypes.map(row => row.bus_type || 'Standard'),
    });
  } catch (error) {
    console.error('Error fetching filter data:', error);
    res.status(500).json({ error: 'Failed to retrieve filter data' });
  }
},

  getBusById: async (req, res, next) => {
    try {
      const [rows] = await pool.query('SELECT * FROM buses WHERE id = ?', [req.params.id]);

      if (rows.length === 0) {
        return res.status(404).json({ message: 'Bus not found' });
      }

      res.json(rows[0]);
    } catch (err) {
      console.error('Error fetching bus by ID:', err);
      next(err);
    }
  },

  createBus: async (req, res, next) => {
    try {
      const { bus_name, bus_number, total_seats, bus_type } = req.body;

      if (!bus_name || !bus_number || !total_seats || !bus_type) {
        return res.status(400).json({ message: 'All fields are required: bus_name, bus_number, total_seats, bus_type' });
      }

      const [result] = await pool.query(
        'INSERT INTO buses (bus_name, bus_number, total_seats, bus_type) VALUES (?, ?, ?, ?)',
        [bus_name, bus_number, total_seats, bus_type]
      );

      res.status(201).json({
        id: result.insertId,
        bus_name,
        bus_number,
        total_seats,
        bus_type,
      });
    } catch (err) {
      console.error('Error creating bus:', err);
      next(err);
    }
  },

  updateBus: async (req, res, next) => {
    try {
      const { bus_name, bus_number, total_seats, bus_type} = req.body;

      if (!bus_name || !bus_number || !total_seats || !bus_type) {
        return res.status(400).json({ message: 'All fields are required: bus_name, bus_number, total_seats, bus_type' });
      }

      const [result] = await pool.query(
        'UPDATE buses SET bus_name = ?, bus_number = ?, total_seats = ?, bus_type = ? WHERE id = ?',
        [bus_name, bus_number, total_seats, bus_type, req.params.id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Bus not found' });
      }

      res.json({ message: 'Bus updated' });
    } catch (err) {
      console.error('Error updating bus:', err);
      next(err);
    }
  },

  deleteBus: async (req, res, next) => {
    try {
      const [result] = await pool.query('DELETE FROM buses WHERE id = ?', [req.params.id]);

      console.log("deleting");
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Bus not found' });
      }

      res.json({ message: 'Bus deleted' });
    } catch (err) {
      console.error('Error deleting bus:', err);
      next(err);
    }
  },
};
