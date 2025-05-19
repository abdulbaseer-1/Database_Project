const { User } = require('../models');

module.exports = {
  getProfile: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: ['id', 'name', 'email', 'role']
      });
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (err) {
      next(err);
    }
  },

  updateProfile: async (req, res, next) => {
    try {
      const { name, email } = req.body;
      const user = await User.findByPk(req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      user.name = name || user.name;
      user.email = email || user.email;
      await user.save();

      res.json({ message: 'Profile updated', user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
      next(err);
    }
  }
};
