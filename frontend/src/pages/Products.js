import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/productService';
import { addToCart } from '../services/cartService';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [msg, setMsg] = useState('');

  const load = async () => {
    const res = await getProducts();
    setProducts(res.data);
  };

  useEffect(() => { 
    load(); 
  }, []);

  const add = async (id) => {
    setMsg('');
    try {
      await addToCart(id, 1);
      setMsg('✅ Agregado al carrito');
    } catch (e) {
      setMsg(e?.response?.data?.message || 'Debes iniciar sesión para usar el carrito');
    }
  };

  return (
    <div className="container py-4">
      <h3 className="mb-4">Repuestos</h3>

      {msg && <div className="alert alert-info">{msg}</div>}

      <div className="row g-4">
        {products.map((p) => (
          <div className="col-12 col-md-6 col-lg-4" key={p.id}>
            <div className="card h-100 shadow-sm product-card">

              {p.image && (
                <div className="product-image-container">
                  <img
                    src={`http://localhost:4000/uploads/${p.image}`}
                    alt={p.name}
                  />
                </div>
              )}

              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{p.name}</h5>

                <p className="card-text text-muted product-description">
                  {p.description || '—'}
                </p>

                <div className="d-flex justify-content-between align-items-center mt-auto">
                  <strong className="text-success fs-5">
                    ${p.price}
                  </strong>

                  <div className="d-flex gap-2">
                    <Link
                      className="btn btn-outline-dark btn-sm"
                      to={`/products/${p.id}`}
                    >
                      Detalle
                    </Link>

                    <button
                      className="btn btn-dark btn-sm"
                      onClick={() => add(p.id)}
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}