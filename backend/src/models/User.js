
import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';

export const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Usuario' },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, allowNull: false, defaultValue: 'CLIENTE' } // ADMIN | CLIENTE
});
