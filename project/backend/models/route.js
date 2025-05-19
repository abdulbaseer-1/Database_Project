// models/route.js
module.exports = (sequelize, DataTypes) => {
  const Route = sequelize.define('Route', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    source: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    destination: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    departure_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    arrival_time: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'routes',
    timestamps: false
  });

  Route.associate = models => {
    Route.belongsTo(models.Bus, { foreignKey: 'bus_id', as: 'bus' });
    Route.hasMany(models.Booking, { foreignKey: 'route_id', as: 'bookings' });
  };

  return Route;
};
