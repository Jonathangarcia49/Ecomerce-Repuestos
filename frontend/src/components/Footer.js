import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer mt-auto">
      <div className="container">
        <div className="row gy-4">

          <div className="col-md-4">
            <h5 className="footer-brand">🔧 AutoParts</h5>
            <p className="footer-text">
              Repuestos automotrices originales y de alta calidad.
              Entrega rápida, garantía y soporte especializado.
            </p>
          </div>

          <div className="col-md-2">
            <h6 className="footer-heading">Tienda</h6>
            <ul className="footer-links">
              <li><Link to="/">Productos</Link></li>
              <li><Link to="/cart">Carrito</Link></li>
              <li><Link to="/orders">Mis órdenes</Link></li>
            </ul>
          </div>

          <div className="col-md-2">
            <h6 className="footer-heading">Cuenta</h6>
            <ul className="footer-links">
              <li><Link to="/login">Iniciar sesión</Link></li>
              <li><Link to="/register">Registro</Link></li>
            </ul>
          </div>

          <div className="col-md-4">
            <h6 className="footer-heading">Contacto</h6>
            <ul className="footer-links">
              <li>✉️ soporte@autoparts.com</li>
              <li>📞 +1 (555) 123-4567</li>
              <li>📍 123 Auto St, Ciudad, País</li>
            </ul>
          </div>

        </div>

        <hr className="footer-divider" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center footer-bottom">
          <span>© {year} AutoParts. Todos los derechos reservados.</span>
          <span className="footer-badges">
            <span className="badge footer-badge">🔒 Pagos seguros</span>
            <span className="badge footer-badge">🚚 Envío rápido</span>
            <span className="badge footer-badge">✅ Garantía</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
