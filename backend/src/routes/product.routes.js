
import { Router } from 'express';
import { getAll, getOne, create, update, remove } from '../controllers/product.controller.js';
import { verifyToken, requireRole } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @openapi
 * /api/products:
 *   get:
 *     summary: Listar productos
 *     tags: [Products]
 *     responses:
 *       200: { description: OK }
 *   post:
 *     summary: Crear producto (SOLO ADMIN)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price]
 *             properties:
 *               name: { type: string, example: "Filtro de aceite" }
 *               price: { type: number, example: 12.99 }
 *               stock: { type: integer, example: 10 }
 *               image: { type: string, example: "https://..." }
 *               description: { type: string, example: "Repuesto original" }
 *     responses:
 *       201: { description: Creado }
 *       403: { description: Sin permisos }
 */
router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', verifyToken, requireRole('ADMIN'), create);
router.put('/:id', verifyToken, requireRole('ADMIN'), update);
router.delete('/:id', verifyToken, requireRole('ADMIN'), remove);

export default router;
