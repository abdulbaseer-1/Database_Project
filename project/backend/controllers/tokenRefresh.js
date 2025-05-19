exports.refreshToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: 'No token' });
    jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, payload) => {
      if (err) return res.status(403).json({ message: 'Invalid refresh token' });
      // Issue new access token
      const newToken = jwt.sign({ id: payload.id, role: payload.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
      res.cookie('token', newToken, { httpOnly: true, secure: true, sameSite: 'Strict' });
      return res.json({ message: 'Token refreshed' });
    });
  };  