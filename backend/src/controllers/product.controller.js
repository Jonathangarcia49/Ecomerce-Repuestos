import { Product } from '../models/Product.js';
import fs from 'fs';
import path from 'path';

/* =========================
   Obtener todos
========================= */
export const getAll = async (_req, res) => {
  const products = await Product.findAll({ order: [['id', 'DESC']] });
  res.json(products);
};

/* =========================
   Obtener uno
========================= */
export const getOne = async (req, res) => {
  const p = await Product.findByPk(req.params.id);
  if (!p) return res.status(404).json({ message: 'Producto no encontrado' });
  res.json(p);
};

/* =========================
   Crear producto
========================= */
export const create = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ message: 'name y price son requeridos' });
    }

    const image = req.file ? req.file.filename : null;

    const p = await Product.create({
      name,
      description,
      price,
      stock,
      image
    });

    res.status(201).json(p);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   Actualizar producto
========================= */
export const update = async (req, res) => {
  try {
    const p = await Product.findByPk(req.params.id);
    if (!p) return res.status(404).json({ message: 'Producto no encontrado' });

    let image = p.image;

    // Si se sube nueva imagen
    if (req.file) {
      // Borrar imagen anterior si existe
      if (p.image) {
        const oldPath = path.resolve('uploads', p.image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      image = req.file.filename;
    }

    await p.update({
      ...req.body,
      image
    });

    res.json(p);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   Eliminar producto
========================= */
export const remove = async (req, res) => {
  try {
    const p = await Product.findByPk(req.params.id);
    if (!p) return res.status(404).json({ message: 'Producto no encontrado' });

    // Borrar imagen física
    if (p.image) {
      const filePath = path.resolve('uploads', p.image);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await p.destroy();

    res.json({ message: 'Producto eliminado' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
