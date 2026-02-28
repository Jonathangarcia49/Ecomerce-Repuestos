// frontend/src/pages/AdminOrders.js
import { useEffect, useState } from 'react';
import { getAllOrders, getOrderDetails, updateOrderStatus } from '../services/adminService';
import { useToast } from '../context/ToastContext';
import Spinner from '../components/Spinner';

const STATUS_OPTIONS = [
  { value: 'PAID',       label: 'Pagado' },
  { value: 'PROCESSING', label: 'Procesando' },
  { value: 'SHIPPED',    label: 'Enviado' },
  { value: 'DELIVERED',  label: 'Entregado' },
  { value: 'CANCELLED',  label: 'Cancelado' },
  { value: 'REFUNDED',   label: 'Reembolsado' },
];

const STATUS_CHIP = {
  PAID: 'status-PAID', PROCESSING: 'status-PROCESSING', SHIPPED: 'status-SHIPPED',
  DELIVERED: 'status-DELIVERED', CANCELLED: 'status-CANCELLED', REFUNDED: 'status-REFUNDED',
};

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export default function AdminOrders() {
  const toast = useToast();
  const [orders, setOrders]           = useState([]);
  const [pagination, setPagination]   = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters]         = useState({ page: 1, limit: 10, status: '' });
  const [loading, setLoading]         = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const load = () => {
    setLoading(true);
    getAllOrders(filters)
      .then((res) => { setOrders(res.data.orders); setPagination(res.data.pagination); })
      .catch((e) => toast.error(e?.response?.data?.message || 'Error cargando órdenes'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [filters]);

  const changeStatus = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus)
      .then(() => {
        toast.success('Estado actualizado');
        load();
        if (selectedOrder?.order?.id === orderId) {
          setSelectedOrder((prev) => ({ ...prev, order: { ...prev.order, status: newStatus } }));
        }
      })
      .catch((e) => toast.error(e?.response?.data?.message || 'Error'));
  };

  const viewDetails = (orderId) => {
    getOrderDetails(orderId)
      .then((res) => setSelectedOrder(res.data))
      .catch((e) => toast.error(e?.response?.data?.message || 'Error'));
  };

  return (
    <div className="container py-4">
      <div className="admin-page-title">
        <h2>📦 Órdenes</h2>
        <span className="text-muted small">{pagination.total} pedidos</span>
      </div>

      {/* Filters */}
      <div className="ap-card p-3 mb-3">
        <div className="row g-2 align-items-end">
          <div className="col-md-4">
            <select className="form-select" value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}>
              <option value="">Todos los estados</option>
              {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div className="col-md-2">
            <select className="form-select" value={filters.limit}
              onChange={(e) => setFilters({ ...filters, limit: e.target.value, page: 1 })}>
              <option value="10">10 / pág</option>
              <option value="25">25 / pág</option>
              <option value="50">50 / pág</option>
            </select>
          </div>
          <div className="col-md-2">
            <button className="btn btn-outline-secondary w-100" onClick={load}>↻ Recargar</button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="ap-card p-0 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead style={{ background: 'var(--surface-2)' }}>
              <tr>
                <th>ID</th><th>Cliente</th><th>Total</th><th>Pago</th><th>Estado</th><th>Fecha</th><th style={{ width: 50 }}></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-4">
                  <span className="spinner-border spinner-border-sm" />
                </td></tr>
              ) : !orders.length ? (
                <tr><td colSpan={7} className="text-center py-4 text-muted">Sin resultados</td></tr>
              ) : orders.map((o) => (
                <tr key={o.id}>
                  <td className="fw-bold small">#{o.id}</td>
                  <td>
                    <div className="small fw-semibold">{o.User?.name || '—'}</div>
                    <div className="text-muted" style={{ fontSize: '.72rem' }}>{o.User?.email}</div>
                  </td>
                  <td className="fw-bold text-success small">${Number(o.total).toFixed(2)}</td>
                  <td className="small text-muted">{o.paymentMethod}</td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      style={{ minWidth: 130 }}
                      value={o.status}
                      onChange={(e) => changeStatus(o.id, e.target.value)}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="small text-muted">{new Date(o.createdAt).toLocaleDateString('es-MX')}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => viewDetails(o.id)}>🔍</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pagination.pages > 1 && (
          <div className="d-flex justify-content-between align-items-center px-3 py-2"
               style={{ borderTop: '1px solid var(--border)', background: 'var(--surface-2)' }}>
            <small className="text-muted">{orders.length} de {pagination.total}</small>
            <div className="d-flex gap-1">
              <button className="btn btn-sm btn-outline-secondary"
                disabled={filters.page <= 1}
                onClick={() => setFilters({ ...filters, page: filters.page - 1 })}>‹</button>
              <span className="btn btn-sm btn-outline-secondary disabled">
                {filters.page} / {pagination.pages}
              </span>
              <button className="btn btn-sm btn-outline-secondary"
                disabled={filters.page >= pagination.pages}
                onClick={() => setFilters({ ...filters, page: filters.page + 1 })}>›</button>
            </div>
          </div>
        )}
      </div>

      {/* Order detail modal */}
      {selectedOrder && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,.45)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: '1rem', border: 'none' }}>
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Orden #{selectedOrder.order.id}</h5>
                <button className="btn-close" onClick={() => setSelectedOrder(null)} />
              </div>
              <div className="modal-body">
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <div className="text-muted small">Cliente</div>
                    <div className="fw-semibold">{selectedOrder.order.User?.name}</div>
                    <div className="text-muted small">{selectedOrder.order.User?.email}</div>
                  </div>
                  <div className="col-md-3">
                    <div className="text-muted small">Total</div>
                    <div className="fw-bold fs-5 text-success">${Number(selectedOrder.order.total).toFixed(2)}</div>
                  </div>
                  <div className="col-md-3">
                    <div className="text-muted small">Estado</div>
                    <span className={`status-chip ${STATUS_CHIP[selectedOrder.order.status] || ''}`}>
                      {STATUS_OPTIONS.find((s) => s.value === selectedOrder.order.status)?.label || selectedOrder.order.status}
                    </span>
                  </div>
                  <div className="col-md-6">
                    <div className="text-muted small">Fecha</div>
                    <div className="small">{fmtDate(selectedOrder.order.createdAt)}</div>
                  </div>
                  <div className="col-md-6">
                    <div className="text-muted small">Método de pago</div>
                    <div className="small">{selectedOrder.order.paymentMethod}</div>
                  </div>
                  {selectedOrder.order.shippingAddress && (
                    <div className="col-12">
                      <div className="text-muted small">Dirección</div>
                      <div className="small">{selectedOrder.order.shippingAddress}</div>
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small">Cambiar estado</label>
                  <select className="form-select form-select-sm" style={{ maxWidth: 200 }}
                    value={selectedOrder.order.status}
                    onChange={(e) => changeStatus(selectedOrder.order.id, e.target.value)}>
                    {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>

                {selectedOrder.items?.length > 0 && (
                  <>
                    <h6 className="fw-bold mb-2">Productos</h6>
                    <div className="table-responsive">
                      <table className="table table-sm">
                        <thead><tr><th>Producto</th><th>Cant.</th><th>Precio</th><th>Subtotal</th></tr></thead>
                        <tbody>
                          {selectedOrder.items.map((item) => (
                            <tr key={item.id}>
                              <td className="small">{item.Product?.name || `#${item.productId}`}</td>
                              <td className="small">{item.quantity}</td>
                              <td className="small">${Number(item.price).toFixed(2)}</td>
                              <td className="small fw-semibold">${(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setSelectedOrder(null)}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

