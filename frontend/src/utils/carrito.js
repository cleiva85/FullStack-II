/* =========================================================
   carrito.js — lógica pura del carro (sin React).
   El carro guarda solo [{ id, cantidad }]; precios y nombres
   se leen siempre desde la base de datos de productos.
   ========================================================= */
import { precioFinal } from './formato.js';

export const MAX_POR_PRODUCTO = 999;

export function agregarItem(items, id, cantidad = 1) {
  const n = Math.max(1, Math.min(99, parseInt(cantidad, 10) || 1));
  const existe = items.find((i) => i.id === id);
  if (existe) {
    return items.map((i) => (i.id === id ? { ...i, cantidad: Math.min(MAX_POR_PRODUCTO, i.cantidad + n) } : i));
  }
  return [...items, { id, cantidad: n }];
}

export function cambiarCantidad(items, id, delta) {
  return items
    .map((i) => (i.id === id ? { ...i, cantidad: Math.min(MAX_POR_PRODUCTO, i.cantidad + delta) } : i))
    .filter((i) => i.cantidad > 0);
}

export const quitarItem = (items, id) => items.filter((i) => i.id !== id);

/** Une el carro con los productos: [{ ...producto, cantidad, precioUnitario, subtotal }] */
export function detalleCarrito(items, productos) {
  return items
    .map((i) => {
      const p = productos.find((x) => x.id === i.id);
      if (!p) return null;
      const precioUnitario = precioFinal(p);
      return { ...p, cantidad: i.cantidad, precioUnitario, subtotal: precioUnitario * i.cantidad };
    })
    .filter(Boolean);
}

export const totalCarrito = (detalle) => detalle.reduce((s, i) => s + i.subtotal, 0);
export const unidadesCarrito = (items) => items.reduce((n, i) => n + i.cantidad, 0);

export const COSTO_DESPACHO = 2990;
