
import { useState } from 'react';
import { checkout } from '../services/paymentService';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const nav = useNavigate();
  const [method, setMethod] = useState('TARJETA');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const pay = async () => {
    setMsg(''); setErr('');
    try {
      const res = await checkout(method);
      setMsg(`✅ Pago simulado OK. Orden #${res.data.id} Total $${res.data.total}`);
      setTimeout(()=>nav('/orders'), 600);
    } catch (e) {
      setErr(e?.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="container py-4" style={{maxWidth: 640}}>
      <h3>Checkout</h3>
      {msg && <div className="alert alert-success">{msg}</div>}
      {err && <div className="alert alert-danger">{err}</div>}
      <div className="card p-3 shadow-sm">
        <label className="form-label">Método de pago</label>
        <select className="form-select" value={method} onChange={(e)=>setMethod(e.target.value)}>
          <option value="TARJETA">Tarjeta</option>
          <option value="TRANSFERENCIA">Transferencia</option>
          <option value="CONTRA_ENTREGA">Contra entrega</option>
        </select>
        <button className="btn btn-dark mt-3" onClick={pay}>Pagar (simulado)</button>
      </div>
    </div>
  );
}
