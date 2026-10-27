'use client';

import { clp, descuento, precioFinal } from '@/app/_lib/utils/formato';

/** Precio del producto; si está en oferta muestra el precio normal tachado y el % de descuento. */
export default function Precio({ producto, grande = false }) {
  const pct = descuento(producto);
  return (
    <div className={`precio ${grande ? 'precio-grande' : ''}`}>
      {pct > 0 && <span className="precio-anterior me-2">{clp(producto.precio)}</span>}
      <span className="precio-actual">{clp(precioFinal(producto))}</span>
      {pct > 0 && <span className="badge text-bg-danger ms-2">-{pct}%</span>}
    </div>
  );
}
