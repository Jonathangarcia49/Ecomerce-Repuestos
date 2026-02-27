import { Router } from 'express';
import { verifyToken, requireRole } from '../middlewares/auth.middleware.js';
import * as adminController from '../controllers/admin.controller.js';

const router = Router();

// Aplicar middlewares a TODAS las rutas admin
router.use(verifyToken); // Primero autenticar
router.use(requireRole('ADMIN')); // Luego verificar rol

// Dashboard
router.get('/dashboard', adminController.getDashboardStats);

// Usuarios
router.get('/users', adminController.getAllUsers);
router.get('/users/:userId', adminController.getUserDetails);
router.put('/users/:userId/role', adminController.updateUserRole);
router.delete('/users/:userId', adminController.deleteUser);

// Órdenes
router.get('/orders', adminController.getAllOrders);
router.get('/orders/:orderId', adminController.getOrderDetails);
router.put('/orders/:orderId/status', adminController.updateOrderStatus);

// Reportes
router.get('/reports/sales', adminController.getSalesReport);
router.get('/reports/inventory', adminController.getInventoryReport);

// Productos avanzado
router.post('/products/bulk-stock', adminController.bulkUpdateStock);
router.patch('/products/:id/toggle', adminController.toggleProductActive);

export default router;