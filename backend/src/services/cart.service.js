
import * as repo from '../repositories/cart.repository.js';
import { Product } from '../models/Product.js';

export const getCart = async (userId) => {
  let cart = await repo.getActiveCart(userId);
  if (!cart) cart = await repo.createCart(userId);
  return cart;
};

export const addToCart = async (userId, productId, quantity) => {
  if (!Number.isInteger(quantity) || quantity < 1) throw new Error('quantity inválido');

  let cart = await repo.getActiveCart(userId);
  if (!cart) cart = await repo.createCart(userId);

  const product = await Product.findByPk(productId);
  if (!product) throw new Error('Producto no existe');

  const existing = await repo.findItem(cart.id, productId);
  if (existing) {
    await repo.updateItemQuantity(existing.id, existing.quantity + quantity);
    return repo.getActiveCart(userId);
  }

  await repo.addItem(cart.id, productId, quantity, product.price);
  return repo.getActiveCart(userId);
};

export const updateItem = async (userId, itemId, quantity) => {
  if (!Number.isInteger(quantity) || quantity < 1) throw new Error('quantity inválido');
  const cart = await repo.getActiveCart(userId);
  if (!cart) throw new Error('Carrito no existe');

  const item = cart.CartItems.find((i) => i.id === Number(itemId));
  if (!item) throw new Error('Item no existe');

  await repo.updateItemQuantity(item.id, quantity);
  return repo.getActiveCart(userId);
};

export const removeItem = async (userId, itemId) => {
  const cart = await repo.getActiveCart(userId);
  if (!cart) throw new Error('Carrito no existe');

  const item = cart.CartItems.find((i) => i.id === Number(itemId));
  if (!item) throw new Error('Item no existe');

  await repo.removeItem(item.id);
  return repo.getActiveCart(userId);
};
