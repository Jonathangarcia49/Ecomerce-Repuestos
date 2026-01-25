
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'Token requerido' });
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : auth;

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'super_secreto_123');
    next();
  } catch {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

export const requireRole = (role) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'No autenticado' });
  if (req.user.role !== role) return res.status(403).json({ message: 'Sin permisos' });
  next();
};
