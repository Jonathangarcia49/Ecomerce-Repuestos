
import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import * as paymentController from '../controllers/payment.controller.js';

const router = Router();

/**
 * @openapi
 * /api/payment/checkout:
 *   post:
 *     summary: Checkout (pago simulado) - crea una orden y cierra el carrito
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentMethod: { type: string, example: "TARJETA" }
 *     responses:
 *       200: { description: Orden creada }
 */
router.post('/checkout', verifyToken, paymentController.checkout);

router.get('/orders', verifyToken, paymentController.orders);

export default router;
