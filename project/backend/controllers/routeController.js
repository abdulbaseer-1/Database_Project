// controllers/routeController.js
const { Route, Bus } = require('../models');
const pool = require('../config/db');

module.exports = {
  getAllRoutes: async (req, res, next) => {
    try {
      // const routes = await Route.findAll({ include: { model: Bus, as: 'bus' } });
      const routes = await pool.query('SELECT * FROM routes');
      res.json(routes);
    } catch (err) {
      next(err);
    }
  },

  getRouteById: async (req, res, next) => {
    try {
      // const route = await Route.findByPk(req.params.id, { include: { model: Bus, as: 'bus' } });
      const route = await pool.query('SELECT * FROM routes WHERE id = $1', [req.params.id]);
      if (!route) return res.status(404).json({ message: 'Route not found' });
      res.json(route);
    } catch (err) {
      next(err);
    }
  },

  createRoute: async (req, res, next) => {
    try {
      const { source, destination, departure_time, arrival_time, bus_id } = req.body;
      // const route = await Route.create({ source, destination, departure_time, arrival_time, bus_id });
      const route = await pool.query(
        'INSERT INTO routes (source, destination, departure_time, arrival_time, bus_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [source, destination, departure_time, arrival_time, bus_id]
      );
      if (!route) return res.status(400).json({ message: 'Error creating route' });
      // Assuming route is an object with the created route data
      res.status(201).json(route);
    } catch (err) {
      next(err);
    }
  },

  updateRoute: async (req, res, next) => {
    try {
      const { source, destination, departure_time, arrival_time, bus_id } = req.body;
      // const [updated] = await Route.update(
      const updated = await pool.query(
        'UPDATE routes SET source = $1, destination = $2, departure_time = $3, arrival_time = $4, bus_id = $5 WHERE id = $6 RETURNING *',
        { source, destination, departure_time, arrival_time, bus_id },
        { where: { id: req.params.id } }
      );
      if (!updated) return res.status(404).json({ message: 'Route not found' });
      res.json({ message: 'Route updated' });
    } catch (err) {
      next(err);
    }
  },

  deleteRoute: async (req, res, next) => {
    try {
      // const deleted = await Route.destroy({ where: { id: req.params.id } });
      const deleted = await pool.query('DELETE FROM routes WHERE id = $1 RETURNING *', [req.params.id]);
      if (!deleted) return res.status(404).json({ message: 'Route not found' });
      res.json({ message: 'Route deleted' });
    } catch (err) {
      next(err);
    }
  }
};
