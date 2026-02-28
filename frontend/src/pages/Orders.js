
import { useEffect, useState } from 'react';
import { getOrders } from '../services/paymentService';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import Spinner from '../components/Spinner';

const STATUS_LABELS = {
  PAID:        { label: 'Pagado',      css: 'status-PAID' },
  PROCESSING:  { label: 'Procesando',  css: 'status-PROCESSING' },
  SHIPPED:     { label: 'Enviado',     css: 'status-SHIPPED' },
  DELIVERED:   { label: 'Entregado',   css: 'status-DELIVERED' },
  CANCELLED:   { label: 'Cancelado',   css: 'status-CANCELLED' },
  REFUNDED:    { label: 'Reembolsado', css: 'status-REFUNDED' },
};

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });

export default function Orders() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    getOrders()
      .then((res) => setOrders(res.data))
      .catch((e) => toast.error(e?.response?.data?.message || 'Error cargando pedidos'))
      .finally(() => setLoading(false));
  }, []); // runs once on mount

  if (loading) return <Spinner />;

  if (!orders.length) {
    return (
      <div className="container py-5" style={{ maxWidth: 700 }}>
        <div className="empty-state">
          <div className="empty-state__icon">📋</div>
          <div className="empty-state__title">Aún no tienes pedidos</div>
          <p className="text-muted">Cuando realices una compra aparecerá aquí.</p>
          <Link to="/" className="btn btn-accent mt-2">Explorar productos</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ maxWidth: 800 }}>
      <h2 className="fw-bold mb-1">Mis pedidos</h2>
      <p className="text-muted mb-4">{orders.length} pedido{orders.length !== 1 ? 's' : ''} realizados</p>

      <div className="d-flex flex-column gap-3">
        {orders.map((o) => {
          const st = STATUS_LABELS[o.status] || { label: o.status, css: '' };
          return (
            <div key={o.id} className="ap-card p-0 overflow-hidden">
              {/* Header */}
              <div className="d-flex align-items-center justify-content-between px-3 py-2"
                   style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
                <div className="d-flex align-items-center gap-3">
                  <span className="fw-bold text-muted small">Pedido #{o.id}</span>
                  <span className={`status-chip ${st.css}`}>{st.label}</span>
                </div>
                <span className="small text-muted">{fmtDate(o.createdAt)}</span>
              </div>

              {/* Body */}
              <div className="px-3 py-3">
                <div className="row align-items-center g-2">
                  <div className="col-md-5">
                    <div className="small text-muted mb-1">Método de pago</div>
                    <div className="fw-medium">
                      {o.paymentMethod === 'TARJETA' && '💳 '}
                      {o.paymentMethod === 'TRANSFERENCIA' && '🏦 '}
                      {o.paymentMethod === 'CONTRA_ENTREGA' && '📦 '}
                      {o.paymentMethod}
                    </div>
                  </div>
                  {o.shippingAddress && (
                    <div className="col-md-4">
                      <div className="small text-muted mb-1">Dirección</div>
                      <div className="small text-truncate">{o.shippingAddress}</div>
                    </div>
                  )}
                  <div className="col-md-3 text-md-end">
                    <div className="small text-muted mb-1">Total</div>
                    <div className="fs-5 fw-bold text-success">${Number(o.total).toFixed(2)}</div>
                  </div>
                </div>

                {/* Items if present */}
                {o.OrderItems?.length > 0 && (
                  <div className="mt-3 pt-2 border-top">
                    <div className="small text-muted mb-2">Productos ({o.OrderItems.length})</div>
                    <div className="d-flex flex-column gap-1">
                      {o.OrderItems.map((item) => (
                        <div key={item.id} className="d-flex justify-content-between small">
                          <span>{item.Product?.name || `Producto #${item.productId}`} × {item.quantity}</span>
                          <span className="text-muted fw-medium">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

