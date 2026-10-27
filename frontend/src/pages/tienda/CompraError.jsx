import { Link, useParams } from 'react-router-dom';
import ResumenOrden from '../../components/comunes/ResumenOrden.jsx';
import { ordenesDB } from '../../data/db.js';

export default function CompraError() {
  const { numero } = useParams();
  const orden = ordenesDB.porNumero(numero);
  if (!orden) return <p className="text-center py-5">No encontramos la orden {numero}. <Link to="/">Volver al inicio</Link></p>;

  return (
    <div className="row justify-content-center">
      <div className="col-xl-9">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h1 className="h4 text-danger">✕ No se pudo realizar el pago de la orden n.º {orden.numero}</h1>
            <div className="alert alert-danger" role="alert">
              {orden.motivo || 'El pago fue rechazado.'} Tus productos siguen en el carro: ajusta las cantidades e inténtalo otra vez.
            </div>
            <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
              <Link to="/checkout" className="btn btn-success">Volver a realizar el pago</Link>
              <Link to="/carrito" className="btn btn-outline-secondary">Revisar el carro</Link>
            </div>
            <ResumenOrden orden={orden} />
          </div>
        </div>
      </div>
    </div>
  );
}
