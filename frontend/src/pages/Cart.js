
import { useEffect, useState } from 'react';
import { getCart, updateCartItem, removeCartItem } from '../services/cartService';
import { Link } from 'react-router-dom';

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [err, setErr] = useState('');

  const load = async () => {
    setErr('');
    try {
      const res = await getCart();
      setCart(res.data);
    } catch (e) {
      setErr(e?.response?.data?.message || 'Debes iniciar sesión');
    }
  };

  useEffect(() => { load(); }, []);

  const total = cart?.CartItems?.reduce((sum, i) => sum + i.price * i.quantity, 0) || 0;

  const changeQty = async (itemId, qty) => {
    await updateCartItem(itemId, qty);
    await load();
  };

  const remove = async (itemId) => {
    await removeCartItem(itemId);
    await load();
  };

  if (err) return <div className="container py-4"><div className="alert alert-warning">{err}</div></div>;
  if (!cart) return <div className="container py-4">Cargando...</div>;

  return (
    <div className="container py-4">
      <h3>Mi Carrito</h3>
      {!cart.CartItems?.length ? (
        <div className="alert alert-info mt-3">Carrito vacío</div>
      ) : (
        <div className="card shadow-sm mt-3">
          <div className="card-body">
            {cart.CartItems.map(item => (
              <div key={item.id} className="d-flex justify-content-between align-items-center border-bottom py-2">
                <div>
                  <div className="fw-bold">{item.Product?.name}</div>
                  <small className="text-muted">${item.price} c/u</small>
                </div>
                <div className="d-flex gap-2 align-items-center">
                  <input
                    type="number"
                    min="1"
                    className="form-control form-control-sm"
                    style={{width: 90}}
                    value={item.quantity}
                    onChange={(e)=>changeQty(item.id, Number(e.target.value))}
                  />
                  <button className="btn btn-outline-danger btn-sm" onClick={()=>remove(item.id)}>Eliminar</button>
                </div>
              </div>
            ))}
            <div className="d-flex justify-content-between mt-3">
              <strong>Total</strong>
              <strong className="text-success">${total.toFixed(2)}</strong>
            </div>
            <div className="mt-3 d-flex justify-content-end">
              <Link className="btn btn-dark" to="/checkout">Continuar a pagar</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
