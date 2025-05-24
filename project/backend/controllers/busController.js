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
      const { bus_name, bus_number, image_url, total_seats } = req.body;

      if (!bus_name || !bus_number || !image_url || !total_seats) {
        return res.status(400).json({ message: 'All fields are required: bus_name, bus_number, image_url, total_seats' });
      }

      const [result] = await pool.query(
        'INSERT INTO buses (bus_name, bus_number, image_url, total_seats) VALUES (?, ?, ?, ?)',
        [bus_name, bus_number, image_url, total_seats]
      );

      res.status(201).json({
        id: result.insertId,
        bus_name,
        bus_number,
        image_url,
        total_seats,
      });
    } catch (err) {
      console.error('Error creating bus:', err);
      next(err);
    }
  },

  updateBus: async (req, res, next) => {
    try {
      const { bus_name, bus_number, image_url, total_seats } = req.body;

      if (!bus_name || !bus_number || !image_url || !total_seats) {
        return res.status(400).json({ message: 'All fields are required: bus_name, bus_number, image_url, total_seats' });
      }

      const [result] = await pool.query(
        'UPDATE buses SET bus_name = ?, bus_number = ?, image_url = ?, total_seats = ? WHERE id = ?',
        [bus_name, bus_number, image_url, total_seats, req.params.id]
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
