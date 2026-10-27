'use client';

import Link from 'next/link';

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
            <Link href="/nosotros" className="me-3">Nosotros</Link>
            <Link href="/contacto" className="me-3">Contacto</Link>
            <Link href="/ofertas">Ofertas</Link>
          </nav>
          <div className="col-md-3 small texto-suave text-md-end">
            Proyecto Comercio · DSY1104 Duoc UC<br />Claudia Leiva y Dayana Seguel
          </div>
        </div>
      </div>
    </footer>
  );
}
