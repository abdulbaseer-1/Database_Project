import pool from '../database/db.js';

export default {
  // POST /api/bookings/
  createBooking: async (req, res, next) => {
    try {
      const { date, seat_number, route_id } = req.body;
      const userId = req.user.userId; // Assuming user ID is stored in req.user

      if (!date || !route_id) {
        return res.status(400).json({ message: 'Date and route_id are required' });
      }

      const [result] = await pool.query(
        `INSERT INTO bookings (user_id, route_id, seat_number, date) VALUES (?, ?, ?, ?)`,
        [userId, route_id, seat_number, date]
      );

      res.status(201).json({
        message: 'Booking created',
        booking: { id: result.insertId, user_id: userId, route_id, seat_number, date },
      });
    } catch (err) {
      console.error('Error creating booking:', err);
      next(err);
    }
  },

  // GET /api/bookings/my
  getMyBookings: async (req, res, next) => {
    try {

      const bookings = await pool.query('SELECT * FROM bookings WHERE user_id = $1 ORDER BY date DESC', [req.user.id]);
      if (!bookings || bookings.length === 0) {
        return res.status(404).json({ message: 'No bookings found' });
      }


      res.json({ bookings });
    } catch (err) {
      console.error('Error fetching bookings:', err);
      next(err);
    }
  },

  // DELETE /api/bookings/:id
  cancelBooking: async (req, res, next) => {
    try {
    
      const booking = await pool.query('SELECT * FROM bookings WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);

      if (booking.length === 0) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      await pool.query(`DELETE FROM bookings WHERE id = ? AND user_id = ?`, [bookingId, userId]);

      res.json({ message: 'Booking cancelled' });
    } catch (err) {
      console.error('Error cancelling booking:', err);
      next(err);
    }
  },
};
