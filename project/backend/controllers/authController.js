import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../database/db.js';

const TOKEN_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 1000 * 60 * 60 * 24, // 1 day
};

export default {
  register: async (req, res, next) => {
    try {
      const { name, email, password, role } = req.body;

      // Check if the user already exists
      const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      if (existingUser.length > 0) {
        return res.status(409).json({ message: 'Email already registered' });
      }

      // Hash the password
      const hash = await bcrypt.hash(password, 10);

      // Insert the user into the database
      const [result] = await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, hash, role]
      );

      res.status(201).json({
        id: result.insertId,
        name,
        email,
        role,
      });
    } catch (err) {
      console.error('Error registering user:', err);
      next(err);
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // Fetch user details by email
      const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      if (users.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const user = users[0];

      // Compare the provided password with the hashed password
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate a JWT token
      const payload = { id: user.id, role: user.role };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

      res
        .cookie('token', token, TOKEN_OPTIONS)
        .json({
          message: 'Logged in successfully',
          user: { id: user.id, name: user.name, role: user.role },
        });
    } catch (err) {
      console.error('Error logging in:', err);
      next(err);
    }
  },

  logout: (req, res) => {
    res.clearCookie('token', TOKEN_OPTIONS).json({ message: 'Logged out' });
  },
};
