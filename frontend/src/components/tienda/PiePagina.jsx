import { Link } from 'react-router-dom';

export default function PiePagina() {
  return (
    <footer className="pie mt-5 py-4">
      <div className="container">
        <div className="row g-3">
          <div className="col-md-5">
            <p className="fw-semibold mb-1">C & D Distribuidora Mayorista</p>
            <p className="small mb-0 texto-suave">Av. Esq. Blanca 501, Maipú · Lunes a sábado de 08:30 a 19:30 hrs · +56 9 1234 5678</p>
          </div>
          <nav className="col-md-4 small" aria-label="Enlaces del pie">
            <Link to="/nosotros" className="me-3">Nosotros</Link>
            <Link to="/contacto" className="me-3">Contacto</Link>
            <Link to="/ofertas">Ofertas</Link>
          </nav>
          <div className="col-md-3 small texto-suave text-md-end">
            Proyecto Comercio · DSY1104 Duoc UC<br />Claudia Leiva y Dayana Seguel
          </div>
        </div>
      </div>
    </footer>
  );
}
