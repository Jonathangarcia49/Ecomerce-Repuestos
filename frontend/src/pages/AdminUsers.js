import { useEffect, useState } from 'react';
import { getAllUsers, updateUserRole, deleteUser, getUserDetails } from '../services/adminService';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({ page: 1, limit: 10, role: '', search: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const load = async () => {
    setLoading(true);
    setErr('');
    try {
      const res = await getAllUsers(filters);
      setUsers(res.data.users);
      setPagination(res.data.pagination);
    } catch (e) {
      setErr(e?.response?.data?.message || 'Error cargando usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filters]);

  const changeRole = async (userId, newRole) => {
    setMsg(''); setErr('');
    try {
      await updateUserRole(userId, newRole);
      setMsg('✅ Rol actualizado');
      await load();
    } catch (e) {
      setErr(e?.response?.data?.message || 'Error');
    }
  };

  const removeUser = async (userId) => {
    if (!window.confirm('¿Eliminar usuario?')) return;
    setMsg(''); setErr('');
    try {
      await deleteUser(userId);
      setMsg('✅ Usuario eliminado');
      await load();
    } catch (e) {
      setErr(e?.response?.data?.message || 'Error');
    }
  };

  const viewDetails = async (userId) => {
    try {
      const res = await getUserDetails(userId);
      setSelectedUser(res.data);
    } catch (e) {
      setErr(e?.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">👥 Gestión de Usuarios</h2>

      {msg && <div className="alert alert-success">{msg}</div>}
      {err && <div className="alert alert-danger">{err}</div>}

      {/* Filtros */}
      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <div className="row g-2">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por nombre o email..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              />
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={filters.role}
                onChange={(e) => setFilters({ ...filters, role: e.target.value, page: 1 })}
              >
                <option value="">Todos los roles</option>
                <option value="ADMIN">Admin</option>
                <option value="CLIENTE">Cliente</option>
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

      {/* Tabla de usuarios */}
      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Fecha registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-4">Cargando...</td></tr>
              ) : !users.length ? (
                <tr><td colSpan="6" className="text-center py-4 text-muted">No hay usuarios</td></tr>
              ) : (
                users.map(u => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <select
                        className={`form-select form-select-sm ${u.role === 'ADMIN' ? 'bg-warning' : 'bg-light'}`}
                        value={u.role}
                        onChange={(e) => changeRole(u.id, e.target.value)}
                      >
                        <option value="CLIENTE">CLIENTE</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-primary" onClick={() => viewDetails(u.id)}>
                          Ver
                        </button>
                        <button className="btn btn-outline-danger" onClick={() => removeUser(u.id)}>
                          Eliminar
                        </button>
                      </div>
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
              Mostrando {users.length} de {pagination.total} usuarios
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
      {selectedUser && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Detalles de {selectedUser.user.name}</h5>
                <button className="btn-close" onClick={() => setSelectedUser(null)}></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <strong>Email:</strong> {selectedUser.user.email}
                  </div>
                  <div className="col-md-6">
                    <strong>Rol:</strong> {selectedUser.user.role}
                  </div>
                  <div className="col-md-6">
                    <strong>Total órdenes:</strong> {selectedUser.orderStats.totalOrders}
                  </div>
                  <div className="col-md-6">
                    <strong>Total gastado:</strong> ${selectedUser.orderStats.totalSpent.toFixed(2)}
                  </div>
                </div>

                <h6 className="mt-4">Últimas órdenes</h6>
                <div className="list-group">
                  {selectedUser.user.Orders?.map(o => (
                    <div key={o.id} className="list-group-item d-flex justify-content-between">
                      <div>
                        <div className="fw-bold">Orden #{o.id}</div>
                        <small className="text-muted">{o.paymentMethod} • {o.status}</small>
                      </div>
                      <span className="badge bg-success">${o.total}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}