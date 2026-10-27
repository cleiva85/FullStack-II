/* Cálculos para el dashboard y los reportes del panel de administración */

export function resumenVentas(ordenes) {
  const pagadas = ordenes.filter((o) => o.estado === 'Pagada');
  const monto = pagadas.reduce((s, o) => s + o.total, 0);
  return {
    pagadas: pagadas.length,
    rechazadas: ordenes.length - pagadas.length,
    monto,
    ticketPromedio: pagadas.length ? Math.round(monto / pagadas.length) : 0,
  };
}

/** Unidades y monto vendidos por producto, de mayor a menor monto */
export function topProductos(ordenes, limite = 5) {
  const mapa = new Map();
  ordenes.filter((o) => o.estado === 'Pagada').forEach((o) => o.items.forEach((i) => {
    const actual = mapa.get(i.id) || { id: i.id, nombre: i.nombre, unidades: 0, monto: 0 };
    actual.unidades += i.cantidad;
    actual.monto += i.precio * i.cantidad;
    mapa.set(i.id, actual);
  }));
  return [...mapa.values()].sort((a, b) => b.monto - a.monto).slice(0, limite);
}

/** Monto vendido por categoría (usa la categoría actual de cada producto) */
export function ventasPorCategoria(ordenes, productos) {
  const mapa = {};
  ordenes.filter((o) => o.estado === 'Pagada').forEach((o) => o.items.forEach((i) => {
    const cat = productos.find((p) => p.id === i.id)?.categoria || 'Sin categoría';
    mapa[cat] = (mapa[cat] || 0) + i.precio * i.cantidad;
  }));
  return Object.entries(mapa).map(([categoria, monto]) => ({ categoria, monto })).sort((a, b) => b.monto - a.monto);
}

/** Productos, unidades en stock y valor del inventario por categoría */
export function inventarioPorCategoria(productos) {
  const mapa = {};
  productos.forEach((p) => {
    const f = mapa[p.categoria] || { categoria: p.categoria, productos: 0, unidades: 0, valor: 0, criticos: 0 };
    f.productos += 1;
    f.unidades += p.stock;
    f.valor += p.stock * p.precio;
    if (p.stock <= (p.stockCritico ?? 10)) f.criticos += 1;
    mapa[p.categoria] = f;
  });
  return Object.values(mapa).sort((a, b) => a.categoria.localeCompare(b.categoria, 'es'));
}
