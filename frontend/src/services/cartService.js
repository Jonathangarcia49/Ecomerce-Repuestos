
import api from '../api/api';
export const getCart = () => api.get('/cart');
export const addToCart = (productId, quantity) => api.post('/cart/add', { productId, quantity });
export const updateCartItem = (itemId, quantity) => api.put(`/cart/item/${itemId}`, { quantity });
export const removeCartItem = (itemId) => api.delete(`/cart/item/${itemId}`);
