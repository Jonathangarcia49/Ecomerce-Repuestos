
import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';
import { User } from './User.js';

export const Cart = sequelize.define('Cart', {
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'ACTIVE' } // ACTIVE | COMPLETED
});

Cart.belongsTo(User);
User.hasMany(Cart);
