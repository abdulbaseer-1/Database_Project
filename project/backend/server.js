// server.js
require('dotenv').config({path:"./config/"});
const express       = require('express');
const path          = require('path');
const cookieParser  = require('cookie-parser');
const cors          = require('cors');
const helmet        = require('helmet');
const morgan        = require('morgan');
const { sequelize } = require('./models');

// import your route modules
const authRoutes     = require('./routes/authRoutes');
const userRoutes     = require('./routes/userRoutes');
const adminRoutes    = require('./routes/adminRoutes');
const busRoutes      = require('./routes/busRoutes');
const routeRoutes    = require('./routes/routeRoutes');
const bookingRoutes  = require('./routes/bookingRoutes');
const locationRoutes = require('./routes/locationRoutes');


const app = express();

// —— Middleware ——
// parse JSON bodies
app.use(express.json());
// parse URL-encoded bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));
// parse cookies
app.use(cookieParser());
// secure headers
app.use(helmet());
// enable CORS for your front-end
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
// HTTP request logging in dev
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// —— Static file serving ——
// serve uploaded bus images from /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// —— Routes ——
// Auth & user
app.use('/api/auth',  authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Core resources
app.use('/api/buses',     busRoutes);
app.use('/api/routes',    routeRoutes);
app.use('/api/bookings',  bookingRoutes);
app.use('/api/locations', locationRoutes);

// Global error handler
app.use(require('./middleware/errorHandler'));

app.use(/.*/, (req, res) => { // Regular expression for all paths
  res.status(404).send('Page not found');
});


const PORT = process.env.PORT || 5000;

// —— Database sync & server start ——
// in dev, keep your tables in sync without dropping data
const syncOptions = { force: false };
if (process.env.NODE_ENV === 'development') {
  syncOptions.alter = true;
}

sequelize
  .sync(syncOptions)
  .then(() => {
    const server = app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT} (${process.env.NODE_ENV})`)
    );

    // Graceful shutdown
    const shutDown = () => {
      console.log('📴 Shutting down gracefully...');
      server.close(() => {
        console.log('– Closed HTTP server');
        sequelize.close().then(() => {
          console.log('– Closed DB connection');
          process.exit(0);
        });
      });
      setTimeout(() => {
        console.error('❌ Forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', shutDown);
    process.on('SIGINT',  shutDown);
  })
  .catch(err => {
    console.error('❌ Failed to sync database:', err);
    process.exit(1);
  });