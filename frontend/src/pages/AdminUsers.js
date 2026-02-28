import { useEffect, useState } from 'react';
import { getAllUsers, updateUserRole, deleteUser, getUserDetails } from '../services/adminService';
import { useToast } from '../context/ToastContext';
import Spinner from '../components/Spinner';

const ROLE_STYLE = { ADMIN: 'status-PAID', VENDEDOR: 'status-PROCESSING', CLIENTE: 'status-DELIVERED' };
const fmtDate = (iso) => new Date(iso).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });

export default function AdminUsers() {
  const toast = useToast();
  const [users, setUsers]           = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters]       = useState({ page: 1, limit: 10, role: '', search: '' });
  const [loading, setLoading]       = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const load = () => {
    setLoading(true);
    getAllUsers(filters)
      .then((res) => { setUsers(res.data.users); setPagination(res.data.pagination); })
      .catch((e) => toast.error(e?.response?.data?.message || 'Error cargando usuarios'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [filters]);

  const changeRole = (userId, newRole) => {
    updateUserRole(userId, newRole)
      .then(() => { toast.success('Rol actualizado'); load(); })
      .catch((e) => toast.error(e?.response?.data?.message || 'Error'));
  };

  const removeUser = (userId, name) => {
    if (!window.confirm(`¿Eliminar a "${name}"?`)) return;
    deleteUser(userId)
      .then(() => { toast.success('Usuario eliminado'); load(); })
      .catch((e) => toast.error(e?.response?.data?.message || 'Error'));
  };

  const viewDetails = (userId) => {
    getUserDetails(userId)
      .then((res) => setSelectedUser(res.data))
      .catch((e) => toast.error(e?.response?.data?.message || 'Error'));
  };

  return (
    <div className="container py-4">
      <div className="admin-page-title">
        <h2>👥 Usuarios</h2>
        <span className="text-muted small">{pagination.total} usuarios</span>
      </div>

      {/* Filters */}
      <div className="ap-card p-3 mb-3">
        <div className="row g-2 align-items-end">
          <div className="col-md-5">
            <input type="text" className="form-control" placeholder="Buscar por nombre o email..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })} />
          </div>
          <div className="col-md-3">
            <select className="form-select" value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value, page: 1 })}>
              <option value="">Todos los roles</option>
              <option value="ADMIN">Admin</option>
              <option value="VENDEDOR">Vendedor</option>
              <option value="CLIENTE">Cliente</option>
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
                <th>ID</th><th>Nombre</th><th>Email</th><th>Rol</th><th>Registro</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-4"><span className="spinner-border spinner-border-sm" /></td></tr>
              ) : !users.length ? (
                <tr><td colSpan={6} className="text-center py-4 text-muted">Sin resultados</td></tr>
              ) : users.map((u) => (
                <tr key={u.id}>
                  <td className="text-muted small">{u.id}</td>
                  <td className="fw-semibold small">{u.name}</td>
                  <td className="text-muted small">{u.email}</td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      style={{ minWidth: 110 }}
                      value={u.role}
                      onChange={(e) => changeRole(u.id, e.target.value)}
                    >
                      <option value="CLIENTE">CLIENTE</option>
                      <option value="VENDEDOR">VENDEDOR</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  <td className="text-muted small">{fmtDate(u.createdAt)}</td>
                  <td>
                    <div className="d-flex gap-1">
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => viewDetails(u.id)}>🔍</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => removeUser(u.id, u.name)}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pagination.pages > 1 && (
          <div className="d-flex justify-content-between align-items-center px-3 py-2"
               style={{ borderTop: '1px solid var(--border)', background: 'var(--surface-2)' }}>
            <small className="text-muted">{users.length} de {pagination.total}</small>
            <div className="d-flex gap-1">
              <button className="btn btn-sm btn-outline-secondary"
                disabled={pagination.page <= 1}
                onClick={() => setFilters({ ...filters, page: pagination.page - 1 })}>‹</button>
              <span className="btn btn-sm btn-outline-secondary disabled">
                {pagination.page} / {pagination.pages}
              </span>
              <button className="btn btn-sm btn-outline-secondary"
                disabled={pagination.page >= pagination.pages}
                onClick={() => setFilters({ ...filters, page: pagination.page + 1 })}>›</button>
            </div>
          </div>
        )}
      </div>

      {/* User detail modal */}
      {selectedUser && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,.45)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: '1rem', border: 'none' }}>
              <div className="modal-header">
                <h5 className="modal-title fw-bold">👤 {selectedUser.user.name}</h5>
                <button className="btn-close" onClick={() => setSelectedUser(null)} />
              </div>
              <div className="modal-body">
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <div className="text-muted small">Email</div>
                    <div className="fw-medium">{selectedUser.user.email}</div>
                  </div>
                  <div className="col-md-3">
                    <div className="text-muted small">Rol</div>
                    <span className={`status-chip ${ROLE_STYLE[selectedUser.user.role] || ''}`}>
                      {selectedUser.user.role}
                    </span>
                  </div>
                  <div className="col-md-3">
                    <div className="text-muted small">Registro</div>
                    <div className="fw-medium">{fmtDate(selectedUser.user.createdAt)}</div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-muted small">Total órdenes</div>
                    <div className="fw-bold fs-5">{selectedUser.orderStats.totalOrders}</div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-muted small">Total gastado</div>
                    <div className="fw-bold fs-5 text-success">${Number(selectedUser.orderStats.totalSpent).toFixed(2)}</div>
                  </div>
                </div>

                {selectedUser.user.Orders?.length > 0 && (
                  <>
                    <h6 className="fw-bold mb-2">Últimas órdenes</h6>
                    <div className="d-flex flex-column gap-2">
                      {selectedUser.user.Orders.map((o) => (
                        <div key={o.id} className="d-flex justify-content-between align-items-center p-2 rounded-3"
                             style={{ background: 'var(--surface-2)' }}>
                          <div>
                            <div className="fw-semibold small">Orden #{o.id}</div>
                            <small className="text-muted">{o.paymentMethod} · {fmtDate(o.createdAt)}</small>
                          </div>
                          <span className="fw-bold text-success">${Number(o.total).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setSelectedUser(null)}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
