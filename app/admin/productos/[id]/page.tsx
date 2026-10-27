'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import EncabezadoSeccion from '@/app/_components/admin/EncabezadoSeccion';
import Precio from '@/app/_components/comunes/Precio';
import { useDatos } from '@/app/_lib/hooks/useDatos';
import { productosDB } from '@/app/_lib/data/db';

export default function DetalleProductoAdmin() {
  const { id } = useParams();
  const p = useDatos(() => productosDB.obtener(id), [id]);
  if (!p) return <p>No existe el producto {id}. <Link href="/admin/productos">Volver</Link></p>;
  return (
    <>
      <EncabezadoSeccion titulo={p.nombre} descripcion={`Producto #${p.id}`}>
        <Link href={`/admin/productos/${p.id}/editar`} className="btn btn-sm btn-primary">Editar producto</Link>
        <Link href="/admin/productos" className="btn btn-sm btn-outline-secondary">Volver</Link>
      </EncabezadoSeccion>
      <div className="row g-4">
        <div className="col-md-4"><img src={p.img} alt={p.nombre} className="img-fluid rounded border bg-white p-2" /></div>
        <div className="col-md-8">
          <dl className="row">
            <dt className="col-sm-4">Marca</dt><dd className="col-sm-8">{p.marca || '—'}</dd>
            <dt className="col-sm-4">Categoría</dt><dd className="col-sm-8">{p.categoria}</dd>
            <dt className="col-sm-4">Descripción</dt><dd className="col-sm-8">{p.descripcion || '—'}</dd>
            <dt className="col-sm-4">Precio</dt><dd className="col-sm-8"><Precio producto={p} /></dd>
            <dt className="col-sm-4">Stock</dt>
            <dd className={`col-sm-8 ${p.stock <= p.stockCritico ? 'text-danger fw-bold' : ''}`}>{p.stock} unidades (crítico: {p.stockCritico})</dd>
          </dl>
          <Link href={`/productos/${p.id}`} className="small">Ver en la tienda</Link>
        </div>
      </div>
    </>
  );
}
