const { User } = require('../models');
const pool = require('../config/db');

module.exports = {
  getProfile: async (req, res, next) => {
    try {
      // const user = await User.findByPk(req.user.id, {
      //   attributes: ['id', 'name', 'email', 'role']
      // });
      const user = pool.query('SELECT id, name, email, role FROM users WHERE id = $1', [req.user.id]);
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (err) {
      next(err);
    }
  },

  updateProfile: async (req, res, next) => {
    try {
      const { name, email } = req.body;
      // const user = await User.findByPk(req.user.id);
      const user = pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
      if (!user) return res.status(404).json({ message: 'User not found' });

      user.name = name || user.name;
      user.email = email || user.email;
      // await user.save();
      pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3', [user.name, user.email, user.id]);

      res.json({ message: 'Profile updated', user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
      next(err);
    }
  }
};
