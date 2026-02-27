import api from '../api/api';

// Dashboard
export const getDashboardStats = () => api.get('/admin/dashboard');

// Usuarios
export const getAllUsers = (params) => api.get('/admin/users', { params });
export const getUserDetails = (userId) => api.get(`/admin/users/${userId}`);
export const updateUserRole = (userId, role) => api.put(`/admin/users/${userId}/role`, { role });
export const deleteUser = (userId) => api.delete(`/admin/users/${userId}`);

// Órdenes
export const getAllOrders = (params) => api.get('/admin/orders', { params });
export const getOrderDetails = (orderId) => api.get(`/admin/orders/${orderId}`);
export const updateOrderStatus = (orderId, status) => api.put(`/admin/orders/${orderId}/status`, { status });

// Reportes
export const getSalesReport = (params) => api.get('/admin/reports/sales', { params });
export const getInventoryReport = () => api.get('/admin/reports/inventory');

// Productos avanzado
export const bulkUpdateStock = (updates) => api.post('/admin/products/bulk-stock', { updates });
export const toggleProductActive = (id) => api.patch(`/admin/products/${id}/toggle`);