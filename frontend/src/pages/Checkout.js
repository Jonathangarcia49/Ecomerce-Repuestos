import { useState, useEffect } from 'react';
import { checkout } from '../services/paymentService';
import { getCart } from '../services/cartService';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const nav = useNavigate();
  const [method, setMethod] = useState('TARJETA');
  const [cart, setCart] = useState(null);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const res = await getCart();
      setCart(res.data);

      if (!res.data.CartItems?.length) {
        setErr('Tu carrito está vacío');
      }
    } catch (e) {
      setErr('Error cargando carrito');
    }
  };

  const total = cart?.CartItems?.reduce((sum, i) => sum + i.price * i.quantity, 0) || 0;

  const pay = async () => {
    if (!cart?.CartItems?.length) {
      setErr('Tu carrito está vacío');
      return;
    }

    setMsg('');
    setErr('');
    setLoading(true);

    try {
      const res = await checkout(method);
      setMsg(`✅ Pago procesado exitosamente. Orden #${res.data.id}`);
      setTimeout(() => nav('/orders'), 1500);
    } catch (e) {
      console.error('Error en checkout:', e);
      setErr(e?.response?.data?.message || 'Error procesando el pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: 640 }}>
      <h3>Checkout</h3>

      {msg && <div className="alert alert-success">{msg}</div>}
      {err && <div className="alert alert-danger">{err}</div>}

      {cart && cart.CartItems?.length > 0 && (
        <>
          <div className="card shadow-sm mb-3">
            <div className="card-header">
              <h5 className="mb-0">Resumen de tu pedido</h5>
            </div>
            <div className="card-body">
              {cart.CartItems.map(item => (
                <div key={item.id} className="d-flex justify-content-between py-2 border-bottom">
                  <div>
                    <div className="fw-bold">{item.Product?.name}</div>
                    <small className="text-muted">Cantidad: {item.quantity}</small>
                  </div>
                  <span className="fw-bold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="d-flex justify-content-between mt-3 pt-3 border-top">
                <strong className="fs-5">Total</strong>
                <strong className="text-success fs-4">${total.toFixed(2)}</strong>
              </div>
            </div>
          </div>

          <div className="card p-3 shadow-sm">
            <label className="form-label">Método de pago</label>
            <select
              className="form-select"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              disabled={loading}
            >
              <option value="TARJETA">Tarjeta de crédito/débito</option>
              <option value="TRANSFERENCIA">Transferencia bancaria</option>
              <option value="CONTRA_ENTREGA">Pago contra entrega</option>
            </select>

            <button
              className="btn btn-dark btn-lg mt-3 w-100"
              onClick={pay}
              disabled={loading || !cart?.CartItems?.length}
            >
              {loading ? 'Procesando...' : `Pagar $${total.toFixed(2)}`}
            </button>

            <small className="text-muted mt-2 text-center d-block">
              Pago simulado - No se procesará ningún cargo real
            </small>
          </div>
        </>
      )}

      {cart && !cart.CartItems?.length && (
        <div className="alert alert-warning">
          Tu carrito está vacío. <a href="/">Ver productos</a>
        </div>
      )}
    </div>
  );
}