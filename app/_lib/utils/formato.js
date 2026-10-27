/* Funciones de formato y precios usadas en toda la app */

/** 2500 → "$2.500" */
export const clp = (n) => '$' + Math.round(Number(n) || 0).toLocaleString('es-CL');

/** Precio que realmente paga el cliente (el de oferta si existe) */
export const precioFinal = (p) => (p && p.oferta != null && p.oferta < p.precio ? p.oferta : p?.precio ?? 0);

/** % de descuento redondeado; 0 si no está en oferta */
export const descuento = (p) =>
  (p && p.oferta != null && p.oferta < p.precio ? Math.round((1 - p.oferta / p.precio) * 100) : 0);

/** ISO → "05-10-2026 14:20" */
export const fechaHora = (iso) =>
  new Date(iso).toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' });

/** "Aguas y Jugos" → "aguas-y-jugos" */
export const slugificar = (texto) =>
  String(texto || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
