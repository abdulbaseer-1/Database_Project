// models/booking.js
module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define('Booking', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    seat_number: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('booked','cancelled'),
      allowNull: false,
      defaultValue: 'booked'
    }
  }, {
    tableName: 'bookings',
    timestamps: false
  });

  Booking.associate = models => {
    Booking.belongsTo(models.User,  { foreignKey: 'user_id',  as: 'user' });
    Booking.belongsTo(models.Route, { foreignKey: 'route_id', as: 'route' });
  };

  return Booking;
};
