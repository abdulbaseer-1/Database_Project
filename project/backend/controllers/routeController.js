import pool from '../database/db.js';

export default {
  getAllRoutes: async (req, res, next) => {
    try {
      const [routes] = await pool.query(`
        SELECT r.*, b.bus_name, b.bus_number 
        FROM routes AS r 
        LEFT JOIN buses AS b ON r.bus_id = b.id
      `);
      res.json(routes);
    } catch (err) {
      next(err);
    }
  },

  getRouteById: async (req, res, next) => {
    try {
      const [route] = await pool.query(`
        SELECT r.*, b.bus_name, b.bus_number 
        FROM routes AS r 
        LEFT JOIN buses AS b ON r.bus_id = b.id 
        WHERE r.id = ?
      `, [req.params.id]);

      if (route.length === 0) return res.status(404).json({ message: 'Route not found' });

      res.json(route[0]);
    } catch (err) {
      next(err);
    }
  },

  createRoute: async (req, res, next) => {
    try {
      const { source, destination, departure_time, arrival_time, bus_id } = req.body;

      const [result] = await pool.query(`
        INSERT INTO routes (source, destination, departure_time, arrival_time, bus_id) 
        VALUES (?, ?, ?, ?, ?)
      `, [source, destination, departure_time, arrival_time, bus_id]);

      res.status(201).json({
        id: result.insertId,
        source,
        destination,
        departure_time,
        arrival_time,
        bus_id,
      });
    } catch (err) {
      next(err);
    }
  },

  updateRoute: async (req, res, next) => {
    try {
      const { source, destination, departure_time, arrival_time, bus_id } = req.body;

      const [result] = await pool.query(`
        UPDATE routes 
        SET source = ?, destination = ?, departure_time = ?, arrival_time = ?, bus_id = ? 
        WHERE id = ?
      `, [source, destination, departure_time, arrival_time, bus_id, req.params.id]);

      if (result.affectedRows === 0) return res.status(404).json({ message: 'Route not found' });

      res.json({ message: 'Route updated' });
    } catch (err) {
      next(err);
    }
  },

  deleteRoute: async (req, res, next) => {
    try {
      const [result] = await pool.query('DELETE FROM routes WHERE id = ?', [req.params.id]);

      if (result.affectedRows === 0) return res.status(404).json({ message: 'Route not found' });

      res.json({ message: 'Route deleted' });
    } catch (err) {
      next(err);
    }
  },
};
