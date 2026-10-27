import { Link } from 'react-router-dom';
import EncabezadoSeccion from '../../components/admin/EncabezadoSeccion.jsx';
import { useDatos } from '../../hooks/useDatos.js';
import { productosDB } from '../../data/db.js';

export default function ProductosCriticos() {
  const criticos = useDatos(() => [...productosDB.criticos()].sort((a, b) => a.stock - b.stock));
  return (
    <>
      <EncabezadoSeccion titulo="Productos con stock crítico" descripcion="Productos con stock igual o menor a su stock crítico">
        <Link to="/admin/productos" className="btn btn-sm btn-outline-secondary">Volver a productos</Link>
      </EncabezadoSeccion>
      {!criticos.length ? <p className="text-secondary">No hay productos en stock crítico.</p> : (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead><tr><th>Producto</th><th>Categoría</th><th className="text-end">Stock</th><th className="text-end">Crítico</th><th /></tr></thead>
            <tbody>
              {criticos.map((p) => (
                <tr key={p.id} className={p.stock === 0 ? 'table-danger' : 'table-warning'}>
                  <td>{p.nombre}</td><td>{p.categoria}</td>
                  <td className="text-end fw-bold">{p.stock}</td><td className="text-end">{p.stockCritico}</td>
                  <td className="text-end"><Link to={`/admin/productos/${p.id}/editar`} className="btn btn-sm btn-primary">Reponer stock</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
