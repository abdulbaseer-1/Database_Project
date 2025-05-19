const { Booking } = require('../models'); // Make sure you have a Booking model

module.exports = {
  // POST /api/bookings/
  createBooking: async (req, res, next) => {
    try {
      const { date, serviceId } = req.body;
      if (!date || !serviceId) {
        return res.status(400).json({ message: 'Date and serviceId are required' });
      }

      const booking = await Booking.create({
        userId: req.user.id,
        serviceId,
        date,
      });

      res.status(201).json({ message: 'Booking created', booking });
    } catch (err) {
      console.error('Error creating booking:', err);
      next(err);
    }
  },

  // GET /api/bookings/my
  getMyBookings: async (req, res, next) => {
    try {
      const bookings = await Booking.findAll({
        where: { userId: req.user.id },
        order: [['date', 'DESC']],
      });

      res.json({ bookings });
    } catch (err) {
      console.error('Error fetching bookings:', err);
      next(err);
    }
  },

  // DELETE /api/bookings/:id
  cancelBooking: async (req, res, next) => {
    try {
      const booking = await Booking.findOne({
        where: {
          id: req.params.id,
          userId: req.user.id,
        },
      });

      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      await booking.destroy();
      res.json({ message: 'Booking cancelled' });
    } catch (err) {
      console.error('Error cancelling booking:', err);
      next(err);
    }
  },
};
