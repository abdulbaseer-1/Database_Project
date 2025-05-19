// models/index.js
const fs        = require('fs');
const path      = require('path');
const Sequelize = require('sequelize');
require('dotenv').config({ path: path.resolve(__dirname, '../config/.env') });

console.log("DB Host:", process.env.DB_HOST);
console.log("DB Name:", process.env.DB_NAME);
console.log("DB User:", process.env.DB_USER);
console.log("DB Pass:", process.env.DB_PASS ? "****" : "Not Set");

// Use DATABASE_URL if you have one, otherwise build from parts:
const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialectOptions: { /* if you need SSL, etc */ },
      logging: process.env.NODE_ENV === 'development' ? console.log : false
    })
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASS,
      {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: process.env.NODE_ENV === 'development' ? console.log : false
      }
    );

const db = { sequelize, Sequelize };

// Read all model files in this directory, import them, and attach to `db`
fs
  .readdirSync(__dirname)
  .filter(file => (
    file !== 'index.js' &&
    file.endsWith('.js')
  ))
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Run `.associate()` on each model, if it exists
Object.values(db)
  .filter(model => typeof model.associate === 'function')
  .forEach(model => model.associate(db));

module.exports = db;
