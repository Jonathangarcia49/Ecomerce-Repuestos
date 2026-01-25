
import { Order } from '../models/Order.js';

export const createOrder = (data) => Order.create(data);
export const getOrdersByUser = (userId) =>
  Order.findAll({ where: { UserId: userId }, order: [['id', 'DESC']] });
