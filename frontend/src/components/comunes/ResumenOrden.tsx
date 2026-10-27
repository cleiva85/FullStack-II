import TablaItems from './TablaItems.tsx';
import { clp, fechaHora } from '../../utils/formato.js';

/** Datos del cliente, entrega, productos y totales de una orden (se usa en la tienda y en el panel admin). */
export default function ResumenOrden({ orden }) {
  const { cliente, entrega } = orden;
  return (
    <div>
      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <h3 className="h6 text-secondary mb-1">Cliente</h3>
          <p className="mb-0">{cliente.nombre} {cliente.apellido}</p>
          <p className="mb-0">{cliente.correo}</p>
        </div>
        <div className="col-md-6">
          <h3 className="h6 text-secondary mb-1">Entrega</h3>
          {entrega.tipo === 'domicilio' ? (
            <>
              <p className="mb-0">{entrega.calle}{entrega.departamento ? `, depto. ${entrega.departamento}` : ''}</p>
              <p className="mb-0">{entrega.comuna}, {entrega.region}</p>
              {entrega.indicaciones && <p className="mb-0 small text-secondary">Indicaciones: {entrega.indicaciones}</p>}
            </>
          ) : (
            <p className="mb-0">Retiro en tienda: Av. Esq. Blanca 501, Maipú</p>
          )}
        </div>
      </div>
      <p className="small text-secondary mb-2">Fecha: {fechaHora(orden.fecha)}</p>
      <TablaItems items={orden.items} />
      <dl className="totales mt-3">
        <dt>Subtotal</dt><dd>{clp(orden.subtotal)}</dd>
        <dt>Despacho</dt><dd>{orden.despacho ? clp(orden.despacho) : 'Sin costo'}</dd>
        <dt className="fw-bold">Total</dt><dd className="fw-bold">{clp(orden.total)}</dd>
      </dl>
    </div>
  );
}
