import pool from '../database/db.js';
import getIdFromJWT from '../middleware/getIdFromJWT.js';

export default {

createBooking: async (req, res) => {
  try {
    const {
      passengerName,
      contactNumber,
      departureDate,
      departureTime,
      departureLocation,
      destination,
      seatNumbers,
    } = req.body;

    // Extract user ID from JWT (Assumes a helper function `getIdFromJWT`)
    const userId = getIdFromJWT(req);

    // Validate if the user exists
    const userQuery = `SELECT id FROM users WHERE id = ?`;
    const [userResults] = await pool.query(userQuery, [userId]);
    if (userResults.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    console.log("in f(bookings):");
    // Find Route ID
    const routeQuery = `
      SELECT id FROM routes 
      WHERE _source = ? AND destination = ? AND departure_time = ?
    `;
    const routeParams = [departureLocation, destination, `${departureDate} ${departureTime}`];
    const [routeResults] = await pool.query(routeQuery, routeParams);

    if (routeResults.length === 0) {
      return res.status(404).json({ message: 'Route not found.' });
    }
    const routeId = routeResults[0].id;

    // Validate seat numbers
    const totalSeatsQuery = `SELECT total_seats FROM buses WHERE id = (SELECT bus_id FROM routes WHERE id = ?)`;
    const [busResults] = await pool.query(totalSeatsQuery, [routeId]);

    if (busResults.length === 0) {
      return res.status(404).json({ message: 'Bus information not found.' });
    }

    const totalSeats = busResults[0].total_seats;
    const invalidSeats = seatNumbers.filter((seat) => seat < 1 || seat > totalSeats);

    if (invalidSeats.length > 0) {
      return res.status(400).json({ message: `Invalid seat numbers: ${invalidSeats.join(', ')}` });
    }

    // Prepare Bookings Data
    const bookings = seatNumbers.map((seat) => [userId, routeId, seat, 'booked']);

    // Check for already booked seats
    const checkSeatQuery = `
      SELECT seat_number FROM bookings 
      WHERE route_id = ? AND seat_number IN (?)
    `;
    const [alreadyBookedSeats] = await pool.query(checkSeatQuery, [routeId, seatNumbers]);

    if (alreadyBookedSeats.length > 0) {
      const bookedSeats = alreadyBookedSeats.map((seat) => seat.seat_number).join(', ');
      return res.status(400).json({ message: `Seats already booked: ${bookedSeats}` });
    }

    // Insert Bookings
    const bookingQuery = `
      INSERT INTO bookings (user_id, route_id, seat_number, status)
      VALUES ?
    `;
    await pool.query(bookingQuery, [bookings]);

    res.status(201).json({ message: 'Booking created successfully.' });
  } catch (error) {
    console.error('Error creating booking:', error.message);
    res.status(500).json({ message: 'Internal server error.' });
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
