
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const signToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'super_secreto_123',
    { expiresIn: '7d' }
  );

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'name, email y password son requeridos' });
  }

  const exists = await User.findOne({ where: { email } });
  if (exists) return res.status(409).json({ message: 'Email ya registrado' });

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hash, role: 'CLIENTE' });

  res.status(201).json({
    token: signToken(user),
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'email y password requeridos' });

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: 'Credenciales inválidas' });

  res.json({
    token: signToken(user),
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
};
