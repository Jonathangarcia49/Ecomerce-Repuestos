import { Order } from '../models/Order.js';
import { User } from '../models/User.js';

export const createOrder = (data, transaction) =>
  Order.create(data, { transaction });

export const getOrdersByUser = (userId) =>
  Order.findAll({
    where: { UserId: userId },
    order: [['createdAt', 'DESC']],
  });

