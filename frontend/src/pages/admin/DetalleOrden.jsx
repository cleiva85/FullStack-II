import { Link, useParams } from 'react-router-dom';
import EncabezadoSeccion from '../../components/admin/EncabezadoSeccion.jsx';
import ResumenOrden from '../../components/comunes/ResumenOrden.jsx';
import { ordenesDB } from '../../data/db.js';

export default function DetalleOrden() {
  const { numero } = useParams();
  const orden = ordenesDB.porNumero(numero);
  if (!orden) return <p>No existe la orden {numero}. <Link to="/admin/ordenes">Volver a órdenes</Link></p>;
  return (
    <>
      <EncabezadoSeccion titulo={`Boleta n.º ${orden.numero}`} descripcion={`Estado: ${orden.estado}${orden.motivo ? ` — ${orden.motivo}` : ''}`}>
        <button type="button" className="btn btn-sm btn-danger no-imprimir" onClick={() => window.print()}>Imprimir</button>
        <Link to="/admin/ordenes" className="btn btn-sm btn-outline-secondary no-imprimir">Volver</Link>
      </EncabezadoSeccion>
      <div className="card"><div className="card-body boleta"><ResumenOrden orden={orden} /></div></div>
    </>
  );
}
