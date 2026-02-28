import { Product } from '../models/Product.js';
import { Op } from 'sequelize';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

const deleteImage = (filename) => {
  if (!filename) return;
  const filePath = path.join(uploadsDir, filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
};

/* ─────────────────────────────────────────────
   GET /api/products  (public, paginated + search)
───────────────────────────────────────────── */
export const getAll = async (req, res, next) => {
  try {
    const {
      search = '',
      category,
      brand,
      minPrice,
      maxPrice,
      inStock,
      page = 1,
      limit = 12,
      sort = 'id',
      order = 'DESC',
    } = req.query;

    const where = { active: true };

    if (search.trim()) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search.trim()}%` } },
        { description: { [Op.iLike]: `%${search.trim()}%` } },
        { sku: { [Op.iLike]: `%${search.trim()}%` } },
      ];
    }
    if (category) where.category = category;
    if (brand) where.brand = brand;
    if (minPrice) where.price = { ...where.price, [Op.gte]: parseFloat(minPrice) };
    if (maxPrice) where.price = { ...where.price, [Op.lte]: parseFloat(maxPrice) };
    if (inStock === 'true') where.stock = { [Op.gt]: 0 };

    const allowedSorts = ['id', 'name', 'price', 'stock', 'createdAt'];
    const safeSort = allowedSorts.includes(sort) ? sort : 'id';
    const safeOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const offset = (pageNum - 1) * limitNum;

    const { rows: products, count } = await Product.findAndCountAll({
      where,
      order: [[safeSort, safeOrder]],
      limit: limitNum,
      offset,
    });

    res.json({
      products,
      pagination: {
        total: count,
        page: pageNum,
        pages: Math.ceil(count / limitNum),
        limit: limitNum,
      },
    });
  } catch (e) {
    next(e);
  }
};

/* ─────────────────────────────────────────────
   GET /api/products/:id  (public)
───────────────────────────────────────────── */
export const getOne = async (req, res, next) => {
  try {
    const p = await Product.findOne({ where: { id: req.params.id, active: true } });
    if (!p) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(p);
  } catch (e) {
    next(e);
  }
};

/* ─────────────────────────────────────────────
   POST /api/products  (ADMIN | VENDEDOR)
───────────────────────────────────────────── */
export const create = async (req, res, next) => {
  try {
    const { name, description, price, stock, category, brand, sku } = req.body;

    if (!name?.trim() || price === undefined) {
      return res.status(400).json({ message: 'name y price son requeridos' });
    }

    const priceNum = parseFloat(price);
    const stockNum = parseInt(stock) || 0;
    if (isNaN(priceNum) || priceNum < 0) {
      return res.status(400).json({ message: 'price debe ser un número positivo' });
    }

    const image = req.file ? req.file.filename : null;

    const p = await Product.create({
      name: name.trim(),
      description: description?.trim() || null,
      price: priceNum,
      stock: stockNum,
      image,
      category: category?.trim() || 'General',
      brand: brand?.trim() || null,
      sku: sku?.trim() || null,
    });

    res.status(201).json(p);
  } catch (error) {
    next(error);
  }
};

/* ─────────────────────────────────────────────
   PUT /api/products/:id  (ADMIN | VENDEDOR)
───────────────────────────────────────────── */
export const update = async (req, res, next) => {
  try {
    const p = await Product.findByPk(req.params.id);
    if (!p) return res.status(404).json({ message: 'Producto no encontrado' });

    // Whitelist only allowed fields — prevents mass assignment
    const { name, description, price, stock, category, brand, sku, active } = req.body;
    const updates = {};

    if (name !== undefined) updates.name = name.trim();
    if (description !== undefined) updates.description = description?.trim() || null;
    if (price !== undefined) {
      const priceNum = parseFloat(price);
      if (isNaN(priceNum) || priceNum < 0)
        return res.status(400).json({ message: 'price debe ser un número positivo' });
      updates.price = priceNum;
    }
    if (stock !== undefined) updates.stock = Math.max(0, parseInt(stock) || 0);
    if (category !== undefined) updates.category = category?.trim() || 'General';
    if (brand !== undefined) updates.brand = brand?.trim() || null;
    if (sku !== undefined) updates.sku = sku?.trim() || null;
    if (active !== undefined) updates.active = active === true || active === 'true';

    if (req.file) {
      deleteImage(p.image); // remove old file
      updates.image = req.file.filename;
    }

    await p.update(updates);
    res.json(p);
  } catch (error) {
    next(error);
  }
};

/* ─────────────────────────────────────────────
   DELETE /api/products/:id  (ADMIN)
───────────────────────────────────────────── */
export const remove = async (req, res, next) => {
  try {
    const p = await Product.findByPk(req.params.id);
    if (!p) return res.status(404).json({ message: 'Producto no encontrado' });

    deleteImage(p.image);
    await p.destroy();

    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    next(error);
  }
};

/* ─────────────────────────────────────────────
   GET /api/products/meta/filters  (public)
   Returns available categories/brands for filter UI
───────────────────────────────────────────── */
export const getFilters = async (_req, res, next) => {
  try {
    const [categories, brands] = await Promise.all([
      Product.findAll({
        attributes: ['category'],
        where: { active: true, category: { [Op.ne]: null } },
        group: ['category'],
        order: [['category', 'ASC']],
        raw: true,
      }),
      Product.findAll({
        attributes: ['brand'],
        where: { active: true, brand: { [Op.ne]: null } },
        group: ['brand'],
        order: [['brand', 'ASC']],
        raw: true,
      }),
    ]);
    res.json({
      categories: categories.map((r) => r.category),
      brands: brands.map((r) => r.brand),
    });
  } catch (e) {
    next(e);
  }
};

/* ─────────────────────────────────────────────
   PATCH /api/products/:id/toggle  (ADMIN / VENDEDOR)
───────────────────────────────────────────── */
export const toggleActive = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    product.active = !product.active;
    await product.save();
    res.json({ id: product.id, active: product.active });
  } catch (e) {
    next(e);
  }
};
