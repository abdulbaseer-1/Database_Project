const { Location, Bus } = require('../models'); // Ensure you have Location and Bus models
const pool = require('../config/db'); // Adjust the path to your database configuration

module.exports = {
  // GET /api/locations/:busId
  getLiveLocation: async (req, res, next) => {
    try {
      const { busId } = req.params;

      // const location = await Location.findOne({
      pool.query('SELECT * FROM locations WHERE bus_id = $1 ORDER BY updated_at DESC LIMIT 1', [busId])
      const location = await Location.findOne({
        attributes: ['latitude', 'longitude', 'updatedAt'],
        include: {
          model: Bus,
          as: 'bus', // Ensure you have the association set up in your models
          attributes: ['id', 'name'], // Adjust attributes as needed
        },  
        where: { busId },
        order: [['updatedAt', 'DESC']], // optional: get the most recent update
      });

      if (!location) {
        return res.status(404).json({ message: 'Location not found for this bus' });
      }

      res.json({ location });
    } catch (err) {
      console.error('Error fetching location:', err);
      next(err);
    }
  },

  // POST /api/locations/
  updateLocation: async (req, res, next) => {
    try {
      const { busId, latitude, longitude } = req.body;

      if (!busId || !latitude || !longitude) {
        return res.status(400).json({ message: 'busId, latitude, and longitude are required' });
      }

      // Optional: check if bus exists
      // const bus = await Bus.findByPk(busId);
      const bus = await pool.query('SELECT * FROM buses WHERE id = $1', [busId]);
      if (!bus) {
        return res.status(404).json({ message: 'Bus not found' });
      }

      // const updatedLocation = await Location.create({
      pool.query(
        'INSERT INTO locations (bus_id, latitude, longitude) VALUES ($1, $2, $3) RETURNING *',
        [busId, latitude, longitude]
      );
      //   busId,
      //   latitude,
      //   longitude,
      // });

      res.status(201).json({ message: 'Location updated', location: updatedLocation });
    } catch (err) {
      console.error('Error updating location:', err);
      next(err);
    }
  },
};
