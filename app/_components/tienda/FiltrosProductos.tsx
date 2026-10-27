'use client';

/** Buscador, filtro por categoría y orden. Componente controlado: avisa los cambios con onCambiar. */
export default function FiltrosProductos({ filtros, categorias, onCambiar, total, mostrados }) {
  const cambiar = (campo) => (e) => onCambiar({ ...filtros, [campo]: e.target.value });
  return (
    <form className="row g-2 align-items-center mb-4 filtros" role="search" onSubmit={(e) => e.preventDefault()}>
      <div className="col-12 col-md-5">
        <label htmlFor="filtro-texto" className="visually-hidden">Buscar producto o marca</label>
        <input id="filtro-texto" type="search" className="form-control" placeholder="Buscar producto o marca"
          value={filtros.texto} onChange={cambiar('texto')} />
      </div>
      <div className="col-6 col-md-3">
        <label htmlFor="filtro-categoria" className="visually-hidden">Categoría</label>
        <select id="filtro-categoria" className="form-select" value={filtros.categoria} onChange={cambiar('categoria')}>
          <option value="">Todas las categorías</option>
          {categorias.map((c) => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
        </select>
      </div>
      <div className="col-6 col-md-2">
        <label htmlFor="filtro-orden" className="visually-hidden">Ordenar</label>
        <select id="filtro-orden" className="form-select" value={filtros.orden} onChange={cambiar('orden')}>
          <option value="">Destacados</option>
          <option value="precio-asc">Precio: menor a mayor</option>
          <option value="precio-desc">Precio: mayor a menor</option>
          <option value="nombre">Nombre: A-Z</option>
        </select>
      </div>
      {total != null && (
        <div className="col-12 col-md-2 small text-md-end texto-suave">{mostrados} de {total} productos</div>
      )}
    </form>
  );
}

/** Aplica los filtros a una lista de productos (función pura, se prueba por separado). */
export function filtrarProductos(productos, { texto = '', categoria = '', orden = '' }, precio = (p) => p.precio) {
  const q = texto.trim().toLowerCase();
  const lista = productos.filter((p) =>
    (!categoria || p.categoria === categoria) &&
    (!q || `${p.nombre} ${p.marca} ${p.categoria}`.toLowerCase().includes(q)));
  if (orden === 'precio-asc') lista.sort((a, b) => precio(a) - precio(b));
  else if (orden === 'precio-desc') lista.sort((a, b) => precio(b) - precio(a));
  else if (orden === 'nombre') lista.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  return lista;
}
