// controllers/adminController.js
const pool = require("../middleware/db")

const { User, Bus, Route, Booking } = require('../models');

module.exports = {
  dashboard: async (req, res, next) => {
    try {
      const [userCount, busCount, routeCount, bookingCount] = await Promise.all([
        pool.query('SELECT COUNT(*) FROM users'),
        pool.query('SELECT COUNT(*) FROM buses'),
        pool.query('SELECT COUNT(*) FROM routes'),
        pool.query('SELECT COUNT(*) FROM bookings')
      ]);
      res.json({ userCount, busCount, routeCount, bookingCount });
    } catch (err) {
      next(err);
    }
  }
};
