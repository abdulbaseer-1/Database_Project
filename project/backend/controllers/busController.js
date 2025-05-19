// controllers/busController.js
const { Bus } = require('../models');

module.exports = {
  getAllBuses: async (req, res, next) => {
    try {
      const buses = await Bus.findAll();
      res.json(buses);
    } catch (err) {
      next(err);
    }
  },

  getBusById: async (req, res, next) => {
    try {
      const bus = await Bus.findByPk(req.params.id);
      if (!bus) return res.status(404).json({ message: 'Bus not found' });
      res.json(bus);
    } catch (err) {
      next(err);
    }
  },

  createBus: async (req, res, next) => {
    try {
      const { bus_name, bus_number, image_url, total_seats } = req.body;
      const bus = await Bus.create({ bus_name, bus_number, image_url, total_seats });
      res.status(201).json(bus);
    } catch (err) {
      next(err);
    }
  },

  updateBus: async (req, res, next) => {
    try {
      const { bus_name, bus_number, image_url, total_seats } = req.body;
      const [updated] = await Bus.update(
        { bus_name, bus_number, image_url, total_seats },
        { where: { id: req.params.id } }
      );
      if (!updated) return res.status(404).json({ message: 'Bus not found' });
      res.json({ message: 'Bus updated' });
    } catch (err) {
      next(err);
    }
  },

  deleteBus: async (req, res, next) => {
    try {
      const deleted = await Bus.destroy({ where: { id: req.params.id } });
      if (!deleted) return res.status(404).json({ message: 'Bus not found' });
      res.json({ message: 'Bus deleted' });
    } catch (err) {
      next(err);
    }
  }
};
