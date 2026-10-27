import { Outlet } from 'react-router-dom';
import Encabezado from './Encabezado.jsx';
import PiePagina from './PiePagina.jsx';

/** Estructura común de la tienda: encabezado, contenido de cada página y pie. */
export default function LayoutTienda() {
  return (
    <div className="tienda d-flex flex-column min-vh-100">
      <Encabezado />
      <main className="container flex-grow-1 py-4">
        <Outlet />
      </main>
      <PiePagina />
    </div>
  );
}
