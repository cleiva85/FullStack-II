/* =========================================================
   CarritoContext — estado global del carro de compras.
   Guarda [{ id, cantidad }] en localStorage y calcula el detalle
   y el total con los precios actuales de db.js.
   ========================================================= */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { productosDB } from '../data/db.js';
import { useDatos } from '../hooks/useDatos.js';
import {
  agregarItem, cambiarCantidad, quitarItem, detalleCarrito, totalCarrito, unidadesCarrito,
} from '../utils/carrito.js';

export const CLAVE_CARRITO = 'cyd_carrito';
const CarritoContext = createContext(null);

function leerCarrito() {
  try {
    const v = JSON.parse(localStorage.getItem(CLAVE_CARRITO));
    return Array.isArray(v) ? v : [];
  } catch { return []; }
}

export function CarritoProvider({ children }) {
  const [items, setItems] = useState(leerCarrito);
  const productos = useDatos(() => productosDB.listar());

  useEffect(() => {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(items));
  }, [items]);

  const detalle = useMemo(() => detalleCarrito(items, productos), [items, productos]);

  const valor = {
    items,
    detalle,
    unidades: unidadesCarrito(items),
    total: totalCarrito(detalle),
    agregar: (id, cantidad) => setItems((prev) => agregarItem(prev, id, cantidad)),
    cambiar: (id, delta) => setItems((prev) => cambiarCantidad(prev, id, delta)),
    quitar: (id) => setItems((prev) => quitarItem(prev, id)),
    vaciar: () => setItems([]),
  };
  return <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>;
}

export function useCarrito() {
  const ctx = useContext(CarritoContext);
  if (!ctx) throw new Error('useCarrito debe usarse dentro de <CarritoProvider>');
  return ctx;
}
