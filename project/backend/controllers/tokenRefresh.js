import jwt from 'jsonwebtoken';
import pool from '../database/db.js';

exports.refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: 'No token' });

  try {
    // Check if the refresh token exists in the database
    const [tokens] = await pool.query('SELECT * FROM refresh_tokens WHERE token = ?', [refreshToken]);
    if (tokens.length === 0) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    // Verify the refresh token
    jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, payload) => {
      if (err) return res.status(403).json({ message: 'Invalid refresh token' });

      // Issue a new access token
      const newToken = jwt.sign(
        { id: payload.id, role: payload.role },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );

      res.cookie('token', newToken, { httpOnly: true, secure: true, sameSite: 'Strict' });
      return res.json({ message: 'Token refreshed', accessToken: newToken });
    });
  } catch (err) {
    console.error('Error refreshing token:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
