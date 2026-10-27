'use client';

import { usePathname } from 'next/navigation';
import Encabezado from '@/app/_components/tienda/Encabezado';
import PiePagina from '@/app/_components/tienda/PiePagina';

/**
 * Estructura común de la tienda: encabezado, contenido de cada página y pie.
 * El panel de administración (/admin) tiene su propio diseño (app/admin/layout.tsx).
 */
export default function LayoutTienda({ children }) {
  const ruta = usePathname() || '/';
  if (ruta === '/admin' || ruta.startsWith('/admin/')) return children;
  return (
    <div className="tienda d-flex flex-column min-vh-100">
      <Encabezado />
      <main className="container flex-grow-1 py-4">{children}</main>
      <PiePagina />
    </div>
  );
}
