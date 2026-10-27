import { useState } from 'react';
import { Link, NavLink, useParams } from 'react-router-dom';
import ListaProductos from '../../components/tienda/ListaProductos.tsx';
import { useDatos } from '../../hooks/useDatos.js';
import { useAgregarAlCarrito } from '../../hooks/useAgregarAlCarrito.js';
import { categoriasDB, productosDB } from '../../data/db.js';
import { precioFinal, descuento } from '../../utils/formato.js';

export default function Categorias() {
  const { slug } = useParams();
  const [orden, setOrden] = useState('');
  const categorias = useDatos(() => categoriasDB.listar());
  const productos = useDatos(() => productosDB.listar());
  const agregar = useAgregarAlCarrito();

  // 1. Ordenar las categorías alfabéticamente (A-Z)
  const categoriasOrdenadas = [...categorias].sort((a, b) =>
    a.nombre.localeCompare(b.nombre, 'es')
  );

  const actual = slug ? categoriasOrdenadas.find((c) => c.slug === slug) : null;

  // 2. Función para ordenar los productos según la opción seleccionada
  const ordenarLista = (lista) => {
    const copia = [...lista];
    if (orden === 'precio-asc') {
      copia.sort((a, b) => precioFinal(a) - precioFinal(b));
    } else if (orden === 'precio-desc') {
      copia.sort((a, b) => precioFinal(b) - precioFinal(a));
    } else if (orden === 'descuento-asc') {
      copia.sort((a, b) => descuento(a) - descuento(b));
    } else if (orden === 'descuento-desc') {
      copia.sort((a, b) => descuento(b) - descuento(a));
    }
    return copia;
  };

  return (
    <>
      <h1 className="titulo-seccion">Categorías</h1>

      {/* Botones de categorías ordenados alfabéticamente + Selector "Ordenar por" a la derecha */}
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
        <div className="d-flex flex-wrap gap-2" role="list" style={{ flex: '1 1 65%' }}>
          <NavLink
            to="/categorias"
            end
            className={({ isActive }) => `btn btn-sm ${isActive ? 'btn-light' : 'btn-outline-light'}`}
          >
            Todas
          </NavLink>
          {categoriasOrdenadas.map((c) => (
            <NavLink
              key={c.id}
              to={`/categorias/${c.slug}`}
              role="listitem"
              className={({ isActive }) => `btn btn-sm ${isActive ? 'btn-light' : 'btn-outline-light'}`}
            >
              {c.nombre}
            </NavLink>
          ))}
        </div>

        {/* Desplegable "Ordenar por" en el costado derecho superior */}
        <div className="ms-auto" style={{ minWidth: '240px' }}>
          <label htmlFor="ordenar-categorias" className="visually-hidden">Ordenar por</label>
          <select
            id="ordenar-categorias"
            className="form-select form-select-sm bg-dark text-light border-secondary"
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
          >
            <option value="">Ordenar por...</option>
            <option value="precio-asc">Precio: de menor a mayor</option>
            <option value="precio-desc">Precio: de mayor a menor</option>
            <option value="descuento-asc">Descuento: de menor a mayor</option>
            <option value="descuento-desc">Descuento: de mayor a menor</option>
          </select>
        </div>
      </div>

      {slug && !actual && <p className="texto-suave">Esa categoría no existe. Elige una de la lista.</p>}

      {!slug && (
        <section className="mb-5" aria-labelledby="cat-todas">
          <h2 id="cat-todas" className="h4 mb-2">
            Todos los productos <small className="texto-suave fs-6">({productos.length})</small>
          </h2>
          <ListaProductos productos={ordenarLista(productos)} onAgregar={agregar} />
        </section>
      )}

      {actual && (() => {
        const deLaCategoria = ordenarLista(productos.filter((p) => p.categoria === actual.nombre));
        return (
          <section className="mb-5" aria-labelledby={`cat-${actual.id}`}>
            <h2 id={`cat-${actual.id}`} className="h4 mb-2">
              {actual.nombre} <small className="texto-suave fs-6">({deLaCategoria.length})</small>
            </h2>
            <ListaProductos
              productos={deLaCategoria}
              onAgregar={agregar}
              mensajeVacio="Esta categoría todavía no tiene productos."
            />
          </section>
        );
      })()}
    </>
  );
}