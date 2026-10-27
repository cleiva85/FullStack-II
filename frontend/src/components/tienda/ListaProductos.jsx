import ProductoCard from './ProductoCard.jsx';

/** Grilla responsiva de productos: 1 columna en móvil, 2 en tablet, 4 en escritorio. */
export default function ListaProductos({ productos, onAgregar, mensajeVacio = 'No hay productos para mostrar.' }) {
  if (!productos.length) return <p className="text-center text-secondary py-5 mensaje-vacio">{mensajeVacio}</p>;
  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3" data-testid="lista-productos">
      {productos.map((p) => (
        <div className="col" key={p.id}>
          <ProductoCard producto={p} onAgregar={onAgregar} />
        </div>
      ))}
    </div>
  );
}
