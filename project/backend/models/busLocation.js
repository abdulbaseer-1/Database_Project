// models/buslocation.js
module.exports = (sequelize, DataTypes) => {
  const BusLocation = sequelize.define('BusLocation', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    latitude: {
      type: DataTypes.DECIMAL(9,6),
      allowNull: false
    },
    longitude: {
      type: DataTypes.DECIMAL(9,6),
      allowNull: false
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'bus_locations',
    timestamps: false
  });

  BusLocation.associate = models => {
    BusLocation.belongsTo(models.Bus, { foreignKey: 'bus_id', as: 'bus' });
  };

  return BusLocation;
};
