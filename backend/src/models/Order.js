
import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';
import { User } from './User.js';

export const Order = sequelize.define('Order', {
  total: { type: DataTypes.FLOAT, allowNull: false },
  paymentMethod: { type: DataTypes.STRING, allowNull: false },
  status: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    defaultValue: 'PAID',
    validate: {
      isIn: [['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']]
    }
  },
  shippingAddress: { type: DataTypes.STRING, allowNull: true },
  notes: { type: DataTypes.TEXT, allowNull: true },
});

Order.belongsTo(User);
User.hasMany(Order);
