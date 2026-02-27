// frontend/src/pages/AdminOrders.js
import { useEffect, useState } from 'react';
import { getAllOrders, getOrderDetails, updateOrderStatus } from '../services/adminService';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({ page: 1, limit: 10, status: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const load = async () => {
    setLoading(true);
    setErr('');
    try {
      const res = await getAllOrders(filters);
      setOrders(res.data.orders);
      setPagination(res.data.pagination);
    } catch (e) {
      setErr(e?.response?.data?.message || 'Error cargando órdenes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filters]);

  const changeStatus = async (orderId, newStatus) => {
    setMsg(''); setErr('');
    try {
      await updateOrderStatus(orderId, newStatus);
      setMsg('✅ Status actualizado');
      await load();
      if (selectedOrder?.order.id === orderId) {
        setSelectedOrder(null);
      }
    } catch (e) {
      setErr(e?.response?.data?.message || 'Error');
    }
  };

  const viewDetails = async (orderId) => {
    try {
      const res = await getOrderDetails(orderId);
      setSelectedOrder(res.data);
    } catch (e) {
      setErr(e?.response?.data?.message || 'Error');
    }
  };

  const statusColors = {
    'PAID': 'success',
    'PROCESSING': 'info',
    'SHIPPED': 'primary',
    'DELIVERED': 'success',
    'CANCELLED': 'danger',
    'REFUNDED': 'warning'
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">📦 Gestión de Órdenes</h2>

      {msg && <div className="alert alert-success">{msg}</div>}
      {err && <div className="alert alert-danger">{err}</div>}

      {/* Filtros */}
      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <div className="row g-2">
            <div className="col-md-4">
              <select
                className="form-select"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
              >
                <option value="">Todos los estados</option>
                <option value="PAID">Pagado</option>
                <option value="PROCESSING">Procesando</option>
                <option value="SHIPPED">Enviado</option>
                <option value="DELIVERED">Entregado</option>
                <option value="CANCELLED">Cancelado</option>
                <option value="REFUNDED">Reembolsado</option>
              </select>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={filters.limit}
                onChange={(e) => setFilters({ ...filters, limit: e.target.value, page: 1 })}
              >
                <option value="10">10 por página</option>
                <option value="25">25 por página</option>
                <option value="50">50 por página</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de órdenes */}
      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Total</th>
                <th>Método Pago</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="text-center py-4">Cargando...</td></tr>
              ) : !orders.length ? (
                <tr><td colSpan="7" className="text-center py-4 text-muted">No hay órdenes</td></tr>
              ) : (
                orders.map(o => (
                  <tr key={o.id}>
                    <td className="fw-bold">#{o.id}</td>
                    <td>{o.User?.name || 'Usuario'}<br /><small className="text-muted">{o.User?.email}</small></td>
                    <td className="fw-bold text-success">${o.total}</td>
                    <td>{o.paymentMethod}</td>
                    <td>
                      <span className={`badge bg-${statusColors[o.status] || 'secondary'}`}>
                        {o.status}
                      </span>
                    </td>
                    <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => viewDetails(o.id)}
                      >
                        Ver detalles
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {pagination.pages > 1 && (
          <div className="card-footer d-flex justify-content-between align-items-center">
            <small className="text-muted">
              Mostrando {orders.length} de {pagination.total} órdenes
            </small>
            <div className="btn-group">
              <button
                className="btn btn-sm btn-outline-dark"
                disabled={pagination.page === 1}
                onClick={() => setFilters({ ...filters, page: pagination.page - 1 })}
              >
                Anterior
              </button>
              <button className="btn btn-sm btn-dark" disabled>
                Página {pagination.page} de {pagination.pages}
              </button>
              <button
                className="btn btn-sm btn-outline-dark"
                disabled={pagination.page === pagination.pages}
                onClick={() => setFilters({ ...filters, page: pagination.page + 1 })}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de detalles */}
      {selectedOrder && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Orden #{selectedOrder.order.id}</h5>
                <button className="btn-close" onClick={() => setSelectedOrder(null)}></button>
              </div>
              <div className="modal-body">
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <strong>Cliente:</strong> {selectedOrder.order.User?.name}<br />
                    <small className="text-muted">{selectedOrder.order.User?.email}</small>
                  </div>
                  <div className="col-md-6">
                    <strong>Total:</strong> <span className="text-success fs-5">${selectedOrder.order.total}</span>
                  </div>
                  <div className="col-md-6">
                    <strong>Método de pago:</strong> {selectedOrder.order.paymentMethod}
                  </div>
                  <div className="col-md-6">
                    <strong>Fecha:</strong> {new Date(selectedOrder.order.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label"><strong>Cambiar estado:</strong></label>
                  <select
                    className="form-select"
                    value={selectedOrder.order.status}
                    onChange={(e) => changeStatus(selectedOrder.order.id, e.target.value)}
                  >
                    <option value="PAID">Pagado</option>
                    <option value="PROCESSING">Procesando</option>
                    <option value="SHIPPED">Enviado</option>
                    <option value="DELIVERED">Entregado</option>
                    <option value="CANCELLED">Cancelado</option>
                    <option value="REFUNDED">Reembolsado</option>
                  </select>
                </div>

                <h6>Productos</h6>
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items?.map(item => (
                        <tr key={item.id}>
                          <td>{item.Product?.name}</td>
                          <td>{item.quantity}</td>
                          <td>${item.price}</td>
                          <td className="fw-bold">${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
