import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts, getProductFilters } from '../services/productService';
import { addToCart } from '../services/cartService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getImageUrl } from '../api/api';
import Spinner from '../components/Spinner';

const SORT_OPTIONS = [
  { value: 'createdAt-DESC', label: 'Más recientes' },
  { value: 'price-ASC',      label: 'Precio: menor a mayor' },
  { value: 'price-DESC',     label: 'Precio: mayor a menor' },
  { value: 'name-ASC',       label: 'Nombre A–Z' },
];

export default function Products() {
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [products, setProducts]   = useState([]);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, page: 1 });
  const [loading, setLoading]     = useState(true);
  const [adding, setAdding]       = useState({});

  const [filters, setFilters] = useState({ categories: [], brands: [] });
  const [query, setQuery]     = useState({
    search: '', category: '', brand: '', minPrice: '', maxPrice: '',
    inStock: '', sort: 'createdAt', order: 'DESC', page: 1, limit: 12,
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...query };
      if (!params.search)    delete params.search;
      if (!params.category)  delete params.category;
      if (!params.brand)     delete params.brand;
      if (!params.minPrice)  delete params.minPrice;
      if (!params.maxPrice)  delete params.maxPrice;
      if (!params.inStock)   delete params.inStock;

      const res = await getProducts(params);
      setProducts(res.data.products || []);
      setPagination(res.data.pagination || { total: 0, pages: 1, page: 1 });
    } catch {
      toast.error('Error cargando productos');
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    getProductFilters()
      .then((r) => setFilters(r.data))
      .catch(() => {});
  }, []);

  const set = (key, val) => setQuery((q) => ({ ...q, [key]: val, page: 1 }));

  const handleSort = (val) => {
    const [sort, order] = val.split('-');
    setQuery((q) => ({ ...q, sort, order, page: 1 }));
  };

  const add = async (id) => {
    if (!isAuthenticated) {
      toast.info('Inicia sesión para agregar al carrito');
      navigate('/login');
      return;
    }
    setAdding((a) => ({ ...a, [id]: true }));
    try {
      await addToCart(id, 1);
      toast.success('¡Producto agregado al carrito!');
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Error al agregar');
    } finally {
      setAdding((a) => ({ ...a, [id]: false }));
    }
  };

  const resetFilters = () =>
    setQuery({ search: '', category: '', brand: '', minPrice: '', maxPrice: '', inStock: '', sort: 'createdAt', order: 'DESC', page: 1, limit: 12 });

  return (
    <>
      {/* Hero */}
      <section className="products-hero">
        <div className="container">
          <h1>🔧 Repuestos Automotrices</h1>
          <p>Los mejores repuestos originales y de alta calidad para tu vehículo</p>

          {/* Search bar */}
          <div className="mt-3" style={{ maxWidth: 520 }}>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Buscar repuesto, marca, SKU..."
                value={query.search}
                onChange={(e) => set('search', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && load()}
              />
              <button className="btn btn-accent" onClick={load}>Buscar</button>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-4">
        <div className="row g-4">

          {/* Sidebar filters */}
          <div className="col-lg-3">
            <div className="filters-bar">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0 fw-bold">Filtros</h6>
                <button className="btn btn-link btn-sm p-0 text-muted" onClick={resetFilters}>Limpiar</button>
              </div>

              {/* Category */}
              <div className="mb-3">
                <label className="form-label">Categoría</label>
                <select className="form-select form-select-sm" value={query.category} onChange={(e) => set('category', e.target.value)}>
                  <option value="">Todas</option>
                  {filters.categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Brand */}
              <div className="mb-3">
                <label className="form-label">Marca</label>
                <select className="form-select form-select-sm" value={query.brand} onChange={(e) => set('brand', e.target.value)}>
                  <option value="">Todas</option>
                  {filters.brands.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              {/* Price range */}
              <div className="mb-3">
                <label className="form-label">Precio</label>
                <div className="d-flex gap-2">
                  <input type="number" className="form-control form-control-sm" placeholder="Mín" min="0" value={query.minPrice} onChange={(e) => set('minPrice', e.target.value)} />
                  <input type="number" className="form-control form-control-sm" placeholder="Máx" min="0" value={query.maxPrice} onChange={(e) => set('maxPrice', e.target.value)} />
                </div>
              </div>

              {/* In Stock */}
              <div className="form-check">
                <input
                  className="form-check-input" type="checkbox" id="inStockCheck"
                  checked={query.inStock === 'true'}
                  onChange={(e) => set('inStock', e.target.checked ? 'true' : '')}
                />
                <label className="form-check-label" htmlFor="inStockCheck" style={{ fontSize: '.875rem' }}>
                  Solo disponibles
                </label>
              </div>

              <button className="btn btn-accent w-100 mt-3 btn-sm" onClick={load}>Aplicar filtros</button>
            </div>
          </div>

          {/* Products grid */}
          <div className="col-lg-9">

            {/* Toolbar */}
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <p className="mb-0 text-muted small">
                {loading ? '...' : `${pagination.total} producto${pagination.total !== 1 ? 's' : ''} encontrado${pagination.total !== 1 ? 's' : ''}`}
              </p>
              <select
                className="form-select form-select-sm"
                style={{ width: 210 }}
                value={`${query.sort}-${query.order}`}
                onChange={(e) => handleSort(e.target.value)}
              >
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {loading ? (
              <Spinner text="Cargando productos..." />
            ) : !products.length ? (
              <div className="empty-state">
                <div className="empty-state__icon">🔍</div>
                <div className="empty-state__title">Sin resultados</div>
                <p>Intenta con otros filtros o términos de búsqueda.</p>
                <button className="btn btn-accent mt-2" onClick={resetFilters}>Ver todos los productos</button>
              </div>
            ) : (
              <>
                <div className="row g-3">
                  {products.map((p) => (
                    <div className="col-sm-6 col-xl-4" key={p.id}>
                      <div className="card h-100 product-card">

                        {/* Image */}
                        {getImageUrl(p.image) ? (
                          <div className="product-image-container">
                            <img src={getImageUrl(p.image)} alt={p.name} loading="lazy" />
                          </div>
                        ) : (
                          <div className="product-no-image">🔧</div>
                        )}

                        <div className="card-body d-flex flex-column p-3">
                          {/* Badges */}
                          <div className="mb-2 d-flex gap-1 flex-wrap">
                            {p.category && (
                              <span className="badge bg-light text-dark product-badge">{p.category}</span>
                            )}
                            {p.brand && (
                              <span className="badge bg-light text-secondary product-badge">{p.brand}</span>
                            )}
                            {p.stock === 0 && (
                              <span className="badge bg-danger product-badge">Sin stock</span>
                            )}
                            {p.stock > 0 && p.stock <= 5 && (
                              <span className="badge bg-warning text-dark product-badge">¡Últimas unidades!</span>
                            )}
                          </div>

                          <h6 className="card-title mb-1 fw-semibold" style={{ lineHeight: 1.3 }}>{p.name}</h6>

                          <p className="product-description mb-2">{p.description || '—'}</p>

                          <div className="mt-auto">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <span className="product-price">${p.price.toFixed(2)}</span>
                              <small className="text-muted">Stock: {p.stock}</small>
                            </div>

                            <div className="d-flex gap-2">
                              <Link className="btn btn-sm btn-outline-dark flex-grow-1" to={`/products/${p.id}`}>
                                Ver detalle
                              </Link>
                              <button
                                className="btn btn-sm btn-accent flex-grow-1"
                                onClick={() => add(p.id)}
                                disabled={adding[p.id] || p.stock === 0}
                              >
                                {adding[p.id] ? '...' : p.stock === 0 ? 'Agotado' : '+ Carrito'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <nav className="mt-4 d-flex justify-content-center">
                    <ul className="pagination">
                      <li className={`page-item ${pagination.page <= 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setQuery((q) => ({ ...q, page: q.page - 1 }))}>‹</button>
                      </li>
                      {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                        <li key={p} className={`page-item ${p === pagination.page ? 'active' : ''}`}>
                          <button className="page-link" onClick={() => setQuery((q) => ({ ...q, page: p }))}>{p}</button>
                        </li>
                      ))}
                      <li className={`page-item ${pagination.page >= pagination.pages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setQuery((q) => ({ ...q, page: q.page + 1 }))}>›</button>
                      </li>
                    </ul>
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
