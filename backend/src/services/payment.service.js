
import * as paymentRepo from '../repositories/payment.repository.js';
import { Cart } from '../models/Cart.js';
import { CartItem } from '../models/CartItem.js';

export const checkout = async (userId, paymentMethod) => {
  const cart = await Cart.findOne({
    where: { UserId: userId, status: 'ACTIVE' },
    include: [CartItem]
  });

  if (!cart || !cart.CartItems || cart.CartItems.length === 0) {
    throw new Error('Carrito vacío');
  }

  const total = cart.CartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = await paymentRepo.createOrder({
    UserId: userId,
    total,
    paymentMethod: paymentMethod || 'TARJETA',
    status: 'PAID'
  });

  cart.status = 'COMPLETED';
  await cart.save();

  return order;
};

export const getOrders = (userId) => paymentRepo.getOrdersByUser(userId);
