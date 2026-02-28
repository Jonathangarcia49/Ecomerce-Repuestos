import { useEffect, useState } from 'react';
import { getDashboardStats } from '../services/adminService';
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

export default function AdminDashboard() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const load = () => {
    setLoading(true);
    getDashboardStats()
      .then((res) => setData(res.data))
      .catch((e) => toast.error(e?.response?.data?.message || 'Error cargando dashboard'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []); // runs once on mount

  if (loading) return <Spinner />;
  if (!data) return null;

  const { stats, recentOrders, lowStockProducts } = data;

  return (
    <div className="container py-4">
      <div className="admin-page-title">
        <h2>Dashboard</h2>
        <button className="btn btn-sm btn-outline-secondary" onClick={load}>↻ Actualizar</button>
      </div>

      {/* KPI cards */}
      <div className="row g-3 mb-4">
        {[
          { icon: '👥', label: 'Usuarios',    value: stats.totalUsers,                color: '#6366f1' },
          { icon: '📦', label: 'Productos',   value: stats.totalProducts,             color: '#0ea5e9' },
          { icon: '🛒', label: 'Órdenes',     value: stats.totalOrders,               color: '#f59e0b' },
          { icon: '💰', label: 'Ingresos',    value: `$${Number(stats.totalRevenue).toFixed(2)}`, color: '#10b981' },
        ].map((card) => (
          <div className="col-6 col-md-3" key={card.label}>
            <div className="stat-card">
              <div className="stat-card__icon" style={{ color: card.color, fontSize: '1.6rem' }}>{card.icon}</div>
              <div className="stat-card__value">{card.value}</div>
              <div className="stat-card__label">{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Active carts banner */}
      {stats.activeCartsCount > 0 && (
        <div className="alert d-flex align-items-center gap-2 mb-4"
             style={{ background: '#fef9c3', border: '1px solid #fde047', borderRadius: '0.75rem' }}>
          <span style={{ fontSize: '1.2rem' }}>🛍️</span>
          <span>Hay <strong>{stats.activeCartsCount}</strong> carrito{stats.activeCartsCount !== 1 ? 's' : ''} activo{stats.activeCartsCount !== 1 ? 's' : ''} en este momento</span>
        </div>
      )}

      <div className="row g-3">
        {/* Recent orders */}
        <div className="col-md-6">
          <div className="ap-card p-0 overflow-hidden h-100">
            <div className="d-flex align-items-center justify-content-between px-3 py-2"
                 style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
              <span className="fw-semibold">🛒 Órdenes recientes</span>
              <Link to="/admin/orders" className="btn btn-sm btn-outline-secondary">Ver todas</Link>
            </div>
            <div className="p-3">
              {!recentOrders?.length ? (
                <div className="text-muted text-center py-3">Sin órdenes aún</div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {recentOrders.map((o) => {
                    const st = STATUS_LABELS[o.status] || { label: o.status, css: '' };
                    return (
                      <div key={o.id} className="d-flex align-items-center justify-content-between py-1 border-bottom">
                        <div>
                          <div className="fw-semibold small">Orden #{o.id}</div>
                          <div className="text-muted" style={{ fontSize: '.75rem' }}>
                            {o.User?.name || 'Cliente'} · {fmtDate(o.createdAt)}
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <span className={`status-chip ${st.css}`}>{st.label}</span>
                          <span className="fw-bold small text-success">${Number(o.total).toFixed(2)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Low stock */}
        <div className="col-md-6">
          <div className="ap-card p-0 overflow-hidden h-100">
            <div className="d-flex align-items-center justify-content-between px-3 py-2"
                 style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
              <span className="fw-semibold">⚠️ Stock bajo</span>
              <Link to="/admin/products" className="btn btn-sm btn-outline-secondary">Ver productos</Link>
            </div>
            <div className="p-3">
              {!lowStockProducts?.length ? (
                <div className="text-success text-center py-3 small">✅ Todo con stock suficiente</div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {lowStockProducts.map((p) => (
                    <div key={p.id} className="d-flex align-items-center justify-content-between py-1 border-bottom">
                      <div>
                        <div className="fw-semibold small">{p.name}</div>
                        <div className="text-muted" style={{ fontSize: '.75rem' }}>${Number(p.price).toFixed(2)}</div>
                      </div>
                      <span className={`status-chip ${p.stock === 0 ? 'status-CANCELLED' : 'status-PROCESSING'}`}>
                        Stock: {p.stock}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}