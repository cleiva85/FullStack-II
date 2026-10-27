/* =========================================================
   semilla.js — datos iniciales de la "base de datos" simulada.
   Los datos están en db.json (raíz del proyecto); db.js los copia a
   localStorage la primera vez que se abre la app.
   Para volver a estos datos: Panel admin → Perfil → "Restablecer datos".
   ========================================================= */
import datos from '@/db.json';

/** Cambia este número cada vez que modifiques db.json: db.js recarga los datos solo. */
export const VERSION_SEMILLA = 4;

export const PRODUCTOS_BASE = datos.productos;
export const CATEGORIAS_BASE = datos.categorias;
export const USUARIOS_BASE = datos.usuarios;
export const ORDENES_BASE = datos.ordenes;
export const MENSAJES_BASE = datos.mensajes;
