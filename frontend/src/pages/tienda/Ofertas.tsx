import ListaProductos from '../../components/tienda/ListaProductos.tsx';
import { useDatos } from '../../hooks/useDatos.js';
import { useAgregarAlCarrito } from '../../hooks/useAgregarAlCarrito.js';
import { productosDB } from '../../data/db.js';

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
