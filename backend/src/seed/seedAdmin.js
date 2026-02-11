import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';

export const seedAdmin = async () => {
  const email = 'admin@autoparts.com';
  const exists = await User.findOne({ where: { email } });

  if (exists) {
    console.log('✅ Admin ya existe:', exists.email, 'Rol:', exists.role);

    // OPCIONAL: Forzar actualización del rol si está mal
    if (exists.role !== 'ADMIN') {
      exists.role = 'ADMIN';
      await exists.save();
      console.log('⚠️ Rol de admin actualizado a ADMIN');
    }
    return;
  }

  const hash = await bcrypt.hash('Admin123*', 10);
  const admin = await User.create({
    name: 'Administrador',
    email,
    password: hash,
    role: 'ADMIN' // ✅ ASEGURAR QUE SEA EXACTAMENTE 'ADMIN'
  });

  console.log('✅ Admin creado:', admin.email, 'Rol:', admin.role, '(admin@autoparts.com / Admin123*)');
};