// controllers/adminController.js
const { User, Bus, Route, Booking } = require('../models');

module.exports = {
  dashboard: async (req, res, next) => {
    try {
      const [userCount, busCount, routeCount, bookingCount] = await Promise.all([
        User.count(),
        Bus.count(),
        Route.count(),
        Booking.count()
      ]);
      res.json({ userCount, busCount, routeCount, bookingCount });
    } catch (err) {
      next(err);
    }
  }
};
