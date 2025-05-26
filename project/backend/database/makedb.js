import mysql from 'mysql2/promise';

import pool from '../database/db.js';

async function setupDatabase() {
  try {
    // 1. Connect to MySQL server (no specific database yet)
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '23pwbcs1031' // replace with your MySQL root password
    });
    console.log('Connected to MySQL server.');

    // 2. Create the database if it doesn't exist
    const dbName = 'my_db'; // change this to your desired database name
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    console.log(`Database '${dbName}' is ready.`);

    // 3. Switch to the new database
    await connection.query(`USE \`${dbName}\`;`);
    console.log(`Using database '${dbName}'.`);

    // 4. Create tables with constraints

    // Users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL
      ) ENGINE=InnoDB;
    `);
    console.log('Table users created or already exists.');

    // Buses table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS buses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        bus_name VARCHAR(255) NOT NULL,
        bus_number VARCHAR(50) UNIQUE NOT NULL,
        image_url VARCHAR(255),
        total_seats INT NOT NULL
      ) ENGINE=InnoDB;
    `);
    console.log('Table buses created or already exists.');

    // Routes table (each route is linked to a bus)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS routes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        source VARCHAR(255) NOT NULL,
        destination VARCHAR(255) NOT NULL,
        departure_time DATETIME NOT NULL,
        arrival_time DATETIME NOT NULL,
        bus_id INT,
        FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);
    console.log('Table routes created or already exists.');

    // Bookings table (linked to users and routes)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        route_id INT,
        seat_number INT NOT NULL,
        date DATE NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);
    console.log('Table bookings created or already exists.');

    // Locations table (tracks bus GPS coordinates)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS locations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        bus_id INT,
        latitude DECIMAL(9,6),
        longitude DECIMAL(9,6),
        updated_at DATETIME NOT NULL,
        FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);
    console.log('Table locations created or already exists.');

    // Refresh tokens table (linked to users)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        token VARCHAR(255) NOT NULL,
        user_id INT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);
    console.log('Table refresh_tokens created or already exists.');

    // 5. Insert sample seed data

    // Insert a sample admin user
    // Check if bus already exists
const [existingBus] = await pool.query(
  'SELECT * FROM buses WHERE bus_number = ?',
  ['EXP1234']
);

if (existingBus.length === 0) {
  await pool.query(
    'INSERT INTO buses (bus_name, bus_number, image_url, total_seats) VALUES (?, ?, ?, ?)',
    ['City Express', 'EXP1234', 'https://example.com/bus.jpg', 50]
  );
  console.log("Sample bus inserted.");
} else {
  console.log("Sample bus already exists, skipping creation.");
}

    console.log('Sample admin user inserted.');

    // Insert a sample bus
    await connection.query(`
      INSERT INTO buses (bus_name, bus_number, image_url, total_seats)
      VALUES ('City Express', 'EXP1234', 'https://example.com/bus.jpg', 50)
    `);
    console.log('Sample bus inserted.');

    // Insert a sample route for the bus (assuming bus_id = 1)
    await connection.query(`
      INSERT INTO routes (source, destination, departure_time, arrival_time, bus_id)
      VALUES ('CityA', 'CityB', '2025-05-24 08:00:00', '2025-05-24 12:00:00', 1)
    `);
    console.log('Sample route inserted.');

    // Insert a sample booking (user 1 booking seat 12 on route 1)
    await connection.query(`
      INSERT INTO bookings (user_id, route_id, seat_number, date)
      VALUES (1, 1, 12, '2025-05-24')
    `);
    console.log('Sample booking inserted.');

    // Insert a sample location for the bus (bus 1)
    await connection.query(`
      INSERT INTO locations (bus_id, latitude, longitude, updated_at)
      VALUES (1, 37.774900, -122.419400, '2025-05-23 10:00:00')
    `);
    console.log('Sample location inserted.');

    // Insert a sample refresh token for the user (user 1)
    await connection.query(`
      INSERT INTO refresh_tokens (token, user_id)
      VALUES ('sample_refresh_token', 1)
    `);
    console.log('Sample refresh token inserted.');

    // 6. Close the connection
    await connection.end();
    console.log('Database setup complete.');
  } catch (error) {
    console.error('Error setting up the database:', error);
  }
}

// Run the setup
export default setupDatabase();
