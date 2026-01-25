
import { useEffect, useState } from 'react';
import { getOrders } from '../services/paymentService';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [err, setErr] = useState('');

  useEffect(() => {
    getOrders()
      .then(res => setOrders(res.data))
      .catch(e => setErr(e?.response?.data?.message || 'Debes iniciar sesión'));
  }, []);

  if (err) return <div className="container py-4"><div className="alert alert-warning">{err}</div></div>;

  return (
    <div className="container py-4">
      <h3>Mis Órdenes</h3>
      {!orders.length ? (
        <div className="alert alert-info mt-3">Aún no tienes órdenes</div>
      ) : (
        <div className="list-group mt-3">
          {orders.map(o => (
            <div key={o.id} className="list-group-item d-flex justify-content-between">
              <div>
                <div className="fw-bold">Orden #{o.id}</div>
                <small className="text-muted">{o.paymentMethod} — {o.status}</small>
              </div>
              <div className="fw-bold text-success">${o.total}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
