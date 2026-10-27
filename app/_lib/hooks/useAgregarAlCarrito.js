'use client';

import { useCarrito } from '@/app/_context/CarritoContext';
import { useAviso } from '@/app/_context/AvisoContext';

/** Agrega al carro y muestra el aviso "N × producto agregado(s)". */
export function useAgregarAlCarrito() {
  const { agregar } = useCarrito();
  const aviso = useAviso();
  return (producto, cantidad) => {
    agregar(producto.id, cantidad);
    aviso(`${cantidad} × ${producto.nombre} ${cantidad === 1 ? 'agregado' : 'agregados'} al carro`);
  };
}
