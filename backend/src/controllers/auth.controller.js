import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const SALT_ROUNDS = 12;
const TOKEN_EXPIRY = '7d';

const jwtSecret = () => {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET no está configurado');
  return process.env.JWT_SECRET;
};

const signToken = (userId) =>
  jwt.sign({ id: userId }, jwtSecret(), { expiresIn: TOKEN_EXPIRY });

const PUBLIC_USER_FIELDS = ['id', 'name', 'email', 'role', 'createdAt'];

const pickUser = (user) =>
  PUBLIC_USER_FIELDS.reduce((acc, f) => ({ ...acc, [f]: user[f] }), {});

/* ─────────────────────────────────────────────
   POST /api/auth/register
───────────────────────────────────────────── */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    // Password strength: min 8 chars, 1 uppercase, 1 number
    const pwRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!pwRegex.test(password)) {
      return res.status(400).json({
        message: 'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número',
      });
    }

    const exists = await User.findOne({ where: { email: email.toLowerCase().trim() } });
    if (exists) {
      return res.status(409).json({ message: 'Email ya registrado' });
    }

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hash,
      role: 'CLIENTE',
    });

    res.status(201).json({ token: signToken(user.id), user: pickUser(user) });
  } catch (e) {
    next(e);
  }
};

/* ─────────────────────────────────────────────
   POST /api/auth/login
───────────────────────────────────────────── */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({ message: 'Email y password son requeridos' });
    }

    const user = await User.findOne({ where: { email: email.toLowerCase().trim() } });
    // Always compare hash to prevent timing attacks
    const dummyHash = '$2a$12$invalidhashfortimingatck00000000000000000000000';
    const valid = user
      ? await bcrypt.compare(password, user.password)
      : await bcrypt.compare(password, dummyHash).then(() => false);

    if (!user || !valid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    res.json({ token: signToken(user.id), user: pickUser(user) });
  } catch (e) {
    next(e);
  }
};

/* ─────────────────────────────────────────────
   GET /api/auth/me
───────────────────────────────────────────── */
export const me = async (req, res) => {
  res.json({ user: pickUser(req.user) });
};
