import { useEffect, useState } from 'react';
import { getDashboardStats } from '../services/adminService';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const load = async () => {
    setLoading(true);
    setErr('');
    try {
      const res = await getDashboardStats();
      setData(res.data);
    } catch (e) {
      setErr(e?.response?.data?.message || 'Error cargando dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <div className="container py-4">Cargando...</div>;
  if (err) return <div className="container py-4"><div className="alert alert-danger">{err}</div></div>;
  if (!data) return null;

  const { stats, recentOrders, lowStockProducts } = data;

  return (
    <div className="container py-4">
      <h2 className="mb-4">Dashboard Administrativo</h2>

      {/* Estadísticas principales */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <div className="display-6 text-primary">{stats.totalUsers}</div>
              <div className="text-muted">Usuarios</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <div className="display-6 text-success">{stats.totalProducts}</div>
              <div className="text-muted">Productos</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <div className="display-6 text-warning">{stats.totalOrders}</div>
              <div className="text-muted">Órdenes</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <div className="display-6 text-info">${stats.totalRevenue.toFixed(2)}</div>
              <div className="text-muted">Ingresos</div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        {/* Órdenes recientes */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">🛒 Órdenes Recientes</h5>
              <Link to="/admin/orders" className="btn btn-sm btn-outline-dark">Ver todas</Link>
            </div>
            <div className="card-body">
              {!recentOrders?.length ? (
                <div className="text-muted text-center py-3">No hay órdenes</div>
              ) : (
                <div className="list-group list-group-flush">
                  {recentOrders.map(o => (
                    <div key={o.id} className="list-group-item px-0 d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-bold">Orden #{o.id}</div>
                        <small className="text-muted">{o.User?.name || 'Usuario'} • {o.status}</small>
                      </div>
                      <span className="badge bg-success">${o.total}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stock bajo */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Stock Bajo</h5>
              <Link to="/admin/products" className="btn btn-sm btn-outline-dark">Ver productos</Link>
            </div>
            <div className="card-body">
              {!lowStockProducts?.length ? (
                <div className="text-muted text-center py-3">Todo con stock suficiente</div>
              ) : (
                <div className="list-group list-group-flush">
                  {lowStockProducts.map(p => (
                    <div key={p.id} className="list-group-item px-0 d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-bold">{p.name}</div>
                        <small className="text-muted">${p.price}</small>
                      </div>
                      <span className={`badge ${p.stock === 0 ? 'bg-danger' : 'bg-warning text-dark'}`}>
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

      {/* Carrito activos */}
      <div className="alert alert-info mt-3">
        🛍️ Hay <strong>{stats.activeCartsCount}</strong> carrito(s) activo(s) en este momento
      </div>
    </div>
  );
}