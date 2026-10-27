import { Link } from 'react-router-dom';

export default function NoEncontrado() {
  return (
    <div className="text-center py-5">
      <h1 className="h3">Esta página no existe</h1>
      <p className="texto-suave">Revisa la dirección o vuelve al inicio.</p>
      <Link to="/" className="btn btn-light">Ir al inicio</Link>
    </div>
  );
}
