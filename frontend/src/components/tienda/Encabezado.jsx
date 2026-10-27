import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSesion } from '../../context/SesionContext.jsx';
import { useCarrito } from '../../context/CarritoContext.jsx';
import { useDatos } from '../../hooks/useDatos.js';
import { categoriasDB } from '../../data/db.js';
import { clp } from '../../utils/formato.js';

/** Barra de navegación con Categorías y Ofertas dentro del menú Productos. */
export default function Encabezado() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [productosAbiertos, setProductosAbiertos] = useState(false);
  const [categoriasAbiertas, setCategoriasAbiertas] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const navegar = useNavigate();
  const { usuario, esAdmin, salir } = useSesion();
  const { total, unidades } = useCarrito();
  const categorias = useDatos(() => categoriasDB.listar());

  const cerrarMenus = () => {
    setMenuAbierto(false);
    setProductosAbiertos(false);
    setCategoriasAbiertas(false);
  };

  const enlace = ({ isActive }) => `nav-link px-2${isActive ? ' active' : ''}`;

  function buscar(e) {
    e.preventDefault();
    navegar(`/productos?q=${encodeURIComponent(busqueda.trim())}`);
    cerrarMenus();
  }

  return (
    <header className="sticky-top encabezado shadow-sm">
      <nav className="navbar navbar-expand-lg navbar-dark py-2" aria-label="Navegación principal">
        <div className="container-fluid px-4">
          <Link to="/" className="navbar-brand marca fs-5 me-3" onClick={cerrarMenus}>C & D Distribuidora</Link>
          <button className="navbar-toggler" type="button" aria-controls="menu-principal"
            aria-expanded={menuAbierto} aria-label="Abrir menú" onClick={() => setMenuAbierto((v) => !v)}>
            <span className="navbar-toggler-icon" />
          </button>

          <div id="menu-principal" className={`collapse navbar-collapse ${menuAbierto ? 'show' : ''}`}>
            {/* Menú de navegación central */}
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 align-lg-items-center">
              <li className="nav-item">
                <NavLink to="/" end className={enlace} onClick={cerrarMenus}>Inicio</NavLink>
              </li>

              {/* Menú desplegable de Productos (solo Ofertas y Categorías) */}
              <li className="nav-item dropdown">
                <button
                  type="button"
                  className="nav-link dropdown-toggle btn btn-link px-2 text-decoration-none"
                  aria-expanded={productosAbiertos}
                  onClick={() => {
                    setProductosAbiertos((v) => {
                      if (v) setCategoriasAbiertas(false);
                      return !v;
                    });
                  }}
                >
                  Productos
                </button>

                <ul className={`dropdown-menu ${productosAbiertos ? 'show' : ''}`} style={{ minWidth: '220px' }}>
                  <li>
                    <Link className="dropdown-item" to="/ofertas" onClick={cerrarMenus}>
                      Ofertas
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>

                  {/* Opción Categorías dentro de Productos que despliega la lista */}
                  <li>
                    <button
                      type="button"
                      className="dropdown-item d-flex justify-content-between align-items-center fw-semibold"
                      aria-expanded={categoriasAbiertas}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCategoriasAbiertas((v) => !v);
                      }}
                    >
                      <span>Categorías</span>
                      <span className="ms-2 small">{categoriasAbiertas ? '▴' : '▾'}</span>
                    </button>

                    {categoriasAbiertas && (
                      <ul className="list-unstyled ps-3 mb-0 border-start ms-3 my-1">
                        <li>
                          <Link className="dropdown-item py-1 fw-medium" to="/categorias" onClick={cerrarMenus}>
                            Ver todas
                          </Link>
                        </li>
                        <li><hr className="dropdown-divider my-1" /></li>
                        {categorias.map((c) => (
                          <li key={c.id}>
                            <Link className="dropdown-item py-1" to={`/categorias/${c.slug}`} onClick={cerrarMenus}>
                              {c.nombre}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                </ul>
              </li>

              <li className="nav-item"><NavLink to="/nosotros" className={enlace} onClick={cerrarMenus}>Nosotros</NavLink></li>
              <li className="nav-item"><NavLink to="/blogs" className={enlace} onClick={cerrarMenus}>Blog</NavLink></li>
              <li className="nav-item"><NavLink to="/contacto" className={enlace} onClick={cerrarMenus}>Contacto</NavLink></li>
            </ul>

            {/* Buscador y botones de la derecha */}
            <div className="d-flex align-items-center flex-wrap flex-lg-nowrap gap-2 mt-2 mt-lg-0">
              <form className="d-flex" role="search" onSubmit={buscar}>
                <input className="form-control form-control-sm me-1" type="search" placeholder="Buscar..."
                  aria-label="Buscar" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} style={{ width: '130px' }} />
                <button className="btn btn-sm btn-outline-light text-nowrap" type="submit">Buscar</button>
              </form>

              <div className="d-flex align-items-center gap-2 flex-nowrap ms-lg-2">
                <Link to="/carrito" className="btn btn-sm btn-success text-nowrap" onClick={cerrarMenus}>
                  Carro {clp(total)} <span className="badge text-bg-light ms-1">{unidades}</span>
                </Link>
                {usuario ? (
                  <>
                    {esAdmin && <Link to="/admin" className="btn btn-sm btn-warning text-nowrap" onClick={cerrarMenus}>Admin</Link>}
                    <Link to="/mis-pedidos" className="btn btn-sm btn-outline-light text-nowrap" onClick={cerrarMenus}>{usuario.nombre}</Link>
                    <button type="button" className="btn btn-sm btn-link text-light text-nowrap p-0 text-decoration-none" onClick={() => { salir(); cerrarMenus(); }}>Salir</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="btn btn-sm btn-outline-light text-nowrap" onClick={cerrarMenus}>Iniciar sesión</Link>
                    <Link to="/registro" className="btn btn-sm btn-light text-nowrap" onClick={cerrarMenus}>Crear cuenta</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}