'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import EncabezadoSeccion from '@/app/_components/admin/EncabezadoSeccion';
import EstadoMensaje from '@/app/_components/admin/EstadoMensaje';
import { useDatos } from '@/app/_lib/hooks/useDatos';
import { useAviso } from '@/app/_context/AvisoContext';
import { mensajesDB } from '@/app/_lib/data/db';
import { fechaHora } from '@/app/_lib/utils/formato';

export default function DetalleMensaje() {
  const { id } = useParams();
  const m = useDatos(() => mensajesDB.obtener(id), [id]);
  const router = useRouter();
  const aviso = useAviso();

  // Al abrir un mensaje nuevo, queda como leído
  useEffect(() => {
    if (m?.estado === 'Nuevo') mensajesDB.actualizar(m.id, { estado: 'Leído' });
  }, [m?.id, m?.estado]);

  if (!m) return <p>No existe el mensaje {id}. <Link href="/admin/mensajes">Volver a mensajes</Link></p>;

  const asunto = encodeURIComponent('Respuesta de C & D Distribuidora');
  const cuerpo = encodeURIComponent(`Hola ${m.nombre},\n\n\n\n---\nTu mensaje del ${fechaHora(m.fecha)}:\n${m.mensaje}`);

  function eliminar() {
    if (!window.confirm(`¿Eliminar el mensaje de ${m.nombre}?`)) return;
    mensajesDB.eliminar(m.id);
    aviso('Mensaje eliminado', 'secondary');
    router.push('/admin/mensajes');
  }

  return (
    <>
      <EncabezadoSeccion titulo={`Mensaje de ${m.nombre}`} descripcion={fechaHora(m.fecha)}>
        <Link href="/admin/mensajes" className="btn btn-sm btn-outline-secondary">Volver</Link>
      </EncabezadoSeccion>
      <div className="card" style={{ maxWidth: 760 }}>
        <div className="card-body">
          <dl className="row mb-3">
            <dt className="col-sm-3">Correo</dt><dd className="col-sm-9">{m.correo}</dd>
            <dt className="col-sm-3">Estado</dt>
            <dd className="col-sm-9"><EstadoMensaje estado={m.estado} /></dd>
            <dt className="col-sm-3">Aviso por correo</dt>
            <dd className="col-sm-9">{m.correoEnviado ? 'Enviado a la tienda' : 'No enviado (correo simulado o sin configurar)'}</dd>
          </dl>
          <p className="lectura" style={{ whiteSpace: 'pre-wrap' }}>{m.mensaje}</p>
        </div>
        <div className="card-footer d-flex flex-wrap gap-2">
          <a href={`mailto:${m.correo}?subject=${asunto}&body=${cuerpo}`} className="btn btn-sm btn-primary">Responder por correo</a>
          {m.estado !== 'Respondido' && (
            <button type="button" className="btn btn-sm btn-success" onClick={() => { mensajesDB.actualizar(m.id, { estado: 'Respondido' }); aviso('Mensaje marcado como respondido'); }}>
              Marcar como respondido
            </button>
          )}
          <button type="button" className="btn btn-sm btn-outline-danger ms-auto" onClick={eliminar}>Eliminar</button>
        </div>
      </div>
    </>
  );
}
