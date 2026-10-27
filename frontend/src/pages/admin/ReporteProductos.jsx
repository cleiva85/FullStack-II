import EncabezadoSeccion from '../../components/admin/EncabezadoSeccion.jsx';
import { useDatos } from '../../hooks/useDatos.js';
import { productosDB } from '../../data/db.js';
import { inventarioPorCategoria } from '../../utils/reportes.js';
import { clp } from '../../utils/formato.js';

export default function ReporteProductos() {
  const filas = useDatos(() => inventarioPorCategoria(productosDB.listar()));
  const total = filas.reduce((t, f) => ({ productos: t.productos + f.productos, unidades: t.unidades + f.unidades, valor: t.valor + f.valor, criticos: t.criticos + f.criticos }), { productos: 0, unidades: 0, valor: 0, criticos: 0 });
  return (
    <>
      <EncabezadoSeccion titulo="Reporte de productos" descripcion="Inventario por categoría (valor a precio normal)">
        <button type="button" className="btn btn-sm btn-outline-secondary no-imprimir" onClick={() => window.print()}>Imprimir</button>
      </EncabezadoSeccion>
      <div className="table-responsive">
        <table className="table">
          <thead><tr><th>Categoría</th><th className="text-end">Productos</th><th className="text-end">Unidades</th><th className="text-end">Valor inventario</th><th className="text-end">Críticos</th></tr></thead>
          <tbody>
            {filas.map((f) => (
              <tr key={f.categoria}><td>{f.categoria}</td><td className="text-end">{f.productos}</td><td className="text-end">{f.unidades}</td><td className="text-end">{clp(f.valor)}</td><td className="text-end">{f.criticos}</td></tr>
            ))}
          </tbody>
          <tfoot className="fw-bold">
            <tr><td>Total</td><td className="text-end">{total.productos}</td><td className="text-end">{total.unidades}</td><td className="text-end">{clp(total.valor)}</td><td className="text-end">{total.criticos}</td></tr>
          </tfoot>
        </table>
      </div>
    </>
  );
}
