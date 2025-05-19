const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const TOKEN_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 1000 * 60 * 60 * 24, // 1 day
};

module.exports = {
  register: async (req, res, next) => {
    try {
      const { name, email, password, role } = req.body;
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ message: 'Email already registered' });
      }

      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hash, role });

      res.status(201).json({ id: user.id, name: user.name, email: user.email });
    } catch (err) {
      next(err);
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const payload = { id: user.id, role: user.role };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

      res.cookie('token', token, TOKEN_OPTIONS).json({
        message: 'Logged in successfully',
        user: { id: user.id, name: user.name, role: user.role },
      });
    } catch (err) {
      next(err);
    }
  },

  logout: (req, res) => {
    res.clearCookie('token', TOKEN_OPTIONS).json({ message: 'Logged out' });
  }
};
