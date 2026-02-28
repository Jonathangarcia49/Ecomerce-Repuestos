import { useEffect, useState } from 'react';
import { getProducts, createProduct, deleteProduct, updateProduct, toggleProductActive } from '../services/productService';
import { getImageUrl } from '../api/api';
import { useToast } from '../context/ToastContext';
import Spinner from '../components/Spinner';

const EMPTY_FORM = { name: '', price: '', stock: '', description: '', category: '', brand: '', sku: '', image: null };

export default function AdminProducts() {
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [preview, setPreview]   = useState(null);
  const [search, setSearch]     = useState('');

  const load = () => {
    setLoading(true);
    getProducts({ limit: 100 })
      .then((res) => setProducts(res.data.products || res.data))
      .catch(() => toast.error('Error cargando productos'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []); // runs once on mount

  const f = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.warning('El nombre es obligatorio'); return; }
    if (!form.price || isNaN(form.price)) { toast.warning('Precio inválido'); return; }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name.trim());
      fd.append('price', Number(form.price));
      fd.append('stock', Number(form.stock) || 0);
      fd.append('description', form.description);
      fd.append('category', form.category);
      fd.append('brand', form.brand);
      fd.append('sku', form.sku);
      if (form.image instanceof File) fd.append('image', form.image);

      if (editingId) {
        await updateProduct(editingId, fd);
        toast.success('Producto actualizado');
      } else {
        await createProduct(fd);
        toast.success('Producto creado');
      }
      resetForm();
      load();
    } catch (err2) {
      toast.error(err2?.response?.data?.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const del = async (id, name) => {
    if (!window.confirm(`¿Eliminar "${name}"?`)) return;
    try {
      await deleteProduct(id);
      toast.success('Producto eliminado');
      load();
    } catch (err2) {
      toast.error(err2?.response?.data?.message || 'Error al eliminar');
    }
  };

  const toggle = async (id) => {
    try {
      await toggleProductActive(id);
      load();
    } catch (err2) {
      toast.error('Error al cambiar estado');
    }
  };

  const edit = (p) => {
    setForm({ name: p.name, price: p.price, stock: p.stock, description: p.description || '',
      category: p.category || '', brand: p.brand || '', sku: p.sku || '', image: null });
    setEditingId(p.id);
    setPreview(getImageUrl(p.image));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filtered = products.filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase()) ||
    p.brand?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container py-4">
      <div className="admin-page-title">
        <h2>Gestión de Productos</h2>
        <span className="text-muted small">{products.length} producto{products.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Form */}
      <div className="ap-card p-4 mb-4">
        <h6 className="fw-bold mb-3">{editingId ? '✏️ Editar producto' : '➕ Nuevo producto'}</h6>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-medium">Nombre *</label>
              <input className="form-control" value={form.name} onChange={f('name')} required />
            </div>
            <div className="col-md-3">
              <label className="form-label fw-medium">Precio *</label>
              <input type="number" step="0.01" min="0" className="form-control" value={form.price} onChange={f('price')} required />
            </div>
            <div className="col-md-3">
              <label className="form-label fw-medium">Stock</label>
              <input type="number" min="0" className="form-control" value={form.stock} onChange={f('stock')} />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-medium">Categoría</label>
              <input className="form-control" value={form.category} onChange={f('category')} />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-medium">Marca</label>
              <input className="form-control" value={form.brand} onChange={f('brand')} />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-medium">SKU</label>
              <input className="form-control" value={form.sku} onChange={f('sku')} />
            </div>
            <div className="col-12">
              <label className="form-label fw-medium">Descripción</label>
              <textarea className="form-control" rows={2} value={form.description} onChange={f('description')} />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-medium">Imagen</label>
              <input type="file" accept="image/jpeg,image/png,image/webp,image/avif"
                className="form-control" onChange={handleImage} />
            </div>
            {preview && (
              <div className="col-md-2 d-flex align-items-end">
                <img src={preview} alt="preview"
                  style={{ width: 60, height: 60, objectFit: 'contain', border: '1px solid var(--border)', borderRadius: 6 }} />
              </div>
            )}
          </div>
          <div className="d-flex gap-2 mt-3">
            <button className="btn btn-accent fw-semibold" disabled={saving}>
              {saving ? <><span className="spinner-border spinner-border-sm me-2" />{editingId ? 'Guardando...' : 'Creando...'}</> : (editingId ? 'Guardar cambios' : 'Crear producto')}
            </button>
            {editingId && (
              <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>Cancelar</button>
            )}
          </div>
        </form>
      </div>

      {/* Search */}
      <div className="d-flex gap-2 mb-3">
        <input className="form-control" placeholder="Buscar por nombre, categoría o marca..."
          value={search} onChange={(e) => setSearch(e.target.value)} style={{ maxWidth: 360 }} />
        <button className="btn btn-outline-secondary" onClick={load}>↻</button>
      </div>

      {loading ? <Spinner /> : (
        <div className="ap-card p-0 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead style={{ background: 'var(--surface-2)' }}>
                <tr>
                  <th style={{ width: 56 }}>Img</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {!filtered.length ? (
                  <tr><td colSpan={7} className="text-center py-4 text-muted">Sin resultados</td></tr>
                ) : filtered.map((p) => (
                  <tr key={p.id} style={{ opacity: p.active === false ? 0.55 : 1 }}>
                    <td>
                      {getImageUrl(p.image)
                        ? <img src={getImageUrl(p.image)} alt={p.name} style={{ width: 44, height: 44, objectFit: 'contain' }} />
                        : <span style={{ fontSize: '1.4rem' }}>🔧</span>}
                    </td>
                    <td>
                      <div className="fw-semibold small">{p.name}</div>
                      {p.brand && <div className="text-muted" style={{ fontSize: '.72rem' }}>{p.brand}</div>}
                    </td>
                    <td><span className="text-muted small">{p.category || '—'}</span></td>
                    <td className="fw-semibold small">${Number(p.price).toFixed(2)}</td>
                    <td>
                      <span className={`status-chip ${p.stock === 0 ? 'status-CANCELLED' : p.stock <= 5 ? 'status-PROCESSING' : 'status-DELIVERED'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td>
                      <span className={`status-chip ${p.active !== false ? 'status-PAID' : 'status-CANCELLED'}`}>
                        {p.active !== false ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => edit(p)} title="Editar">✏️</button>
                        <button className="btn btn-sm btn-outline-warning" onClick={() => toggle(p.id)} title="Activar/Desactivar">⏸</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => del(p.id, p.name)} title="Eliminar">🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
