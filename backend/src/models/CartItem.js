
import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';
import { Cart } from './Cart.js';
import { Product } from './Product.js';

export const CartItem = sequelize.define('CartItem', {
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  price: { type: DataTypes.FLOAT, allowNull: false }
});

CartItem.belongsTo(Cart);
Cart.hasMany(CartItem, { onDelete: 'CASCADE' });

CartItem.belongsTo(Product);
Product.hasMany(CartItem);
