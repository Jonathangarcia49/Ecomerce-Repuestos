
import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';

export const Product = sequelize.define('Product', {
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  price: { type: DataTypes.FLOAT, allowNull: false },
  stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  image: { type: DataTypes.STRING, allowNull: true },
  category: { type: DataTypes.STRING, allowNull: true, defaultValue: 'General' },
  brand: { type: DataTypes.STRING, allowNull: true },
  sku: { type: DataTypes.STRING, allowNull: true, unique: true },
  active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
});
