import { useState } from 'react';
import { Link } from 'react-router-dom';
import Precio from '../comunes/Precio.jsx';
import Boton from '../comunes/Boton.jsx';
import SelectorCantidad from './SelectorCantidad.jsx';

/** Tarjeta de producto con selector de cantidad. Avisa al padre con onAgregar(producto, cantidad). */
export default function ProductoCard({ producto, onAgregar }) {
  const [cantidad, setCantidad] = useState(1);
  const agotado = producto.stock <= 0;

  function agregar() {
    onAgregar(producto, cantidad);
    setCantidad(1);
  }

  return (
    <article className="card h-100 tarjeta-producto">
      <Link to={`/productos/${producto.id}`} className="text-decoration-none">
        <img src={producto.img} className="card-img-top" alt={producto.nombre} loading="lazy" />
      </Link>
      <div className="card-body d-flex flex-column text-center">
        <span className="badge badge-categoria align-self-center mb-2">{producto.categoria}</span>
        <h3 className="h6 card-title mb-1">
          <Link to={`/productos/${producto.id}`} className="link-dark text-decoration-none">{producto.nombre}</Link>
        </h3>
        <p className="small text-secondary mb-1">{producto.marca}</p>
        <p className="small text-secondary mb-2">{producto.descripcion}</p>
        <Precio producto={producto} />
        <div className="mt-auto pt-2">
          {agotado ? (
            <p className="text-danger small fw-semibold mb-2">Sin stock</p>
          ) : (
            <div className="mb-2 px-3">
              <SelectorCantidad valor={cantidad} onCambiar={setCantidad} etiqueta={`Cantidad de ${producto.nombre}`} />
            </div>
          )}
          <Boton etiqueta="Agregar al carro" onClick={agregar} deshabilitado={agotado} className="w-100 btn-marca" />
        </div>
      </div>
    </article>
  );
}
