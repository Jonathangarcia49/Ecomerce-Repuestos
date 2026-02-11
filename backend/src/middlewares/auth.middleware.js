import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token requerido' });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

    // Obtener usuario completo de la DB
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(401).json({ message: 'Usuario no válido' });
    }

    // Asignar el usuario completo al request
    req.user = user;

    console.log('✅ Usuario autenticado:', user.email, 'Rol:', user.role);

    next();
  } catch (e) {
    console.error('❌ Error en verifyToken:', e.message);
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    console.log('🔍 Verificando rol. Usuario:', req.user?.email, 'Rol actual:', req.user?.role, 'Roles permitidos:', roles);

    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Acceso denegado. Se requiere rol: ${roles.join(' o ')}`
      });
    }

    next();
  };
};

// Middleware para logging de acciones administrativas (opcional)
export const auditLog = (action) => {
  return (req, res, next) => {
    console.log(`[AUDIT] ${new Date().toISOString()} - User: ${req.user?.email} - Action: ${action}`);
    next();
  };
};