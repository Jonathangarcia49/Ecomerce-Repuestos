import api from '../api/api';
export const checkout = (paymentMethod, shippingAddress, notes) =>
  api.post('/payment/checkout', { paymentMethod, shippingAddress, notes });
export const getOrders = () => api.get('/payment/orders');
