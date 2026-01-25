
import * as paymentService from '../services/payment.service.js';

export const checkout = async (req, res) => {
  try {
    const { paymentMethod } = req.body;
    const order = await paymentService.checkout(req.user.id, paymentMethod || 'TARJETA');
    res.json(order);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export const orders = async (req, res) => {
  const orders = await paymentService.getOrders(req.user.id);
  res.json(orders);
};
