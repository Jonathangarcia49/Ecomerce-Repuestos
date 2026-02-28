import { useState, useEffect } from 'react';
import { checkout as checkoutApi } from '../services/paymentService';
import { getCart } from '../services/cartService';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { getImageUrl } from '../api/api';
import Spinner from '../components/Spinner';

const PAYMENT_METHODS = [
  { value: 'TARJETA',        label: '💳 Tarjeta de crédito / débito' },
  { value: 'TRANSFERENCIA',  label: '🏦 Transferencia bancaria' },
  { value: 'CONTRA_ENTREGA', label: '📦 Pago contra entrega' },
];

export default function Checkout() {
  const nav = useNavigate();
  const toast = useToast();

  const [cart, setCart]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [paying, setPaying]     = useState(false);
  const [method, setMethod]     = useState('TARJETA');
  const [address, setAddress]   = useState('');
  const [notes, setNotes]       = useState('');

  useEffect(() => {
    getCart()
      .then((res) => setCart(res.data))
      .catch(() => toast.error('Error cargando carrito'))
      .finally(() => setLoading(false));
  }, []); // runs once on mount

  const items = cart?.CartItems || [];
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const pay = async () => {
    if (!items.length) { toast.warning('Tu carrito está vacío'); return; }
    if (!address.trim()) { toast.warning('Ingresa la dirección de envío'); return; }

    setPaying(true);
    try {
      const res = await checkoutApi(method, address.trim(), notes.trim());
      toast.success(`✅ Pago procesado. Orden #${res.data.id}`);
      setTimeout(() => nav('/orders'), 1200);
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Error procesando el pago');
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <Spinner />;

  if (!items.length) {
    return (
      <div className="container py-4" style={{ maxWidth: 640 }}>
        <div className="empty-state">
          <div className="empty-state__icon">🛒</div>
          <div className="empty-state__title">Carrito vacío</div>
          <p>No puedes proceder al pago sin productos en el carrito.</p>
          <a href="/" className="btn btn-accent mt-2">Ver productos</a>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ maxWidth: 880 }}>
      <h2 className="fw-bold mb-1">Checkout</h2>
      <p className="text-muted mb-4">Revisa tu pedido y completa el pago</p>

      <div className="row g-4">
        {/* Left: form */}
        <div className="col-lg-7">

          {/* Shipping address */}
          <div className="ap-card mb-3 p-3">
            <h6 className="fw-bold mb-3">📦 Dirección de envío</h6>
            <input
              type="text"
              className="form-control"
              placeholder="Calle, número, ciudad, código postal..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          {/* Payment method */}
          <div className="ap-card mb-3 p-3">
            <h6 className="fw-bold mb-3">💳 Método de pago</h6>
            <div className="d-flex flex-column gap-2">
              {PAYMENT_METHODS.map((m) => (
                <label
                  key={m.value}
                  className={`d-flex align-items-center gap-3 p-3 border rounded-3 cursor-pointer ${method === m.value ? 'border-warning bg-warning bg-opacity-10' : ''}`}
                  style={{ cursor: 'pointer' }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={m.value}
                    checked={method === m.value}
                    onChange={() => setMethod(m.value)}
                    className="form-check-input mt-0"
                  />
                  <span className="fw-medium">{m.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="ap-card p-3">
            <h6 className="fw-bold mb-3">📝 Notas (opcional)</h6>
            <textarea
              className="form-control"
              rows={2}
              placeholder="Instrucciones especiales para el envío..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Right: order summary */}
        <div className="col-lg-5">
          <div className="ap-card p-3 position-sticky" style={{ top: 80 }}>
            <h6 className="fw-bold mb-3">Resumen del pedido</h6>

            <div className="mb-3" style={{ maxHeight: 260, overflowY: 'auto' }}>
              {items.map((item) => (
                <div key={item.id} className="d-flex align-items-center gap-2 py-2 border-bottom">
                  {getImageUrl(item.Product?.image) ? (
                    <img
                      src={getImageUrl(item.Product?.image)}
                      alt={item.Product?.name}
                      style={{ width: 44, height: 44, objectFit: 'contain', background: '#f1f5f9', borderRadius: 6 }}
                    />
                  ) : (
                    <div style={{ width: 44, height: 44, background: '#f1f5f9', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🔧</div>
                  )}
                  <div className="flex-grow-1 min-width-0">
                    <div className="text-truncate small fw-medium">{item.Product?.name}</div>
                    <small className="text-muted">x{item.quantity}</small>
                  </div>
                  <div className="text-nowrap small fw-semibold">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className="d-flex justify-content-between text-muted small mb-1">
              <span>Subtotal</span><span>${total.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between text-muted small mb-2">
              <span>Envío</span><span className="text-success">Gratis</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between fw-bold fs-5 mb-3">
              <span>Total</span>
              <span className="text-success">${total.toFixed(2)}</span>
            </div>

            <button
              className="btn btn-accent w-100 py-2 fw-semibold"
              onClick={pay}
              disabled={paying}
            >
              {paying ? (
                <span><span className="spinner-border spinner-border-sm me-2" />Procesando...</span>
              ) : `Confirmar pago $${total.toFixed(2)}`}
            </button>

            <p className="text-center text-muted mt-2 mb-0" style={{ fontSize: '.75rem' }}>
              🔒 Pago simulado — sin cargos reales
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
