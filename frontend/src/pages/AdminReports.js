import { useState } from 'react';
import { getSalesReport, getInventoryReport } from '../services/adminService';

export default function AdminReports() {
  const [salesData, setSalesData] = useState(null);
  const [inventoryData, setInventoryData] = useState(null);
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const loadSalesReport = async () => {
    setLoading(true);
    setErr('');
    try {
      const res = await getSalesReport(dateRange);
      setSalesData(res.data);
    } catch (e) {
      setErr(e?.response?.data?.message || 'Error cargando reporte');
    } finally {
      setLoading(false);
    }
  };

  const loadInventoryReport = async () => {
    setLoading(true);
    setErr('');
    try {
      const res = await getInventoryReport();
      setInventoryData(res.data);
    } catch (e) {
      setErr(e?.response?.data?.message || 'Error cargando reporte');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Reportes</h2>

      {err && <div className="alert alert-danger">{err}</div>}

      <div className="row g-3">
        {/* Reporte de Ventas */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-header">
              <h5 className="mb-0">Reporte de Ventas</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Fecha inicio</label>
                <input
                  type="date"
                  className="form-control"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Fecha fin</label>
                <input
                  type="date"
                  className="form-control"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                />
              </div>
              <button
                className="btn btn-dark w-100"
                onClick={loadSalesReport}
                disabled={loading}
              >
                {loading ? 'Cargando...' : 'Generar Reporte'}
              </button>

              {salesData && (
                <div className="mt-4">
                  <div className="row g-2">
                    <div className="col-6">
                      <div className="card bg-primary text-white">
                        <div className="card-body text-center">
                          <div className="fs-4">{salesData.totalOrders}</div>
                          <small>Órdenes</small>
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="card bg-success text-white">
                        <div className="card-body text-center">
                          <div className="fs-4">${salesData.totalRevenue}</div>
                          <small>Ingresos</small>
                        </div>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="card bg-info text-white">
                        <div className="card-body text-center">
                          <div className="fs-4">${salesData.avgOrderValue.toFixed(2)}</div>
                          <small>Ticket Promedio</small>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <strong>Ventas por estado:</strong>
                    <ul className="list-group mt-2">
                      {Object.entries(salesData.salesByStatus).map(([status, count]) => (
                        <li key={status} className="list-group-item d-flex justify-content-between">
                          <span>{status}</span>
                          <span className="badge bg-secondary">{count}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reporte de Inventario */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-header">
              <h5 className="mb-0">📦 Reporte de Inventario</h5>
            </div>
            <div className="card-body">
              <button
                className="btn btn-dark w-100"
                onClick={loadInventoryReport}
                disabled={loading}
              >
                {loading ? 'Cargando...' : 'Generar Reporte'}
              </button>

              {inventoryData && (
                <div className="mt-4">
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <div className="card bg-primary text-white">
                        <div className="card-body text-center">
                          <div className="fs-4">{inventoryData.summary.totalProducts}</div>
                          <small>Productos</small>
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="card bg-success text-white">
                        <div className="card-body text-center">
                          <div className="fs-4">{inventoryData.summary.totalStock}</div>
                          <small>Unidades</small>
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="card bg-warning text-dark">
                        <div className="card-body text-center">
                          <div className="fs-4">{inventoryData.summary.lowStock}</div>
                          <small>Stock Bajo</small>
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="card bg-danger text-white">
                        <div className="card-body text-center">
                          <div className="fs-4">{inventoryData.summary.outOfStock}</div>
                          <small>Sin Stock</small>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card bg-light">
                    <div className="card-body text-center">
                      <div className="fs-4 text-success">${inventoryData.summary.totalValue.toFixed(2)}</div>
                      <small>Valor Total Inventario</small>
                    </div>
                  </div>

                  <div className="mt-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    <strong>Productos:</strong>
                    <div className="list-group mt-2">
                      {inventoryData.products.map(p => (
                        <div key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
                          <div>
                            <div className="fw-bold">{p.name}</div>
                            <small className="text-muted">${p.price}</small>
                          </div>
                          <span className={`badge ${p.stock === 0 ? 'bg-danger' : p.stock <= 10 ? 'bg-warning text-dark' : 'bg-success'}`}>
                            {p.stock}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}