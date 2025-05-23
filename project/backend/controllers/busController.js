const pool = require('../middleware/db');

module.exports = {
  getAllBuses: async (req, res, next) => {
    try {
      const [buses] = await pool.query('SELECT * FROM buses');
      res.json(buses);
    } catch (err) {
      next(err);
    }
  },

  getBusCustom: async(req, res, next) => {
    try {
      const {departure_time, _source, destination} = req.body;
      const[buses] = await pool.query('SELECT * FROM routes WHERE departure_time = ? AND _source = ? AND destination = ?',[departure_time, _source, destination])
    } catch (err) {
      next(err);
    }
  },

  getBusById: async (req, res, next) => {
    try {
      const [rows] = await pool.query('SELECT * FROM buses WHERE id = ?', [req.params.id]);
      if (rows.length === 0) return res.status(404).json({ message: 'Bus not found' });
      res.json(rows[0]);
    } catch (err) {
      next(err);
    }
  },

  createBus: async (req, res, next) => {
    try {
      const { bus_name, bus_number, image_url, total_seats } = req.body;
      const [result] = await pool.query(
        'INSERT INTO buses (bus_name, bus_number, image_url, total_seats) VALUES (?, ?, ?, ?)',
        [bus_name, bus_number, image_url, total_seats]
      );
      res.status(201).json({ id: result.insertId, bus_name, bus_number, image_url, total_seats });
    } catch (err) {
      next(err);
    }
  },

  updateBus: async (req, res, next) => {
    try {
      const { bus_name, bus_number, image_url, total_seats } = req.body;
      const [result] = await pool.query(
        'UPDATE buses SET bus_name = ?, bus_number = ?, image_url = ?, total_seats = ? WHERE id = ?',
        [bus_name, bus_number, image_url, total_seats, req.params.id]
      );
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Bus not found' });
      res.json({ message: 'Bus updated' });
    } catch (err) {
      next(err);
    }
  },

  deleteBus: async (req, res, next) => {
    try {
      const [result] = await pool.query('DELETE FROM buses WHERE id = ?', [req.params.id]);
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Bus not found' });
      res.json({ message: 'Bus deleted' });
    } catch (err) {
      next(err);
    }
  }
};
