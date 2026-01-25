
import { Product } from '../models/Product.js';

export const getAll = async (_req, res) => {
  const products = await Product.findAll({ order: [['id', 'DESC']] });
  res.json(products);
};

export const getOne = async (req, res) => {
  const p = await Product.findByPk(req.params.id);
  if (!p) return res.status(404).json({ message: 'Producto no encontrado' });
  res.json(p);
};

export const create = async (req, res) => {
  const { name, price } = req.body;
  if (!name || price === undefined) return res.status(400).json({ message: 'name y price son requeridos' });
  const p = await Product.create(req.body);
  res.status(201).json(p);
};

export const update = async (req, res) => {
  const p = await Product.findByPk(req.params.id);
  if (!p) return res.status(404).json({ message: 'Producto no encontrado' });
  await p.update(req.body);
  res.json(p);
};

export const remove = async (req, res) => {
  const deleted = await Product.destroy({ where: { id: req.params.id } });
  if (!deleted) return res.status(404).json({ message: 'Producto no encontrado' });
  res.json({ message: 'Producto eliminado' });
};
