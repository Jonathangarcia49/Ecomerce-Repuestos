export default function Spinner({ text = 'Cargando...' }) {
  return (
    <div className="spinner-wrapper">
      <div className="spinner-border text-primary" role="status" aria-hidden="true" />
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
}
