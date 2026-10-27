'use client';

import ListaProductos from '@/app/_components/tienda/ListaProductos';
import { useDatos } from '@/app/_lib/hooks/useDatos';
import { useAgregarAlCarrito } from '@/app/_lib/hooks/useAgregarAlCarrito';
import { productosDB } from '@/app/_lib/data/db';

export default function Ofertas() {
  const ofertas = useDatos(() => productosDB.enOferta());
  const agregar = useAgregarAlCarrito();
  return (
    <>
      <h1 className="titulo-seccion">Ofertas</h1>
      <p className="texto-suave">Precios rebajados por tiempo limitado o hasta agotar stock.</p>
      <ListaProductos productos={ofertas} onAgregar={agregar} mensajeVacio="No hay ofertas vigentes en este momento." />
    </>
  );
}
