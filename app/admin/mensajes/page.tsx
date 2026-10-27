'use client';

import { useState } from 'react';
import Link from 'next/link';
import EncabezadoSeccion from '@/app/_components/admin/EncabezadoSeccion';
import EstadoMensaje from '@/app/_components/admin/EstadoMensaje';
import { useDatos } from '@/app/_lib/hooks/useDatos';
import { mensajesDB } from '@/app/_lib/data/db';
import { fechaHora } from '@/app/_lib/utils/formato';

/** Mensajes que llegan desde el formulario de Contacto de la tienda */
export default function MensajesAdmin() {
  const mensajes = useDatos(() => mensajesDB.recientes());
  const [estado, setEstado] = useState('');
  const lista = estado ? mensajes.filter((m) => m.estado === estado) : mensajes;
  const nuevos = mensajes.filter((m) => m.estado === 'Nuevo').length;

  return (
    <>
      <EncabezadoSeccion titulo="Mensajes de contacto" descripcion={`${mensajes.length} mensajes · ${nuevos} sin leer`}>
        <label htmlFor="filtro-mensajes" className="visually-hidden">Estado</label>
        <select id="filtro-mensajes" className="form-select form-select-sm" value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="">Todos los estados</option>
          <option value="Nuevo">Nuevos</option>
          <option value="Leído">Leídos</option>
          <option value="Respondido">Respondidos</option>
        </select>
      </EncabezadoSeccion>
      {!lista.length ? <p className="text-secondary">No hay mensajes{estado ? ' con ese estado' : ''}.</p> : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead><tr><th>Fecha</th><th>Nombre</th><th>Correo</th><th>Mensaje</th><th>Estado</th><th /></tr></thead>
            <tbody>
              {lista.map((m) => (
                <tr key={m.id} className={m.estado === 'Nuevo' ? 'fw-semibold' : ''}>
                  <td className="text-nowrap">{fechaHora(m.fecha)}</td>
                  <td>{m.nombre}</td>
                  <td>{m.correo}</td>
                  <td className="text-truncate" style={{ maxWidth: 280 }}>{m.mensaje}</td>
                  <td><EstadoMensaje estado={m.estado} /></td>
                  <td className="text-end"><Link href={`/admin/mensajes/${m.id}`} className="btn btn-sm btn-outline-primary">Ver</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
