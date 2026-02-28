import { Router } from 'express';
import { getAll, getOne, create, update, remove, getFilters, toggleActive } from '../controllers/product.controller.js';
import { verifyToken, requireRole } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = Router();

/* ── Public ── */
router.get('/meta/filters', getFilters);   // must come before /:id
router.get('/', getAll);
router.get('/:id', getOne);

/* ── Crear producto → ADMIN y VENDEDOR ── */
router.post('/', verifyToken, requireRole('ADMIN', 'VENDEDOR'), upload.single('image'), create);

/* ── Editar producto → ADMIN y VENDEDOR ── */
router.put('/:id', verifyToken, requireRole('ADMIN', 'VENDEDOR'), upload.single('image'), update);

/* ── Eliminar producto → SOLO ADMIN ── */
router.delete('/:id', verifyToken, requireRole('ADMIN'), remove);

/* ── Activar/Desactivar → ADMIN y VENDEDOR ── */
router.patch('/:id/toggle', verifyToken, requireRole('ADMIN', 'VENDEDOR'), toggleActive);

export default router;