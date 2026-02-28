import { useEffect, useState } from 'react';
import { getCart, updateCartItem, removeCartItem } from '../services/cartService';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { getImageUrl } from '../api/api';
import Spinner from '../components/Spinner';

export default function Cart() {
  const toast = useToast();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});

  const load = async () => {
    try {
      const res = await getCart();
      setCart(res.data);
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Error cargando carrito');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []); // runs once on mount

  const total = cart?.CartItems?.reduce((sum, i) => sum + i.price * i.quantity, 0) || 0;
  const itemCount = cart?.CartItems?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  const changeQty = async (itemId, qty) => {
    if (qty < 1) return;
    setUpdating((u) => ({ ...u, [itemId]: true }));
    try {
      await updateCartItem(itemId, qty);
      await load();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Error actualizando cantidad');
    } finally {
      setUpdating((u) => ({ ...u, [itemId]: false }));
    }
  };

  const remove = async (itemId) => {
    setUpdating((u) => ({ ...u, [itemId]: 'remove' }));
    try {
      await removeCartItem(itemId);
      toast.info('Producto eliminado del carrito');
      await load();
    } catch (e) {
      toast.error('Error al eliminar producto');
    } finally {
      setUpdating((u) => ({ ...u, [itemId]: false }));
    }
  };

  if (loading) return <Spinner />;

  const items = cart?.CartItems || [];

  return (
    <div className="container py-4" style={{ maxWidth: 900 }}>
      <h2 className="mb-1 fw-bold">🛒 Mi Carrito</h2>
      <p className="text-muted mb-4">{itemCount} {itemCount === 1 ? 'producto' : 'productos'}</p>

      {!items.length ? (
        <div className="empty-state">
          <div className="empty-state__icon">🛒</div>
          <div className="empty-state__title">Tu carrito está vacío</div>
          <p>Agrega productos para comenzar tu compra</p>
          <Link to="/" className="btn btn-accent mt-2">Ver repuestos</Link>
        </div>
      ) : (
        <div className="row g-4">
          {/* Items */}
          <div className="col-lg-8">
            <div className="ap-card">
              <div className="p-3">
                {items.map((item) => (
                  <div key={item.id} className="cart-item">
                    {/* Image */}
                    {getImageUrl(item.Product?.image) ? (
                      <img className="cart-item-img" src={getImageUrl(item.Product?.image)} alt={item.Product?.name} />
                    ) : (
                      <div className="cart-item-placeholder">🔧</div>
                    )}

                    {/* Details */}
                    <div className="flex-grow-1 min-width-0">
                      <div className="fw-semibold text-truncate">{item.Product?.name || 'Producto'}</div>
                      <small className="text-muted">${item.price.toFixed(2)} c/u</small>
                      <div className="fw-bold text-success mt-1">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>

                    {/* Qty controls */}
                    <div className="d-flex align-items-center gap-2 flex-shrink-0">
                      <button
                        className="btn btn-outline-secondary btn-sm px-2"
                        onClick={() => changeQty(item.id, item.quantity - 1)}
                        disabled={updating[item.id] || item.quantity <= 1}
                      >−</button>

                      <span className="fw-semibold" style={{ minWidth: 28, textAlign: 'center' }}>
                        {updating[item.id] && updating[item.id] !== 'remove'
                          ? <span className="spinner-border spinner-border-sm" />
                          : item.quantity}
                      </span>

                      <button
                        className="btn btn-outline-secondary btn-sm px-2"
                        onClick={() => changeQty(item.id, item.quantity + 1)}
                        disabled={!!updating[item.id]}
                      >+</button>

                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => remove(item.id)}
                        disabled={!!updating[item.id]}
                        title="Eliminar"
                      >
                        {updating[item.id] === 'remove' ? <span className="spinner-border spinner-border-sm" /> : '🗑️'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="col-lg-4">
            <div className="ap-card p-4 position-sticky" style={{ top: 80 }}>
              <h5 className="fw-bold mb-3">Resumen</h5>

              <div className="d-flex justify-content-between mb-2 text-muted small">
                <span>Subtotal ({itemCount} {itemCount === 1 ? 'artículo' : 'artículos'})</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2 text-muted small">
                <span>Envío</span>
                <span className="text-success">Gratis</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between fw-bold fs-5 mb-4">
                <span>Total</span>
                <span className="text-success">${total.toFixed(2)}</span>
              </div>

              <Link className="btn btn-accent w-100 py-2 fw-semibold" to="/checkout">
                Proceder al pago →
              </Link>

              <Link className="btn btn-outline-secondary w-100 mt-2 btn-sm" to="/">
                Seguir comprando
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
