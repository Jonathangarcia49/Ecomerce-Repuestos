import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';

export const seedAdmin = async () => {
  const email = 'admin@autoparts.com';
  const exists = await User.findOne({ where: { email } });

  if (exists) {
    if (exists.role !== 'ADMIN') {
      exists.role = 'ADMIN';
      await exists.save();
      console.log('⚠️  Rol de admin corregido a ADMIN');
    }
    return;
  }

  const hash = await bcrypt.hash('Admin123*', 12);
  await User.create({ name: 'Administrador', email, password: hash, role: 'ADMIN' });
  console.log('✅ Admin seed creado:', email);
};