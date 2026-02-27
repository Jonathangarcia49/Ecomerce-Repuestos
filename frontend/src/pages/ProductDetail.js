import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct } from '../services/productService';
import { addToCart } from '../services/cartService';

export default function ProductDetail() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    getProduct(id).then(res => setP(res.data));
  }, [id]);

  if (!p) return <div className="container py-4">Cargando...</div>;

  const add = async () => {
    setMsg('');
    try {
      await addToCart(p.id, 1);
      setMsg('✅ Agregado al carrito');
    } catch (e) {
      setMsg(e?.response?.data?.message || 'Debes iniciar sesión');
    }
  };

  return (
    <div className="container py-4">
      {msg && <div className="alert alert-info">{msg}</div>}

      <div className="card shadow-sm p-3">
        <div className="row g-3">

          <div className="col-md-5 d-flex align-items-center justify-content-center" style={{ background: '#f8f9fa' }}>
            {p.image && (
              <img
                src={`http://localhost:4000/uploads/${p.image}`}
                alt={p.name}
                className="img-fluid"
                style={{ maxHeight: '400px', objectFit: 'contain' }}
              />
            )}
          </div>

          <div className="col-md-7">
            <h3>{p.name}</h3>
            <p className="text-muted">{p.description || '—'}</p>
            <h4 className="text-success">${p.price}</h4>
            <button className="btn btn-dark" onClick={add}>
              Agregar al carrito
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}