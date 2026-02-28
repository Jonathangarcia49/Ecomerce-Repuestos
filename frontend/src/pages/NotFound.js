import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="empty-state" style={{ paddingTop: '8rem' }}>
      <div className="empty-state__icon">🔍</div>
      <div className="empty-state__title">Página no encontrada</div>
      <p className="text-muted">La URL que buscas no existe o fue eliminada.</p>
      <Link to="/" className="btn btn-accent mt-2">Ir al inicio</Link>
    </div>
  );
}
