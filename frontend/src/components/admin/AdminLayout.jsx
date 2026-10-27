import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useSesion } from '../../context/SesionContext.jsx';

const SECCIONES = [
  { ruta: '/admin', texto: 'Dashboard', exacta: true },
  { ruta: '/admin/ordenes', texto: 'Órdenes' },
  { ruta: '/admin/productos', texto: 'Productos' },
  { ruta: '/admin/categorias', texto: 'Categorías' },
  { ruta: '/admin/usuarios', texto: 'Usuarios' },
  { ruta: '/admin/reportes', texto: 'Reportes' },
  { ruta: '/admin/perfil', texto: 'Perfil' },
];

/** Estructura del panel: barra lateral (se oculta en móvil) y contenido de cada sección. */
export default function AdminLayout() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { usuario, salir } = useSesion();
  const navegar = useNavigate();

  return (
    <div className="admin min-vh-100">
      <header className="navbar admin-barra px-3">
        <span className="navbar-brand text-white fw-semibold">C & D · Administración</span>
        <button type="button" className="btn btn-sm btn-outline-light d-md-none" aria-expanded={menuAbierto}
          aria-controls="admin-menu" onClick={() => setMenuAbierto((v) => !v)}>Menú</button>
      </header>
      <div className="container-fluid">
        <div className="row">
          <aside id="admin-menu" className={`col-md-3 col-lg-2 admin-lateral py-3 ${menuAbierto ? 'd-block' : 'd-none'} d-md-block`}>
            <nav className="nav nav-pills flex-column" aria-label="Secciones del panel">
              {SECCIONES.map((s) => (
                <NavLink key={s.ruta} to={s.ruta} end={s.exacta} onClick={() => setMenuAbierto(false)}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>{s.texto}</NavLink>
              ))}
            </nav>
            <hr />
            <p className="small text-secondary px-3 mb-2">Conectado como {usuario?.nombre}</p>
            <div className="d-grid gap-2 px-2">
              <Link to="/" className="btn btn-dark btn-sm">Ir a la tienda</Link>
              <button type="button" className="btn btn-danger btn-sm" onClick={() => { salir(); navegar('/'); }}>Cerrar sesión</button>
            </div>
          </aside>
          <main className="col-md-9 col-lg-10 px-md-4 py-4">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
