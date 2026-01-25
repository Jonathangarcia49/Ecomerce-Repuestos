
import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';
import { User } from './User.js';

export const Order = sequelize.define('Order', {
  total: { type: DataTypes.FLOAT, allowNull: false },
  paymentMethod: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'PAID' }
});

Order.belongsTo(User);
User.hasMany(Order);
