'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import EnlaceNav from '@/app/_components/comunes/EnlaceNav';
import { useSesion } from '@/app/_context/SesionContext';
import { useCarrito } from '@/app/_context/CarritoContext';
import { useDatos } from '@/app/_lib/hooks/useDatos';
import { categoriasDB } from '@/app/_lib/data/db';
import { clp } from '@/app/_lib/utils/formato';

/** Barra de navegación con Categorías y Ofertas dentro del menú Productos. */
export default function Encabezado() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [productosAbiertos, setProductosAbiertos] = useState(false);
  const [categoriasAbiertas, setCategoriasAbiertas] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const router = useRouter();
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
    router.push(`/productos?q=${encodeURIComponent(busqueda.trim())}`);
    cerrarMenus();
  }

  return (
    <header className="sticky-top encabezado shadow-sm">
      <nav className="navbar navbar-expand-lg navbar-dark py-2" aria-label="Navegación principal">
        <div className="container-fluid px-4">
          <Link href="/" className="navbar-brand marca fs-5 me-3" onClick={cerrarMenus}>C & D Distribuidora</Link>
          <button className="navbar-toggler" type="button" aria-controls="menu-principal"
            aria-expanded={menuAbierto} aria-label="Abrir menú" onClick={() => setMenuAbierto((v) => !v)}>
            <span className="navbar-toggler-icon" />
          </button>

          <div id="menu-principal" className={`collapse navbar-collapse ${menuAbierto ? 'show' : ''}`}>
            {/* Menú de navegación central */}
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 align-lg-items-center">
              <li className="nav-item">
                <EnlaceNav href="/" exacto className={enlace} onClick={cerrarMenus}>Inicio</EnlaceNav>
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
                    <Link className="dropdown-item" href="/ofertas" onClick={cerrarMenus}>
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
                          <Link className="dropdown-item py-1 fw-medium" href="/categorias" onClick={cerrarMenus}>
                            Ver todas
                          </Link>
                        </li>
                        <li><hr className="dropdown-divider my-1" /></li>
                        {categorias.map((c) => (
                          <li key={c.id}>
                            <Link className="dropdown-item py-1" href={`/categorias/${c.slug}`} onClick={cerrarMenus}>
                              {c.nombre}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                </ul>
              </li>

              <li className="nav-item"><EnlaceNav href="/nosotros" className={enlace} onClick={cerrarMenus}>Nosotros</EnlaceNav></li>
              <li className="nav-item"><EnlaceNav href="/blogs" className={enlace} onClick={cerrarMenus}>Blog</EnlaceNav></li>
              <li className="nav-item"><EnlaceNav href="/contacto" className={enlace} onClick={cerrarMenus}>Contacto</EnlaceNav></li>
            </ul>

            {/* Buscador y botones de la derecha */}
            <div className="d-flex align-items-center flex-wrap flex-lg-nowrap gap-2 mt-2 mt-lg-0">
              <form className="d-flex" role="search" onSubmit={buscar}>
                <input className="form-control form-control-sm me-1" type="search" placeholder="Buscar..."
                  aria-label="Buscar" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} style={{ width: '130px' }} />
                <button className="btn btn-sm btn-outline-light text-nowrap" type="submit">Buscar</button>
              </form>

              <div className="d-flex align-items-center gap-2 flex-nowrap ms-lg-2">
                <Link href="/carrito" className="btn btn-sm btn-success text-nowrap" onClick={cerrarMenus}>
                  Carro {clp(total)} <span className="badge text-bg-light ms-1">{unidades}</span>
                </Link>
                {usuario ? (
                  <>
                    {esAdmin && <Link href="/admin" className="btn btn-sm btn-warning text-nowrap" onClick={cerrarMenus}>Admin</Link>}
                    <Link href="/mis-pedidos" className="btn btn-sm btn-outline-light text-nowrap" onClick={cerrarMenus}>{usuario.nombre}</Link>
                    <button type="button" className="btn btn-sm btn-link text-light text-nowrap p-0 text-decoration-none" onClick={() => { salir(); cerrarMenus(); }}>Salir</button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="btn btn-sm btn-outline-light text-nowrap" onClick={cerrarMenus}>Iniciar sesión</Link>
                    <Link href="/registro" className="btn btn-sm btn-light text-nowrap" onClick={cerrarMenus}>Crear cuenta</Link>
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