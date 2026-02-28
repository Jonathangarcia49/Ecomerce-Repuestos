
import * as paymentService from '../services/payment.service.js';

export const checkout = async (req, res, next) => {
  try {
    const { paymentMethod, shippingAddress, notes } = req.body;
    const order = await paymentService.checkout(
      req.user.id,
      paymentMethod || 'TARJETA',
      shippingAddress,
      notes
    );
    res.json(order);
  } catch (e) {
    next(e);
  }
};

export const orders = async (req, res, next) => {
  try {
    const list = await paymentService.getOrders(req.user.id);
    res.json(list);
  } catch (e) {
    next(e);
  }
};
