import pool from '../database/db.js';
import getIdFromJWT from '../middleware/getIdFromJWT.js';

export default {

  createBooking: async (req, res) => {    
    try {
      const {
        passengerName,
        contactNumber,
        departureTime, // Includes date and time as text from frontend
        departureLocation,
        destination,
        seatNumbers,
      } = req.body;

      // Parse `departureTime` to 'YYYY-MM-DD HH:MM:SS' format
    function formatLocalDateTime(date) {
      const pad = (n) => (n < 10 ? '0' + n : n);
      return date.getFullYear() + '-' +
        pad(date.getMonth() + 1) + '-' +
        pad(date.getDate()) + ' ' +
        pad(date.getHours()) + ':' +
        pad(date.getMinutes()) + ':' +
        pad(date.getSeconds());
    }

    const formattedDepartureDatetime = formatLocalDateTime(new Date(departureTime));

      // Extract user ID from JWT
      const userId = getIdFromJWT(req);

      // Validate if the user exists
      const userQuery = `SELECT id FROM users WHERE id = ?`;
      const [userResults] = await pool.query(userQuery, [userId]);
      if (userResults.length === 0) {
        return res.status(404).json({ message: 'User not found.' });
      }

      // Find Route ID
      const routeQuery = `
        SELECT id FROM routes 
        WHERE _source = ? AND destination = ? AND departure_time = ?
      `;
      const routeParams = [departureLocation, destination, formattedDepartureDatetime];
      const [routeResults] = await pool.query(routeQuery, routeParams);

      if (routeResults.length === 0) {
        return res.status(404).json({ message: 'Route not found.' });
      }
      const routeId = routeResults[0].id;

      console.log("at line : 45, id", userId);

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
      const bookings = seatNumbers.map((seat) => [
        userId,
        routeId,
        seat,
        'booked',
        passengerName,
        contactNumber,
      ]);

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
        INSERT INTO bookings (user_id, route_id, seat_number, status, passenger_name, passenger_contact)
        VALUES ?
      `;
      await pool.query(bookingQuery, [bookings]);

      res.status(201).json({ message: 'Booking created successfully.' });
    } catch (error) {
      console.error('Error creating booking:', error.message);
      res.status(500).json({ message: 'Internal server error.' });
    }
  },


  // GET : /api/bookings/
  getAllBookings: async (req, res, next) => {
    try {

      console.log('inside get all bookings');
      // Query to join bookings and routes tables
      const [bookings] = await pool.query(`
        SELECT 
          bookings.id,
          bookings.user_id,
          routes._source,
          routes.destination,
          routes.departure_time,
          bookings.seat_number,
          bookings.passenger_name
        FROM bookings
        INNER JOIN routes ON bookings.route_id = routes.id
        ORDER BY bookings.seat_number DESC
      `);

      // Check if bookings exist for the user
      if (!bookings || bookings.length === 0) {
        return res.status(404).json({ message: 'No bookings found' });
      }

      // Respond with the booking details
      res.json({ bookings });
    } catch (err) {
      console.error('Error fetching bookings:', err.message);
      next(err); // Pass error to the error-handling middleware
    }
  },

  // GET /api/bookings/my
  getMyBookings: async (req, res, next) => {
    try {
      // Retrieve the user ID from the JWT
      const userId = getIdFromJWT(req);

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: Invalid user ID' });
      }

      // Query to join bookings and routes tables
      const [bookings] = await pool.query(`
        SELECT 
          bookings.id AS booking_id,
          routes._source,
          routes.destination,
          bookings.seat_number,
          bookings.passenger_name
        FROM bookings
        INNER JOIN routes ON bookings.route_id = routes.id
        WHERE bookings.user_id = ?
        ORDER BY bookings.seat_number DESC
      `, [userId]);

      // Check if bookings exist for the user
      if (!bookings || bookings.length === 0) {
        return res.status(404).json({ message: 'No bookings found' });
      }

      // Respond with the booking details
      res.json({ bookings });
    } catch (err) {
      console.error('Error fetching bookings:', err.message);
      next(err); // Pass error to the error-handling middleware
    }
  },

  getBookingFilters: async (req, res, next) => {
  // to get data for drp options in bus booking form
  try {
    const [_source] = await pool.query('SELECT DISTINCT _source FROM routes');
    const [destination] = await pool.query('SELECT DISTINCT destination FROM routes');
    const [departure_time] = await pool.query('SELECT DISTINCT departure_time FROM routes');
    const [user_id] = await pool.query('SELECT DISTINCT user_id FROM bookings');
    const [passenger_name] = await pool.query('SELECT DISTINCT passenger_name FROM bookings');

    res.json({
      _source: _source.map(row => row._source), // map is just to copy one valid data to an array
      destination: destination.map(row => row.destination),
      departure_time: departure_time.map(row => new Date(row.departure_time).toLocaleString()),
      user_id: user_id.map(row => row.user_id),
      passenger_name: passenger_name.map(row => row.passenger_name),
    })} catch (err) {
      console.error('Error fetching bookings:', err.message);
      next(err); // Pass error to the error-handling middleware
    }
  },

  // DELETE /api/bookings/:id
  cancelBooking: async (req, res, next) => {
    try {    
      const userId = getIdFromJWT(req);

      const booking = await pool.query('SELECT * FROM bookings WHERE id = ? AND user_id = ?', [req.params.id, userId]);

      if (booking.length === 0) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      await pool.query(`DELETE FROM bookings WHERE id = ? AND user_id = ?`, [req.params.id, userId]);

      res.json({ message: 'Booking cancelled' });
    } catch (err) {
      console.error('Error cancelling booking:', err);
      next(err);
    }
  },
};
