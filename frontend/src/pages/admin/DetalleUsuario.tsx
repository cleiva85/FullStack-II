import { Link, useParams } from 'react-router-dom';
import EncabezadoSeccion from '../../components/admin/EncabezadoSeccion.tsx';
import { useDatos } from '../../hooks/useDatos.js';
import { ordenesDB, usuariosDB } from '../../data/db.js';
import { fechaHora } from '../../utils/formato.js';

export default function DetalleUsuario() {
  const { id } = useParams();
  const u = useDatos(() => usuariosDB.obtener(id), [id]);
  if (!u) return <p>No existe el usuario {id}. <Link to="/admin/usuarios">Volver</Link></p>;
  const compras = ordenesDB.porCliente(u.correo).length;
  return (
    <>
      <EncabezadoSeccion titulo={`${u.nombre} ${u.apellido}`} descripcion={u.rol === 'admin' ? 'Administrador' : 'Cliente'}>
        <Link to={`/admin/usuarios/${u.id}/historial`} className="btn btn-sm btn-outline-success">Historial de compras ({compras})</Link>
        <Link to={`/admin/usuarios/${u.id}/editar`} className="btn btn-sm btn-primary">Editar usuario</Link>
        <Link to="/admin/usuarios" className="btn btn-sm btn-outline-secondary">Volver</Link>
      </EncabezadoSeccion>
      <dl className="row" style={{ maxWidth: 720 }}>
        <dt className="col-sm-4">RUT</dt><dd className="col-sm-8">{u.rut}</dd>
        <dt className="col-sm-4">Correo</dt><dd className="col-sm-8">{u.correo}</dd>
        <dt className="col-sm-4">Teléfono</dt><dd className="col-sm-8">{u.telefono || '—'}</dd>
        <dt className="col-sm-4">Dirección</dt><dd className="col-sm-8">{u.direccion ? `${u.direccion}, ${u.comuna}, ${u.region}` : '—'}</dd>
        <dt className="col-sm-4">Registrado</dt><dd className="col-sm-8">{u.fechaRegistro ? fechaHora(u.fechaRegistro) : '—'}</dd>
      </dl>
    </>
  );
}
