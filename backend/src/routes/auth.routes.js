
import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { login, register, me } from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

/* ─── Strict rate limit for auth endpoints (brute-force protection) ─── */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10,
  message: { message: 'Demasiados intentos. Espera 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

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
 *               password: { type: string, example: "Password1" }
 *     responses:
 *       201: { description: Usuario creado + token }
 */
router.post('/register', authLimiter, register);

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
 *       401: { description: Credenciales inválidas }
 */
router.post('/login', authLimiter, login);

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     summary: Obtener usuario autenticado
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200: { description: Datos del usuario }
 */
router.get('/me', verifyToken, me);

export default router;
