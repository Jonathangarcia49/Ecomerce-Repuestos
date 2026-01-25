
import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import * as cartController from '../controllers/cart.controller.js';

const router = Router();

/**
 * @openapi
 * /api/cart:
 *   get:
 *     summary: Ver carrito del usuario
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: OK }
 */
router.get('/', verifyToken, cartController.getCart);

/**
 * @openapi
 * /api/cart/add:
 *   post:
 *     summary: Agregar item al carrito
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId, quantity]
 *             properties:
 *               productId: { type: integer, example: 1 }
 *               quantity: { type: integer, example: 2 }
 *     responses:
 *       200: { description: OK }
 */
router.post('/add', verifyToken, cartController.add);

router.put('/item/:itemId', verifyToken, cartController.updateItem);
router.delete('/item/:itemId', verifyToken, cartController.removeItem);

export default router;
