'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import EncabezadoSeccion from '@/app/_components/admin/EncabezadoSeccion';
import { useDatos } from '@/app/_lib/hooks/useDatos';
import { ordenesDB, usuariosDB } from '@/app/_lib/data/db';
import { fechaHora } from '@/app/_lib/utils/formato';

export default function DetalleUsuario() {
  const { id } = useParams();
  const u = useDatos(() => usuariosDB.obtener(id), [id]);
  if (!u) return <p>No existe el usuario {id}. <Link href="/admin/usuarios">Volver</Link></p>;
  const compras = ordenesDB.porCliente(u.correo).length;
  return (
    <>
      <EncabezadoSeccion titulo={`${u.nombre} ${u.apellido}`} descripcion={u.rol === 'admin' ? 'Administrador' : 'Cliente'}>
        <Link href={`/admin/usuarios/${u.id}/historial`} className="btn btn-sm btn-outline-success">Historial de compras ({compras})</Link>
        <Link href={`/admin/usuarios/${u.id}/editar`} className="btn btn-sm btn-primary">Editar usuario</Link>
        <Link href="/admin/usuarios" className="btn btn-sm btn-outline-secondary">Volver</Link>
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
