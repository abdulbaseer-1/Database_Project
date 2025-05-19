const { Location, Bus } = require('../models'); // Ensure you have Location and Bus models

module.exports = {
  // GET /api/locations/:busId
  getLiveLocation: async (req, res, next) => {
    try {
      const { busId } = req.params;

      const location = await Location.findOne({
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
      const bus = await Bus.findByPk(busId);
      if (!bus) {
        return res.status(404).json({ message: 'Bus not found' });
      }

      const updatedLocation = await Location.create({
        busId,
        latitude,
        longitude,
      });

      res.status(201).json({ message: 'Location updated', location: updatedLocation });
    } catch (err) {
      console.error('Error updating location:', err);
      next(err);
    }
  },
};
