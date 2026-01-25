
import { useEffect, useState } from 'react';
import { getProducts, createProduct, deleteProduct } from '../services/productService';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: 0, stock: 0, image: '', description: '' });
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const load = async () => {
    const res = await getProducts();
    setProducts(res.data);
  };

  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    setMsg(''); setErr('');
    try {
      await createProduct({ ...form, price: Number(form.price), stock: Number(form.stock) });
      setMsg('✅ Producto creado');
      setForm({ name: '', price: 0, stock: 0, image: '', description: '' });
      await load();
    } catch (e2) {
      setErr(e2?.response?.data?.message || 'Error (¿eres ADMIN?)');
    }
  };

  const del = async (id) => {
    setMsg(''); setErr('');
    try {
      await deleteProduct(id);
      setMsg('✅ Producto eliminado');
      await load();
    } catch (e2) {
      setErr(e2?.response?.data?.message || 'Error (¿eres ADMIN?)');
    }
  };

  return (
    <div className="container py-4">
      <h3>Admin - Productos</h3>
      {msg && <div className="alert alert-success">{msg}</div>}
      {err && <div className="alert alert-danger">{err}</div>}

      <form onSubmit={create} className="card p-3 shadow-sm mb-3">
        <div className="row g-2">
          <div className="col-md-6">
            <label className="form-label">Nombre</label>
            <input className="form-control" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} />
          </div>
          <div className="col-md-3">
            <label className="form-label">Precio</label>
            <input type="number" className="form-control" value={form.price} onChange={(e)=>setForm({...form,price:e.target.value})} />
          </div>
          <div className="col-md-3">
            <label className="form-label">Stock</label>
            <input type="number" className="form-control" value={form.stock} onChange={(e)=>setForm({...form,stock:e.target.value})} />
          </div>
          <div className="col-12">
            <label className="form-label">Imagen (URL)</label>
            <input className="form-control" value={form.image} onChange={(e)=>setForm({...form,image:e.target.value})} />
          </div>
          <div className="col-12">
            <label className="form-label">Descripción</label>
            <textarea className="form-control" rows="2" value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} />
          </div>
        </div>
        <button className="btn btn-dark mt-3">Crear</button>
        <small className="text-muted mt-2 d-block">Solo ADMIN puede crear/editar/eliminar.</small>
      </form>

      <div className="card shadow-sm">
        <div className="card-body">
          {products.map(p => (
            <div key={p.id} className="d-flex justify-content-between align-items-center border-bottom py-2">
              <div>
                <div className="fw-bold">{p.name}</div>
                <small className="text-muted">${p.price} — stock {p.stock}</small>
              </div>
              <button className="btn btn-outline-danger btn-sm" onClick={()=>del(p.id)}>Eliminar</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
