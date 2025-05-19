// models/bus.js
module.exports = (sequelize, DataTypes) => {
  const Bus = sequelize.define('Bus', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    bus_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    bus_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    image_url: {
      type: DataTypes.STRING(2083),
      allowNull: true
    },
    total_seats: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    }
  }, {
    tableName: 'buses',
    timestamps: false
  });

  Bus.associate = models => {
    Bus.hasMany(models.Route, { foreignKey: 'bus_id', as: 'routes' });
    Bus.hasMany(models.BusLocation, { foreignKey: 'bus_id', as: 'locations' });
  };

  return Bus;
};
