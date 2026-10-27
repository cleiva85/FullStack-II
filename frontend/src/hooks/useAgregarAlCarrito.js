import { useCarrito } from '../context/CarritoContext.jsx';
import { useAviso } from '../context/AvisoContext.jsx';

/** Agrega al carro y muestra el aviso "N × producto agregado(s)". */
export function useAgregarAlCarrito() {
  const { agregar } = useCarrito();
  const aviso = useAviso();
  return (producto, cantidad) => {
    agregar(producto.id, cantidad);
    aviso(`${cantidad} × ${producto.nombre} ${cantidad === 1 ? 'agregado' : 'agregados'} al carro`);
  };
}
