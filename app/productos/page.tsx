'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import FiltrosProductos, { filtrarProductos } from '@/app/_components/tienda/FiltrosProductos';
import ListaProductos from '@/app/_components/tienda/ListaProductos';
import { useDatos } from '@/app/_lib/hooks/useDatos';
import { useAgregarAlCarrito } from '@/app/_lib/hooks/useAgregarAlCarrito';
import { categoriasDB, productosDB } from '@/app/_lib/data/db';
import { precioFinal } from '@/app/_lib/utils/formato';

function Productos() {
  const params = useSearchParams();
  const q = params.get('q') || '';
  const [filtros, setFiltros] = useState({ texto: q, categoria: '', orden: '' });
  const productos = useDatos(() => productosDB.listar());
  const categorias = useDatos(() => categoriasDB.listar());
  const agregar = useAgregarAlCarrito();

  useEffect(() => { setFiltros((f) => ({ ...f, texto: q })); }, [q]);

  const lista = filtrarProductos(productos, filtros, precioFinal);
  return (
    <>
      <h1 className="titulo-seccion">Productos</h1>
      <FiltrosProductos filtros={filtros} categorias={categorias} onCambiar={setFiltros}
        total={productos.length} mostrados={lista.length} />
      <ListaProductos productos={lista} onAgregar={agregar}
        mensajeVacio="No encontramos productos con esos filtros. Prueba con otra palabra o elige «Todas las categorías»." />
    </>
  );
}

/** useSearchParams() necesita un límite de Suspense en Next.js */
export default function PaginaProductos() {
  return (
    <Suspense>
      <Productos />
    </Suspense>
  );
}
