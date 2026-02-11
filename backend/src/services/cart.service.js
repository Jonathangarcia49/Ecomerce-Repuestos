import * as repo from '../repositories/cart.repository.js';
import { Product } from '../models/Product.js';

export const getCart = async (userId) => {
  let cart = await repo.getActiveCart(userId);
  if (!cart) cart = await repo.createCart(userId);
  return cart;
};

export const addToCart = async (userId, productId, quantity) => {
  // Validación mejorada
  if (!productId || isNaN(productId)) {
    throw new Error('productId inválido');
  }

  if (!quantity || isNaN(quantity) || quantity < 1) {
    throw new Error('quantity debe ser un número mayor a 0');
  }

  let cart = await repo.getActiveCart(userId);
  if (!cart) cart = await repo.createCart(userId);

  const product = await Product.findByPk(productId);
  if (!product) throw new Error('Producto no existe');

  // Validar stock
  if (product.stock < quantity) {
    throw new Error(`Stock insuficiente. Disponible: ${product.stock}`);
  }

  const existing = await repo.findItem(cart.id, productId);
  if (existing) {
    const newQuantity = existing.quantity + quantity;

    // Validar stock para la nueva cantidad
    if (product.stock < newQuantity) {
      throw new Error(`Stock insuficiente. Disponible: ${product.stock}`);
    }

    await repo.updateItemQuantity(existing.id, newQuantity);
    return repo.getActiveCart(userId);
  }

  await repo.addItem(cart.id, productId, quantity, product.price);
  return repo.getActiveCart(userId);
};

export const updateItem = async (userId, itemId, quantity) => {
  // Validación mejorada
  if (!itemId || isNaN(itemId)) {
    throw new Error('itemId inválido');
  }

  if (!quantity || isNaN(quantity) || quantity < 1) {
    throw new Error('quantity debe ser un número mayor a 0');
  }

  const cart = await repo.getActiveCart(userId);
  if (!cart) throw new Error('Carrito no existe');

  const item = cart.CartItems.find((i) => i.id === Number(itemId));
  if (!item) throw new Error('Item no existe en tu carrito');

  // Validar stock
  const product = await Product.findByPk(item.ProductId);
  if (product && product.stock < quantity) {
    throw new Error(`Stock insuficiente. Disponible: ${product.stock}`);
  }

  await repo.updateItemQuantity(item.id, quantity);
  return repo.getActiveCart(userId);
};

export const removeItem = async (userId, itemId) => {
  // Validación mejorada
  if (!itemId || isNaN(itemId)) {
    throw new Error('itemId inválido');
  }

  const cart = await repo.getActiveCart(userId);
  if (!cart) throw new Error('Carrito no existe');

  const item = cart.CartItems.find((i) => i.id === Number(itemId));
  if (!item) throw new Error('Item no existe en tu carrito');

  await repo.removeItem(item.id);
  return repo.getActiveCart(userId);
};