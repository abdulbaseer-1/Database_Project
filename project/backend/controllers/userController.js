import pool from '../database/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_jwt_secret'; // use process.env.JWT_SECRET in production

export default {
  // ===================== SIGNUP =====================
  // POST /api/auth/signup
  signup: async (req, res, next) => {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      // Check if user already exists
      const [existing] = await pool.query(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      if (existing.length > 0) {
        return res.status(409).json({ message: 'Email already in use' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user
      const [result] = await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, role]
      );

      const userId = result.insertId;

      res.status(201).json({
        message: 'User registered successfully',
        user: { id: userId, name, email, role },
      });
    } catch (err) {
      next(err);
    }
  },

  // ===================== SIGNIN =====================
  // POST /api/auth/signin
  signin: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      // Find user by email
      const [users] = await pool.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      const user = users[0];

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT
      const token = jwt.sign(
        { id: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: '1d' }
      );

      res.json({
        message: 'Signin successful',
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      });
    } catch (err) {
      next(err);
    }
  },

  // ===================== GET PROFILE =====================
  getProfile: async (req, res, next) => {
    try {
      const [users] = await pool.query(
        'SELECT id, name, email, role FROM users WHERE id = ?',
        [req.user.id]
      );

      if (users.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(users[0]);
    } catch (err) {
      next(err);
    }
  },

  // ===================== UPDATE PROFILE =====================
  updateProfile: async (req, res, next) => {
    try {
      const { name, email } = req.body;

      const [users] = await pool.query(
        'SELECT * FROM users WHERE id = ?',
        [req.user.id]
      );

      if (users.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      const [updateResult] = await pool.query(
        'UPDATE users SET name = ?, email = ? WHERE id = ?',
        [name || users[0].name, email || users[0].email, req.user.id]
      );

      if (updateResult.affectedRows === 0) {
        return res.status(500).json({ message: 'Failed to update profile' });
      }

      res.json({
        message: 'Profile updated',
        user: {
          id: req.user.id,
          name: name || users[0].name,
          email: email || users[0].email,
        },
      });
    } catch (err) {
      next(err);
    }
  },
};
