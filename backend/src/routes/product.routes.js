import { Router } from 'express';
import { getAll, getOne, create, update, remove } from '../controllers/product.controller.js';
import { verifyToken, requireRole } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js'; // 👈 IMPORTANTE

const router = Router();

/* Público */
router.get('/', getAll);
router.get('/:id', getOne);

/* Crear producto → ADMIN y VENDEDOR */
router.post(
  '/',
  verifyToken,
  requireRole('ADMIN', 'VENDEDOR'),
  upload.single('image'), 
  create
);

/* Editar producto → ADMIN y VENDEDOR */
router.put(
  '/:id',
  verifyToken,
  requireRole('ADMIN', 'VENDEDOR'),
  upload.single('image'), 
  update
);

/* Eliminar producto → SOLO ADMIN */
router.delete(
  '/:id',
  verifyToken,
  requireRole('ADMIN'),
  remove
);

export default router;