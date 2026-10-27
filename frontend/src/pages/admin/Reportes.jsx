import EncabezadoSeccion from '../../components/admin/EncabezadoSeccion.jsx';
import TarjetaResumen from '../../components/admin/TarjetaResumen.jsx';
import { useDatos } from '../../hooks/useDatos.js';
import { ordenesDB, productosDB } from '../../data/db.js';
import { resumenVentas, topProductos, ventasPorCategoria } from '../../utils/reportes.js';
import { clp } from '../../utils/formato.js';

export default function Reportes() {
  const ordenes = useDatos(() => ordenesDB.listar());
  const productos = useDatos(() => productosDB.listar());
  const r = resumenVentas(ordenes);
  const porCategoria = ventasPorCategoria(ordenes, productos);
  const maximo = Math.max(1, ...porCategoria.map((c) => c.monto));
  const top = topProductos(ordenes, 5);

  return (
    <>
      <EncabezadoSeccion titulo="Reportes" descripcion="Ventas registradas en la tienda (solo órdenes pagadas)">
        <button type="button" className="btn btn-sm btn-outline-secondary no-imprimir" onClick={() => window.print()}>Imprimir</button>
      </EncabezadoSeccion>
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3"><TarjetaResumen titulo="Ventas" valor={clp(r.monto)} color="primary" /></div>
        <div className="col-sm-6 col-xl-3"><TarjetaResumen titulo="Órdenes pagadas" valor={r.pagadas} color="success" /></div>
        <div className="col-sm-6 col-xl-3"><TarjetaResumen titulo="Pagos rechazados" valor={r.rechazadas} color="danger" /></div>
        <div className="col-sm-6 col-xl-3"><TarjetaResumen titulo="Ticket promedio" valor={clp(r.ticketPromedio)} color="dark" /></div>
      </div>
      <div className="row g-4">
        <section className="col-lg-7" aria-labelledby="t-categorias">
          <h2 id="t-categorias" className="h5">Ventas por categoría</h2>
          {!porCategoria.length && <p className="text-secondary">Aún no hay ventas.</p>}
          {porCategoria.map((c) => (
            <div key={c.categoria} className="mb-2">
              <div className="d-flex justify-content-between small"><span>{c.categoria}</span><span>{clp(c.monto)}</span></div>
              <div className="progress" role="progressbar" aria-label={c.categoria} aria-valuenow={c.monto} aria-valuemin={0} aria-valuemax={maximo}>
                <div className="progress-bar bg-admin" style={{ width: `${(c.monto / maximo) * 100}%` }} />
              </div>
            </div>
          ))}
        </section>
        <section className="col-lg-5" aria-labelledby="t-top">
          <h2 id="t-top" className="h5">Productos más vendidos</h2>
          <ol className="list-group list-group-numbered">
            {top.map((p) => (
              <li key={p.id} className="list-group-item d-flex justify-content-between align-items-start">
                <div className="ms-2 me-auto">{p.nombre}<br /><small className="text-secondary">{p.unidades} unidades</small></div>
                <span>{clp(p.monto)}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </>
  );
}
