
import * as cartService from '../services/cart.service.js';

export const getCart = async (req, res) => {
  const cart = await cartService.getCart(req.user.id);
  res.json(cart);
};

export const add = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await cartService.addToCart(req.user.id, Number(productId), Number(quantity));
    res.json(cart);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export const updateItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await cartService.updateItem(req.user.id, req.params.itemId, Number(quantity));
    res.json(cart);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export const removeItem = async (req, res) => {
  try {
    const cart = await cartService.removeItem(req.user.id, req.params.itemId);
    res.json(cart);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
