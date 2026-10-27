import { useState } from 'react';
import { Link } from 'react-router-dom';
import EncabezadoSeccion from '../../components/admin/EncabezadoSeccion.jsx';
import { useDatos } from '../../hooks/useDatos.js';
import { ordenesDB } from '../../data/db.js';
import { clp, fechaHora } from '../../utils/formato.js';

export default function Ordenes() {
  const ordenes = useDatos(() => [...ordenesDB.listar()].reverse());
  const [estado, setEstado] = useState('');
  const lista = estado ? ordenes.filter((o) => o.estado === estado) : ordenes;

  return (
    <>
      <EncabezadoSeccion titulo="Órdenes y boletas" descripcion={`${lista.length} órdenes`}>
        <label htmlFor="filtro-estado" className="visually-hidden">Estado</label>
        <select id="filtro-estado" className="form-select form-select-sm" value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="">Todos los estados</option>
          <option value="Pagada">Pagadas</option>
          <option value="Rechazada">Rechazadas</option>
        </select>
      </EncabezadoSeccion>
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead><tr><th>N.º</th><th>Fecha</th><th>Cliente</th><th>Entrega</th><th className="text-end">Total</th><th>Estado</th><th /></tr></thead>
          <tbody>
            {lista.map((o) => (
              <tr key={o.id}>
                <td>{o.numero}</td>
                <td>{fechaHora(o.fecha)}</td>
                <td>{o.cliente.nombre} {o.cliente.apellido}<br /><small className="text-secondary">{o.cliente.correo}</small></td>
                <td>{o.entrega.tipo === 'domicilio' ? `Despacho a ${o.entrega.comuna}` : 'Retiro en tienda'}</td>
                <td className="text-end">{clp(o.total)}</td>
                <td><span className={`badge ${o.estado === 'Pagada' ? 'text-bg-success' : 'text-bg-danger'}`}>{o.estado}</span></td>
                <td className="text-end"><Link to={`/admin/ordenes/${o.numero}`} className="btn btn-sm btn-outline-primary">Ver boleta</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
