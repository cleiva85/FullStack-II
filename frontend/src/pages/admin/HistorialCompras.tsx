import { Link, useParams } from 'react-router-dom';
import EncabezadoSeccion from '../../components/admin/EncabezadoSeccion.tsx';
import { useDatos } from '../../hooks/useDatos.js';
import { ordenesDB, usuariosDB } from '../../data/db.js';
import { clp, fechaHora } from '../../utils/formato.js';

export default function HistorialCompras() {
  const { id } = useParams();
  const u = usuariosDB.obtener(id);
  const ordenes = useDatos(() => (u ? ordenesDB.porCliente(u.correo) : []), [id]);
  if (!u) return <p>No existe el usuario {id}.</p>;
  return (
    <>
      <EncabezadoSeccion titulo={`Historial de compras de ${u.nombre} ${u.apellido}`} descripcion={u.correo}>
        <Link to={`/admin/usuarios/${u.id}`} className="btn btn-sm btn-outline-secondary">Volver al usuario</Link>
      </EncabezadoSeccion>
      {!ordenes.length ? <p className="text-secondary">Este usuario todavía no tiene compras.</p> : (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead><tr><th>N.º</th><th>Fecha</th><th className="text-end">Productos</th><th className="text-end">Total</th><th>Estado</th><th /></tr></thead>
            <tbody>
              {ordenes.map((o) => (
                <tr key={o.id}>
                  <td>{o.numero}</td><td>{fechaHora(o.fecha)}</td>
                  <td className="text-end">{o.items.reduce((n, i) => n + i.cantidad, 0)}</td>
                  <td className="text-end">{clp(o.total)}</td>
                  <td><span className={`badge ${o.estado === 'Pagada' ? 'text-bg-success' : 'text-bg-danger'}`}>{o.estado}</span></td>
                  <td className="text-end"><Link to={`/admin/ordenes/${o.numero}`} className="btn btn-sm btn-outline-primary">Ver boleta</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
