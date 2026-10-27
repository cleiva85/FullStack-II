import { Link } from 'react-router-dom';
import EncabezadoSeccion from '../../components/admin/EncabezadoSeccion.jsx';
import { useDatos } from '../../hooks/useDatos.js';
import { useAviso } from '../../context/AvisoContext.jsx';
import { useSesion } from '../../context/SesionContext.jsx';
import { usuariosDB } from '../../data/db.js';

export default function UsuariosAdmin() {
  const usuarios = useDatos(() => usuariosDB.listar());
  const { usuario } = useSesion();
  const aviso = useAviso();

  function eliminar(u) {
    if (!window.confirm(`¿Eliminar a ${u.nombre} ${u.apellido}?`)) return;
    usuariosDB.eliminar(u.id);
    aviso('Usuario eliminado', 'secondary');
  }

  return (
    <>
      <EncabezadoSeccion titulo="Usuarios" descripcion={`${usuarios.length} usuarios`}>
        <Link to="/admin/usuarios/nuevo" className="btn btn-sm btn-primary">Nuevo usuario</Link>
      </EncabezadoSeccion>
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead><tr><th>Nombre</th><th>Correo</th><th>RUT</th><th>Rol</th><th>Comuna</th><th /></tr></thead>
          <tbody>
            {usuarios.map((u) => {
              const soyYo = u.correo.toLowerCase() === usuario?.email?.toLowerCase();
              return (
                <tr key={u.id}>
                  <td>{u.nombre} {u.apellido}</td>
                  <td>{u.correo}</td>
                  <td>{u.rut}</td>
                  <td><span className={`badge ${u.rol === 'admin' ? 'text-bg-warning' : 'text-bg-secondary'}`}>{u.rol === 'admin' ? 'Administrador' : 'Cliente'}</span></td>
                  <td>{u.comuna}</td>
                  <td className="text-end text-nowrap">
                    <Link to={`/admin/usuarios/${u.id}`} className="btn btn-sm btn-outline-secondary me-1">Ver</Link>
                    <Link to={`/admin/usuarios/${u.id}/editar`} className="btn btn-sm btn-outline-primary me-1">Editar</Link>
                    <button type="button" className="btn btn-sm btn-outline-danger" disabled={soyYo}
                      title={soyYo ? 'No puedes eliminar tu propia cuenta' : undefined} onClick={() => eliminar(u)}>Eliminar</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="small text-secondary">Los clientes que se registran en la tienda aparecen aquí automáticamente.</p>
    </>
  );
}
