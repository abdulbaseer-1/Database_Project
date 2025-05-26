import dotenv from 'dotenv';
dotenv.config({ path: "./config/" });

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from './middleware/CORS.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import busRoutes from './routes/busRoutes.js';
import routeRoutes from './routes/routeRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import logger from './middleware/logger.js';
import queryRoutes from './routes/queryRoutes.js';
import makedb from './database/makedb.js';

import { fileURLToPath } from 'url';
import path from 'path';

// Define __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(logger);

// Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
makedb.setupDatabase;
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/queryRoutes', queryRoutes);

// 404 Handling
app.use(/.*/, (req, res) => {
    res.status(404).json({ error: 'Page not found' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start the Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful Shutdown
const shutDown = async () => {
    console.log('📴 Shutting down gracefully...');
    try {
        // Close any resources like database connections here
        console.log('✅ Closed resources');
    } catch (err) {
        console.error('❌ Error during shutdown:', err);
    }
    server.close(() => {
        console.log('✅ Closed HTTP server');
        process.exit(0);
    });
    setTimeout(() => {
        console.error('❌ Forcefully shutting down');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);
