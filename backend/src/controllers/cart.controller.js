import * as cartService from '../services/cart.service.js';

export const getCart = async (req, res) => {
  try {
    const cart = await cartService.getCart(req.user.id);
    res.json(cart);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export const add = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Validación más estricta
    if (!productId || !quantity) {
      return res.status(400).json({ message: 'productId y quantity son requeridos' });
    }

    const cart = await cartService.addToCart(req.user.id, Number(productId), Number(quantity));
    res.json(cart);
  } catch (e) {
    console.error('❌ Error en add:', e.message);
    res.status(400).json({ message: e.message });
  }
};

export const updateItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    console.log('🔄 Actualizando item:', itemId, 'nueva cantidad:', quantity);

    // Validación más estricta
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'quantity debe ser mayor a 0' });
    }

    if (!itemId) {
      return res.status(400).json({ message: 'itemId es requerido' });
    }

    const cart = await cartService.updateItem(req.user.id, itemId, Number(quantity));
    res.json(cart);
  } catch (e) {
    console.error('❌ Error en updateItem:', e.message);
    res.status(400).json({ message: e.message });
  }
};

export const removeItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    if (!itemId) {
      return res.status(400).json({ message: 'itemId es requerido' });
    }

    const cart = await cartService.removeItem(req.user.id, itemId);
    res.json(cart);
  } catch (e) {
    console.error('❌ Error en removeItem:', e.message);
    res.status(400).json({ message: e.message });
  }
};