// src/controllers/admin.controller.js
import { User } from '../models/User.js';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { Cart } from '../models/Cart.js';
import { CartItem } from '../models/CartItem.js';
import { Op } from 'sequelize';

// ====== DASHBOARD ======
export const getDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers, totalProducts, totalOrders, activeCartsCount] = await Promise.all([
      User.count({ where: { role: 'CLIENTE' } }),
      Product.count(),
      Order.count(),
      Cart.count({ where: { status: 'ACTIVE' } })
    ]);

    const totalRevenue = await Order.sum('total') || 0;

    const recentOrders = await Order.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [{ model: User, attributes: ['name', 'email'] }]
    });

    const lowStockProducts = await Product.findAll({
      where: { stock: { [Op.lte]: 10 } },
      order: [['stock', 'ASC']],
      limit: 10
    });

    res.json({
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        activeCartsCount,
        totalRevenue: parseFloat(totalRevenue.toFixed(2))
      },
      recentOrders,
      lowStockProducts
    });
  } catch (e) {
    next(e);
  }
};

// ====== GESTIÓN DE USUARIOS ======
export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (role) where.role = role;
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { rows: users, count } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      users,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['ADMIN', 'VENDEDOR', 'CLIENTE'].includes(role)) {
      return res.status(400).json({ message: 'Role inválido. Roles válidos: ADMIN, VENDEDOR, CLIENTE' });
    }

    const user = await User.findByPk(req.params.userId);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Evitar que el admin se quite sus propios permisos
    if (user.id === req.user.id && role !== 'ADMIN') {
      return res.status(400).json({ message: 'No puedes cambiar tu propio rol' });
    }

    user.role = role;
    await user.save();

    res.json({ message: 'Role actualizado', user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getUserDetails = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Order,
          limit: 10,
          order: [['createdAt', 'DESC']]
        }
      ]
    });

    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const orderStats = {
      totalOrders: user.Orders.length,
      totalSpent: user.Orders.reduce((sum, o) => sum + o.total, 0)
    };

    res.json({ user, orderStats });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Evitar que el admin se elimine a sí mismo
    if (user.id === req.user.id) {
      return res.status(400).json({ message: 'No puedes eliminar tu propia cuenta' });
    }

    await user.destroy();
    res.json({ message: 'Usuario eliminado' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// ====== GESTIÓN DE ÓRDENES ======
export const getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, userId } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;
    if (userId) where.UserId = userId;

    const { rows: orders, count } = await Order.findAndCountAll({
      where,
      include: [{ model: User, attributes: ['name', 'email'] }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      orders,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getOrderDetails = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.orderId, {
      include: [
        { model: User, attributes: ['name', 'email'] }
      ]
    });

    if (!order) return res.status(404).json({ message: 'Orden no encontrada' });

    // Buscar el carrito completado asociado a esta orden
    const cart = await Cart.findOne({
      where: {
        UserId: order.UserId,
        status: 'COMPLETED',
        createdAt: { [Op.lte]: order.createdAt }
      },
      include: [{ model: CartItem, include: [Product] }],
      order: [['createdAt', 'DESC']],
      limit: 1
    });

    res.json({ order, items: cart?.CartItems || [] });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Status inválido' });
    }

    const order = await Order.findByPk(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Orden no encontrada' });

    order.status = status;
    await order.save();

    res.json({ message: 'Status actualizado', order });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// ====== REPORTES ======
export const getSalesReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const where = {};
    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const orders = await Order.findAll({
      where,
      attributes: ['createdAt', 'total', 'status'],
      order: [['createdAt', 'ASC']]
    });

    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

    const salesByStatus = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    res.json({
      totalOrders: orders.length,
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      avgOrderValue: parseFloat(avgOrderValue.toFixed(2)),
      salesByStatus,
      orders
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getInventoryReport = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      order: [['stock', 'ASC']]
    });

    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const totalValue = products.reduce((sum, p) => sum + (p.stock * p.price), 0);
    const outOfStock = products.filter(p => p.stock === 0).length;
    const lowStock = products.filter(p => p.stock > 0 && p.stock <= 10).length;

    res.json({
      summary: {
        totalProducts,
        totalStock,
        totalValue: parseFloat(totalValue.toFixed(2)),
        outOfStock,
        lowStock
      },
      products
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// ====== PRODUCTOS AVANZADO ======
export const bulkUpdateStock = async (req, res, next) => {
  try {
    const { updates } = req.body; // [{ id: 1, stock: 50 }, { id: 2, stock: 30 }]

    if (!Array.isArray(updates)) {
      return res.status(400).json({ message: 'updates debe ser un array' });
    }

    const results = await Promise.all(
      updates.map(async ({ id, stock }) => {
        const product = await Product.findByPk(id);
        if (product) {
          product.stock = stock;
          await product.save();
          return { id, success: true };
        }
        return { id, success: false, error: 'Producto no encontrado' };
      })
    );

    res.json({ message: 'Actualización masiva completada', results });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const toggleProductActive = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    product.active = !product.active;
    await product.save();

    res.json({ message: `Producto ${product.active ? 'activado' : 'desactivado'}`, product });
  } catch (e) {
    next(e);
  }
};
