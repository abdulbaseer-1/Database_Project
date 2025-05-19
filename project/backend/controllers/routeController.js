// controllers/routeController.js
const { Route, Bus } = require('../models');

module.exports = {
  getAllRoutes: async (req, res, next) => {
    try {
      const routes = await Route.findAll({ include: { model: Bus, as: 'bus' } });
      res.json(routes);
    } catch (err) {
      next(err);
    }
  },

  getRouteById: async (req, res, next) => {
    try {
      const route = await Route.findByPk(req.params.id, { include: { model: Bus, as: 'bus' } });
      if (!route) return res.status(404).json({ message: 'Route not found' });
      res.json(route);
    } catch (err) {
      next(err);
    }
  },

  createRoute: async (req, res, next) => {
    try {
      const { source, destination, departure_time, arrival_time, bus_id } = req.body;
      const route = await Route.create({ source, destination, departure_time, arrival_time, bus_id });
      res.status(201).json(route);
    } catch (err) {
      next(err);
    }
  },

  updateRoute: async (req, res, next) => {
    try {
      const { source, destination, departure_time, arrival_time, bus_id } = req.body;
      const [updated] = await Route.update(
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
      const deleted = await Route.destroy({ where: { id: req.params.id } });
      if (!deleted) return res.status(404).json({ message: 'Route not found' });
      res.json({ message: 'Route deleted' });
    } catch (err) {
      next(err);
    }
  }
};
