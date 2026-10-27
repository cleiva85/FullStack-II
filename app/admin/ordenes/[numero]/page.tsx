'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import EncabezadoSeccion from '@/app/_components/admin/EncabezadoSeccion';
import ResumenOrden from '@/app/_components/comunes/ResumenOrden';
import { ordenesDB } from '@/app/_lib/data/db';

export default function DetalleOrden() {
  const { numero } = useParams();
  const orden = ordenesDB.porNumero(numero);
  if (!orden) return <p>No existe la orden {numero}. <Link href="/admin/ordenes">Volver a órdenes</Link></p>;
  return (
    <>
      <EncabezadoSeccion titulo={`Boleta n.º ${orden.numero}`} descripcion={`Estado: ${orden.estado}${orden.motivo ? ` — ${orden.motivo}` : ''}`}>
        <button type="button" className="btn btn-sm btn-danger no-imprimir" onClick={() => window.print()}>Imprimir</button>
        <Link href="/admin/ordenes" className="btn btn-sm btn-outline-secondary no-imprimir">Volver</Link>
      </EncabezadoSeccion>
      <div className="card"><div className="card-body boleta"><ResumenOrden orden={orden} /></div></div>
    </>
  );
}
