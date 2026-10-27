import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Precio from '../../components/comunes/Precio.tsx';
import Boton from '../../components/comunes/Boton.tsx';
import SelectorCantidad from '../../components/tienda/SelectorCantidad.tsx';
import ListaProductos from '../../components/tienda/ListaProductos.tsx';
import { useDatos } from '../../hooks/useDatos.js';
import { useAgregarAlCarrito } from '../../hooks/useAgregarAlCarrito.js';
import { productosDB } from '../../data/db.js';
import { slugificar } from '../../utils/formato.js';

export default function DetalleProducto() {
  const { id } = useParams();
  const producto = useDatos(() => productosDB.obtener(id), [id]);
  const relacionados = useDatos(
    () => (producto ? productosDB.porCategoria(producto.categoria).filter((p) => p.id !== producto.id).slice(0, 4) : []),
    [id, producto?.categoria],
  );
  const [cantidad, setCantidad] = useState(1);
  const agregar = useAgregarAlCarrito();

  if (!producto) {
    return (
      <div className="text-center py-5">
        <h1 className="h3">No encontramos este producto</h1>
        <p className="texto-suave">Puede que lo hayan quitado del catálogo.</p>
        <Link to="/productos" className="btn btn-light">Ver todos los productos</Link>
      </div>
    );
  }

  const agotado = producto.stock <= 0;
  return (
    <>
      <nav aria-label="Ruta de navegación">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/productos">Productos</Link></li>
          <li className="breadcrumb-item"><Link to={`/categorias/${slugificar(producto.categoria)}`}>{producto.categoria}</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{producto.nombre}</li>
        </ol>
      </nav>
      <div className="row g-4 mb-5">
        <div className="col-md-5">
          <img src={producto.img} alt={producto.nombre} className="img-fluid rounded-4 bg-white p-3 w-100 detalle-img" />
        </div>
        <div className="col-md-7">
          <span className="badge badge-categoria mb-2">{producto.categoria}</span>
          <h1 className="h2">{producto.nombre}</h1>
          <p className="texto-suave mb-1">{producto.marca}</p>
          <p>{producto.descripcion}</p>
          <Precio producto={producto} grande />
          <p className={`small mt-2 ${agotado ? 'text-danger' : 'texto-suave'}`}>
            {agotado ? 'Sin stock por ahora' : `${producto.stock} unidades disponibles`}
          </p>
          {!agotado && (
            <div className="d-flex flex-wrap gap-2 align-items-center mt-3" style={{ maxWidth: 380 }}>
              <div style={{ width: 150 }}><SelectorCantidad valor={cantidad} onCambiar={setCantidad} max={Math.min(99, producto.stock)} /></div>
              <Boton etiqueta="Agregar al carro" className="btn-marca flex-grow-1"
                onClick={() => { agregar(producto, cantidad); setCantidad(1); }} />
            </div>
          )}
        </div>
      </div>
      {relacionados.length > 0 && (
        <section aria-labelledby="titulo-relacionados">
          <h2 id="titulo-relacionados" className="titulo-seccion">También en {producto.categoria}</h2>
          <ListaProductos productos={relacionados} onAgregar={agregar} />
        </section>
      )}
    </>
  );
}
