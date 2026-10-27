'use client';

import Link from 'next/link';
import EncabezadoSeccion from '@/app/_components/admin/EncabezadoSeccion';
import { useDatos } from '@/app/_lib/hooks/useDatos';
import { useAviso } from '@/app/_context/AvisoContext';
import { useSesion } from '@/app/_context/SesionContext';
import { usuariosDB } from '@/app/_lib/data/db';

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
        <Link href="/admin/usuarios/nuevo" className="btn btn-sm btn-primary">Nuevo usuario</Link>
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
                    <Link href={`/admin/usuarios/${u.id}`} className="btn btn-sm btn-outline-secondary me-1">Ver</Link>
                    <Link href={`/admin/usuarios/${u.id}/editar`} className="btn btn-sm btn-outline-primary me-1">Editar</Link>
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
