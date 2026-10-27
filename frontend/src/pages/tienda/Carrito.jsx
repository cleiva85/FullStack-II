import { Link, useNavigate } from 'react-router-dom';
import TablaItems from '../../components/comunes/TablaItems.jsx';
import Boton from '../../components/comunes/Boton.jsx';
import { useCarrito } from '../../context/CarritoContext.jsx';
import { clp } from '../../utils/formato.js';

export default function Carrito() {
  const { detalle, total, cambiar, quitar, vaciar } = useCarrito();
  const navegar = useNavigate();

  if (!detalle.length) {
    return (
      <div className="text-center py-5">
        <h1 className="h3">Tu carro está vacío</h1>
        <p className="texto-suave">Agrega productos desde el catálogo y aparecerán aquí.</p>
        <Link to="/productos" className="btn btn-light">Ver productos</Link>
      </div>
    );
  }

  return (
    <div className="row justify-content-center">
      <div className="col-xl-10">
        <h1 className="titulo-seccion">Carro de compras</h1>
        <div className="card shadow-sm">
          <div className="card-body">
            <TablaItems items={detalle} onCambiar={cambiar} onQuitar={quitar} />
            <div className="d-flex justify-content-end align-items-baseline gap-3 mt-3">
              <span className="texto-secundario">Total</span>
              <strong className="fs-4" data-testid="total-carrito">{clp(total)}</strong>
            </div>
          </div>
          <div className="card-footer d-flex flex-wrap justify-content-between gap-2">
            <Link to="/productos" className="btn btn-outline-secondary">Seguir comprando</Link>
            <div className="d-flex gap-2">
              <Boton etiqueta="Vaciar carro" variante="secondary" onClick={() => { if (window.confirm('¿Vaciar el carro?')) vaciar(); }} />
              <Boton etiqueta="Ir a pagar" variante="success" onClick={() => navegar('/checkout')} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
