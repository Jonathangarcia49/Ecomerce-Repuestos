
import { Cart } from '../models/Cart.js';
import { CartItem } from '../models/CartItem.js';
import { Product } from '../models/Product.js';

export const getActiveCart = (userId) =>
  Cart.findOne({
    where: { UserId: userId, status: 'ACTIVE' },
    include: [{ model: CartItem, include: [Product] }]
  });

export const createCart = (userId) => Cart.create({ UserId: userId });

export const findItem = (cartId, productId) =>
  CartItem.findOne({ where: { CartId: cartId, ProductId: productId } });

export const addItem = (cartId, productId, quantity, price) =>
  CartItem.create({ CartId: cartId, ProductId: productId, quantity, price });

export const updateItemQuantity = (itemId, quantity) =>
  CartItem.update({ quantity }, { where: { id: itemId } });

export const removeItem = (itemId) => CartItem.destroy({ where: { id: itemId } });
