/* =========================================================
   db.js — "Base de datos" simulada del frontend.
   Cada tabla (productos, categorias, usuarios, ordenes) se guarda
   en localStorage y expone operaciones CRUD:
     listar · obtener · crear · actualizar · eliminar
   Los componentes se suscriben (suscribir / hook useDatos) para
   refrescarse en tiempo real cuando los datos cambian.
   ========================================================= */
import { PRODUCTOS_BASE, CATEGORIAS_BASE, USUARIOS_BASE, ORDENES_BASE } from './semilla.js';

const PREFIJO = 'cyd_db_';
const SEMILLAS = {
  productos: PRODUCTOS_BASE,
  categorias: CATEGORIAS_BASE,
  usuarios: USUARIOS_BASE,
  ordenes: ORDENES_BASE,
};

const copiar = (v) => JSON.parse(JSON.stringify(v));
const oyentes = new Set();

/* ---------- Persistencia ---------- */
function leer(tabla) {
  try {
    const crudo = localStorage.getItem(PREFIJO + tabla);
    if (crudo) return JSON.parse(crudo);
  } catch { /* dato corrupto: se vuelve a la semilla */ }
  const inicial = copiar(SEMILLAS[tabla]);
  localStorage.setItem(PREFIJO + tabla, JSON.stringify(inicial));
  return inicial;
}

function escribir(tabla, filas) {
  localStorage.setItem(PREFIJO + tabla, JSON.stringify(filas));
  oyentes.forEach((fn) => fn(tabla));
}

/** Avisa cada vez que una tabla cambia. Devuelve la función para desuscribirse. */
export function suscribir(fn) {
  oyentes.add(fn);
  return () => oyentes.delete(fn);
}

/** Vuelve todas las tablas a los datos de semilla.js */
export function restablecerBaseDatos() {
  Object.keys(SEMILLAS).forEach((t) => escribir(t, copiar(SEMILLAS[t])));
}

/* ---------- CRUD genérico ---------- */
function crearTabla(tabla) {
  return {
    listar() {
      return leer(tabla);
    },
    obtener(id) {
      return leer(tabla).find((f) => f.id === Number(id)) || null;
    },
    crear(datos) {
      const filas = leer(tabla);
      const id = filas.reduce((max, f) => Math.max(max, f.id), 0) + 1;
      const nueva = { ...copiar(datos), id };
      filas.push(nueva);
      escribir(tabla, filas);
      return nueva;
    },
    actualizar(id, cambios) {
      const filas = leer(tabla);
      const i = filas.findIndex((f) => f.id === Number(id));
      if (i === -1) return null;
      filas[i] = { ...filas[i], ...copiar(cambios), id: filas[i].id };
      escribir(tabla, filas);
      return filas[i];
    },
    eliminar(id) {
      const filas = leer(tabla);
      const restantes = filas.filter((f) => f.id !== Number(id));
      if (restantes.length === filas.length) return false;
      escribir(tabla, restantes);
      return true;
    },
  };
}

/* ---------- Productos ---------- */
const tablaProductos = crearTabla('productos');
export const productosDB = {
  ...tablaProductos,
  enOferta() {
    return leer('productos').filter((p) => p.oferta != null && p.oferta < p.precio);
  },
  porCategoria(nombre) {
    return leer('productos').filter((p) => p.categoria === nombre);
  },
  /** Productos con stock igual o menor a su stock crítico */
  criticos() {
    return leer('productos').filter((p) => p.stock <= (p.stockCritico ?? 10));
  },
  buscar(texto) {
    const q = String(texto || '').trim().toLowerCase();
    if (!q) return leer('productos');
    return leer('productos').filter((p) =>
      `${p.nombre} ${p.marca} ${p.categoria}`.toLowerCase().includes(q));
  },
  /** Revisa si alcanza el stock para una lista de {id, cantidad}. Devuelve el primer problema o null. */
  verificarStock(items) {
    for (const it of items) {
      const p = this.obtener(it.id);
      if (!p) return `El producto ${it.nombre || it.id} ya no está disponible.`;
      if (p.stock < it.cantidad) return `Stock insuficiente de ${p.nombre} (quedan ${p.stock}).`;
    }
    return null;
  },
  descontarStock(items) {
    const filas = leer('productos');
    items.forEach((it) => {
      const p = filas.find((f) => f.id === it.id);
      if (p) p.stock = Math.max(0, p.stock - it.cantidad);
    });
    escribir('productos', filas);
  },
};

/* ---------- Categorías ---------- */
const tablaCategorias = crearTabla('categorias');
export const categoriasDB = {
  ...tablaCategorias,
  porSlug(slug) {
    return leer('categorias').find((c) => c.slug === slug) || null;
  },
  /** Al renombrar una categoría también se actualizan sus productos */
  actualizar(id, cambios) {
    const anterior = tablaCategorias.obtener(id);
    const nueva = tablaCategorias.actualizar(id, cambios);
    if (anterior && nueva && anterior.nombre !== nueva.nombre) {
      const filas = leer('productos').map((p) =>
        (p.categoria === anterior.nombre ? { ...p, categoria: nueva.nombre } : p));
      escribir('productos', filas);
    }
    return nueva;
  },
  /** No se puede eliminar una categoría que todavía tiene productos */
  eliminar(id) {
    const c = tablaCategorias.obtener(id);
    if (!c || productosDB.porCategoria(c.nombre).length) return false;
    return tablaCategorias.eliminar(id);
  },
};

/* ---------- Usuarios ---------- */
const tablaUsuarios = crearTabla('usuarios');
export const usuariosDB = {
  ...tablaUsuarios,
  porCorreo(correo) {
    const c = String(correo || '').toLowerCase();
    return leer('usuarios').find((u) => u.correo.toLowerCase() === c) || null;
  },
};

/* ---------- Órdenes ---------- */
const tablaOrdenes = crearTabla('ordenes');
export const ordenesDB = {
  ...tablaOrdenes,
  /** Crea la orden asignándole número y fecha */
  crear(datos) {
    const filas = leer('ordenes');
    const ultimo = filas.reduce((max, o) => Math.max(max, o.numero), 20261000);
    return tablaOrdenes.crear({ ...datos, numero: ultimo + 1, fecha: new Date().toISOString() });
  },
  porNumero(numero) {
    return leer('ordenes').find((o) => o.numero === Number(numero)) || null;
  },
  porCliente(correo) {
    const c = String(correo || '').toLowerCase();
    return leer('ordenes').filter((o) => o.cliente?.correo?.toLowerCase() === c);
  },
};
