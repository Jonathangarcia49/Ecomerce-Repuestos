
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';

export const seedAdmin = async () => {
  const email = 'admin@autoparts.com';
  const exists = await User.findOne({ where: { email } });
  if (exists) return;

  const hash = await bcrypt.hash('Admin123*', 10);
  await User.create({ name: 'Administrador', email, password: hash, role: 'ADMIN' });
  console.log('Admin creado  (admin@autoparts.com / Admin123*)');
};
