import { useState } from 'react';
import { getSalesReport, getInventoryReport } from '../services/adminService';
import { useToast } from '../context/ToastContext';

const today = () => new Date().toISOString().slice(0, 10);
const monthStart = () => {
  const d = new Date(); d.setDate(1);
  return d.toISOString().slice(0, 10);
};

export default function AdminReports() {
  const toast = useToast();
  const [salesData, setSalesData]         = useState(null);
  const [inventoryData, setInventoryData] = useState(null);
  const [dateRange, setDateRange]         = useState({ startDate: monthStart(), endDate: today() });
  const [loadingSales, setLoadingSales]   = useState(false);
  const [loadingInv, setLoadingInv]       = useState(false);

  const loadSales = () => {
    if (!dateRange.startDate || !dateRange.endDate) { toast.warning('Selecciona rango de fechas'); return; }
    setLoadingSales(true);
    getSalesReport(dateRange)
      .then((res) => setSalesData(res.data))
      .catch((e) => toast.error(e?.response?.data?.message || 'Error'))
      .finally(() => setLoadingSales(false));
  };

  const loadInventory = () => {
    setLoadingInv(true);
    getInventoryReport()
      .then((res) => setInventoryData(res.data))
      .catch((e) => toast.error(e?.response?.data?.message || 'Error'))
      .finally(() => setLoadingInv(false));
  };

  return (
    <div className="container py-4">
      <div className="admin-page-title mb-4">
        <h2>📊 Reportes</h2>
      </div>

      <div className="row g-4">
        {/* Sales report */}
        <div className="col-md-6">
          <div className="ap-card p-0 overflow-hidden h-100 d-flex flex-column">
            <div className="px-3 py-2 fw-semibold" style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
              💰 Reporte de Ventas
            </div>
            <div className="p-3 flex-grow-1">
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-medium">Desde</label>
                  <input type="date" className="form-control form-control-sm"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })} />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-medium">Hasta</label>
                  <input type="date" className="form-control form-control-sm"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })} />
                </div>
              </div>
              <button className="btn btn-accent w-100 mb-4" onClick={loadSales} disabled={loadingSales}>
                {loadingSales ? <><span className="spinner-border spinner-border-sm me-2" />Generando...</> : 'Generar reporte'}
              </button>

              {salesData && (
                <div>
                  <div className="row g-2 mb-3">
                    {[
                      { icon: '🛒', label: 'Órdenes',     value: salesData.totalOrders,                  bg: '#6366f1' },
                      { icon: '💰', label: 'Ingresos',    value: `$${Number(salesData.totalRevenue).toFixed(2)}`, bg: '#10b981' },
                      { icon: '🎯', label: 'Ticket prom.', value: `$${Number(salesData.avgOrderValue).toFixed(2)}`, bg: '#f59e0b' },
                    ].map((c) => (
                      <div className="col-4" key={c.label}>
                        <div className="p-2 rounded-3 text-center" style={{ background: c.bg + '18', border: `1px solid ${c.bg}44` }}>
                          <div style={{ fontSize: '1.2rem' }}>{c.icon}</div>
                          <div className="fw-bold small">{c.value}</div>
                          <div className="text-muted" style={{ fontSize: '.7rem' }}>{c.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {salesData.salesByStatus && Object.keys(salesData.salesByStatus).length > 0 && (
                    <>
                      <div className="fw-semibold small mb-2">Ventas por estado</div>
                      <div className="d-flex flex-column gap-1">
                        {Object.entries(salesData.salesByStatus).map(([status, count]) => (
                          <div key={status} className="d-flex justify-content-between align-items-center px-2 py-1 rounded-2"
                               style={{ background: 'var(--surface-2)' }}>
                            <span className="small">{status}</span>
                            <span className="fw-bold small">{count}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {salesData.topProducts?.length > 0 && (
                    <div className="mt-3">
                      <div className="fw-semibold small mb-2">Top productos</div>
                      <div className="d-flex flex-column gap-1">
                        {salesData.topProducts.slice(0, 5).map((p, i) => (
                          <div key={i} className="d-flex justify-content-between align-items-center px-2 py-1 rounded-2"
                               style={{ background: 'var(--surface-2)' }}>
                            <span className="small">{p.name || p.productId}</span>
                            <span className="fw-semibold small text-success">{p.sold || p.totalSold} uds.</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Inventory report */}
        <div className="col-md-6">
          <div className="ap-card p-0 overflow-hidden h-100 d-flex flex-column">
            <div className="px-3 py-2 fw-semibold" style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
              📦 Inventario
            </div>
            <div className="p-3 flex-grow-1">
              <button className="btn btn-accent w-100 mb-4" onClick={loadInventory} disabled={loadingInv}>
                {loadingInv ? <><span className="spinner-border spinner-border-sm me-2" />Cargando...</> : 'Ver inventario'}
              </button>

              {inventoryData && (
                <div>
                  <div className="row g-2 mb-3">
                    {[
                      { icon: '📦', label: 'Productos',   value: inventoryData.summary.totalProducts, bg: '#6366f1' },
                      { icon: '📋', label: 'Unidades',    value: inventoryData.summary.totalStock,    bg: '#0ea5e9' },
                      { icon: '⚠️', label: 'Stock bajo',  value: inventoryData.summary.lowStock,      bg: '#f59e0b' },
                      { icon: '❌', label: 'Sin stock',   value: inventoryData.summary.outOfStock,    bg: '#ef4444' },
                    ].map((c) => (
                      <div className="col-6" key={c.label}>
                        <div className="p-2 rounded-3 text-center" style={{ background: c.bg + '18', border: `1px solid ${c.bg}44` }}>
                          <div style={{ fontSize: '1.2rem' }}>{c.icon}</div>
                          <div className="fw-bold">{c.value}</div>
                          <div className="text-muted" style={{ fontSize: '.7rem' }}>{c.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 rounded-3 text-center mb-3" style={{ background: '#10b98118', border: '1px solid #10b98144' }}>
                    <div className="fw-bold text-success fs-5">${Number(inventoryData.summary.totalValue).toFixed(2)}</div>
                    <div className="text-muted small">Valor total del inventario</div>
                  </div>

                  <div className="fw-semibold small mb-2">Productos críticos</div>
                  <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                    <div className="d-flex flex-column gap-1">
                      {inventoryData.products
                        .filter((p) => p.stock <= 10)
                        .sort((a, b) => a.stock - b.stock)
                        .map((p) => (
                          <div key={p.id} className="d-flex justify-content-between align-items-center px-2 py-1 rounded-2"
                               style={{ background: 'var(--surface-2)' }}>
                            <div>
                              <div className="small fw-medium">{p.name}</div>
                              <div className="text-muted" style={{ fontSize: '.7rem' }}>${Number(p.price).toFixed(2)}</div>
                            </div>
                            <span className={`status-chip ${p.stock === 0 ? 'status-CANCELLED' : 'status-PROCESSING'}`}>
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

