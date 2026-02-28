import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct } from '../services/productService';
import { addToCart } from '../services/cartService';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../api/api';
import Spinner from '../components/Spinner';

export default function ProductDetail() {
  const { id } = useParams();
  const toast = useToast();
  const { isAuthenticated } = useAuth();

  const [p, setP]           = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty]       = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    setLoading(true);
    getProduct(id)
      .then((res) => setP(res.data))
      .catch(() => toast.error('Producto no encontrado'))
      .finally(() => setLoading(false));
  }, [id]);

  const add = async () => {
    if (!isAuthenticated) { toast.warning('Inicia sesión para agregar al carrito'); return; }
    setAdding(true);
    try {
      await addToCart(p.id, qty);
      toast.success(`"${p.name}" agregado al carrito`);
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Error al agregar');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <Spinner />;

  if (!p) {
    return (
      <div className="container py-5">
        <div className="empty-state">
          <div className="empty-state__icon">🔍</div>
          <div className="empty-state__title">Producto no encontrado</div>
          <Link to="/" className="btn btn-accent mt-2">Ver catálogo</Link>
        </div>
      </div>
    );
  }

  const imgUrl = getImageUrl(p.image);
  const inStock = p.stock > 0;

  return (
    <div className="container py-4" style={{ maxWidth: 960 }}>
      {/* Breadcrumb */}
      <nav className="mb-3" aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Inicio</Link></li>
          {p.category && <li className="breadcrumb-item text-muted">{p.category}</li>}
          <li className="breadcrumb-item active text-truncate" style={{ maxWidth: 200 }}>{p.name}</li>
        </ol>
      </nav>

      <div className="ap-card p-0 overflow-hidden">
        <div className="row g-0">
          {/* Image */}
          <div className="col-md-5 d-flex align-items-center justify-content-center p-4"
               style={{ background: 'var(--surface-2)', minHeight: 340 }}>
            {imgUrl ? (
              <img
                src={imgUrl}
                alt={p.name}
                className="img-fluid"
                style={{ maxHeight: 320, objectFit: 'contain' }}
              />
            ) : (
              <div style={{ fontSize: '5rem' }}>🔧</div>
            )}
          </div>

          {/* Info */}
          <div className="col-md-7 p-4 d-flex flex-column">
            <div className="d-flex align-items-start gap-2 mb-2 flex-wrap">
              {p.category && (
                <span className="badge rounded-pill"
                      style={{ background: 'var(--accent)', color: '#000', fontSize: '.7rem' }}>
                  {p.category}
                </span>
              )}
              {p.brand && (
                <span className="badge rounded-pill bg-secondary"
                      style={{ fontSize: '.7rem' }}>
                  {p.brand}
                </span>
              )}
              {p.sku && (
                <span className="text-muted" style={{ fontSize: '.75rem' }}>SKU: {p.sku}</span>
              )}
            </div>

            <h2 className="fw-bold mb-1">{p.name}</h2>

            {p.description && (
              <p className="text-muted mb-3" style={{ lineHeight: 1.6 }}>{p.description}</p>
            )}

            <div className="mb-3">
              <span className="fs-2 fw-bold text-success">${Number(p.price).toFixed(2)}</span>
            </div>

            {/* Stock indicator */}
            <div className="mb-3">
              {inStock ? (
                <span className="text-success small fw-semibold">
                  ✅ En stock — {p.stock <= 5 ? `¡Últimas ${p.stock} unidades!` : `${p.stock} disponibles`}
                </span>
              ) : (
                <span className="text-danger small fw-semibold">❌ Sin stock</span>
              )}
            </div>

            {/* Qty + add */}
            {inStock && (
              <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">
                <div className="d-flex align-items-center border rounded-3 overflow-hidden"
                     style={{ width: 120 }}>
                  <button
                    className="btn btn-sm border-0 px-3 py-2"
                    style={{ background: 'var(--surface-2)' }}
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={qty <= 1}
                  >−</button>
                  <span className="flex-grow-1 text-center fw-semibold">{qty}</span>
                  <button
                    className="btn btn-sm border-0 px-3 py-2"
                    style={{ background: 'var(--surface-2)' }}
                    onClick={() => setQty((q) => Math.min(p.stock, q + 1))}
                    disabled={qty >= p.stock}
                  >+</button>
                </div>

                <button
                  className="btn btn-accent flex-grow-1 fw-semibold"
                  onClick={add}
                  disabled={adding}
                  style={{ maxWidth: 240 }}
                >
                  {adding
                    ? <><span className="spinner-border spinner-border-sm me-2" />Agregando...</>
                    : '🛒 Agregar al carrito'}
                </button>
              </div>
            )}

            {/* Trust badges */}
            <div className="d-flex gap-3 mt-auto pt-3 border-top flex-wrap">
              <span className="small text-muted">🚚 Envío gratis</span>
              <span className="small text-muted">🔒 Compra segura</span>
              <span className="small text-muted">↩️ Devolución 30 días</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
