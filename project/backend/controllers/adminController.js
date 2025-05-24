import pool from '../database/db.js';

export default {
  dashboard: async (req, res, next) => {
    try {
      const [userResult, busResult, routeResult, bookingResult] = await Promise.all([
        pool.query('SELECT COUNT(*) as count FROM users'),
        pool.query('SELECT COUNT(*) as count FROM buses'),
        pool.query('SELECT COUNT(*) as count FROM routes'),
        pool.query('SELECT COUNT(*) as count FROM bookings')
      ]);

      const userCount = userResult[0][0].count;
      const busCount = busResult[0][0].count;
      const routeCount = routeResult[0][0].count;
      const bookingCount = bookingResult[0][0].count;

      res.json({ userCount, busCount, routeCount, bookingCount });
    } catch (err) {
      console.error('Error fetching dashboard counts:', err);
      next(err);
    }
  },
};
