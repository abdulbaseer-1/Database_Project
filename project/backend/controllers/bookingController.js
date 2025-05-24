const { Booking } = require('../models'); // Make sure you have a Booking model
const pool = require('../database/db')

module.exports = {
  // POST /api/bookings/
  createBooking: async (req, res, next) => {
    try {
      const { date, seat_number, route, } = req.body;
      if (!date || !serviceId) {
        return res.status(400).json({ message: 'Date and serviceId are required' });
      }

      const booking = await pool.query('INSERT INTO bookings(id, user_id,route_id, seat_number, date)'["what here ?" , req.body.user.userId, route.route_id, seat_number, date]);

      res.status(201).json({ message: 'Booking created', booking });
    } catch (err) {
      console.error('Error creating booking:', err);
      next(err);
    }
  },

  // GET /api/bookings/my
  getMyBookings: async (req, res, next) => {
    try {
      // const bookings = await Booking.findAll({
      //   where: { userId: req.user.id },
      //   order: [['date', 'DESC']],
      // });
      const bookings = await pool.query('SELECT * FROM bookings WHERE user_id = $1 ORDER BY date DESC', [req.user.id]);
      if (!bookings || bookings.length === 0) {
        return res.status(404).json({ message: 'No bookings found' });
      }
      // Assuming bookings is an array of booking objects
      // Convert the result to an array if needed
      // bookings = bookings.map(booking => booking.toJSON());  

      res.json({ bookings });
    } catch (err) {
      console.error('Error fetching bookings:', err);
      next(err);
    }
  },

  // DELETE /api/bookings/:id
  cancelBooking: async (req, res, next) => {
    try {
      // const booking = await Booking.findOne({
      //   where: {
      //     id: req.params.id,
      //     userId: req.user.id,
      //   },
      // });
      const booking = await pool.query('SELECT * FROM bookings WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);

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
