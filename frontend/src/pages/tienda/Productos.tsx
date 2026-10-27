import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import FiltrosProductos, { filtrarProductos } from '../../components/tienda/FiltrosProductos.tsx';
import ListaProductos from '../../components/tienda/ListaProductos.tsx';
import { useDatos } from '../../hooks/useDatos.js';
import { useAgregarAlCarrito } from '../../hooks/useAgregarAlCarrito.js';
import { categoriasDB, productosDB } from '../../data/db.js';
import { precioFinal } from '../../utils/formato.js';

export default function Productos() {
  const [params] = useSearchParams();
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
