
import api from '../api/api';
export const checkout = (paymentMethod) => api.post('/payment/checkout', { paymentMethod });
export const getOrders = () => api.get('/payment/orders');
