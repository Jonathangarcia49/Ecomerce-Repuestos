
import { Router } from 'express';
import { login, register } from '../controllers/auth.controller.js';

const router = Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Registrar usuario (CLIENTE)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string, example: "Jose" }
 *               email: { type: string, example: "jose@mail.com" }
 *               password: { type: string, example: "123456" }
 *     responses:
 *       201: { description: Usuario creado + token }
 */
router.post('/register', register);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Login (devuelve JWT)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: "admin@autoparts.com" }
 *               password: { type: string, example: "Admin123*" }
 *     responses:
 *       200: { description: Token + user }
 */
router.post('/login', login);

export default router;
