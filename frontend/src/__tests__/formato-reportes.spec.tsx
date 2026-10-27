/* Pruebas de funciones de formato y de los cálculos de reportes del panel admin. */
import { clp, precioFinal, descuento, slugificar } from '../utils/formato.js';
import { resumenVentas, topProductos, ventasPorCategoria, inventarioPorCategoria } from '../utils/reportes.js';

const ORDENES = [
  { estado: 'Pagada', total: 5000, items: [{ id: 1, nombre: 'Coca-Cola', precio: 2000, cantidad: 2 }, { id: 2, nombre: 'Leche', precio: 1000, cantidad: 1 }] },
  { estado: 'Pagada', total: 4000, items: [{ id: 2, nombre: 'Leche', precio: 1000, cantidad: 4 }] },
  { estado: 'Rechazada', total: 9000, items: [{ id: 1, nombre: 'Coca-Cola', precio: 2000, cantidad: 9 }] },
];
const PRODUCTOS = [
  { id: 1, categoria: 'Gaseosas', precio: 2000, stock: 5, stockCritico: 10 },
  { id: 2, categoria: 'Lácteos', precio: 1000, stock: 20, stockCritico: 10 },
];

describe('utils/formato', () => {
  it('formatea pesos chilenos', () => {
    expect(clp(2500)).toBe('$2.500');
    expect(clp(1234567)).toBe('$1.234.567');
    expect(clp(0)).toBe('$0');
  });
  it('calcula el precio final y el descuento', () => {
    expect(precioFinal({ precio: 2500, oferta: 2000 })).toBe(2000);
    expect(precioFinal({ precio: 2500, oferta: null })).toBe(2500);
    expect(descuento({ precio: 2500, oferta: 2000 })).toBe(20);
    expect(descuento({ precio: 2500, oferta: 3000 })).toBe(0);
  });
  it('genera direcciones (slug) sin tildes ni espacios', () => {
    expect(slugificar('Aguas y Jugos')).toBe('aguas-y-jugos');
    expect(slugificar('Lácteos')).toBe('lacteos');
  });
});

describe('utils/reportes', () => {
  it('resume solo las órdenes pagadas', () => {
    expect(resumenVentas(ORDENES)).toEqual({ pagadas: 2, rechazadas: 1, monto: 9000, ticketPromedio: 4500 });
    expect(resumenVentas([]).ticketPromedio).toBe(0);
  });
  it('ordena los productos más vendidos por monto', () => {
    const top = topProductos(ORDENES);
    expect(top.map((p) => p.id)).toEqual([2, 1]);
    expect(top[0]).toEqual({ id: 2, nombre: 'Leche', unidades: 5, monto: 5000 });
  });
  it('agrupa ventas e inventario por categoría', () => {
    expect(ventasPorCategoria(ORDENES, PRODUCTOS)).toEqual([
      { categoria: 'Lácteos', monto: 5000 }, { categoria: 'Gaseosas', monto: 4000 },
    ]);
    const inv = inventarioPorCategoria(PRODUCTOS);
    expect(inv.find((f) => f.categoria === 'Gaseosas')).toEqual({ categoria: 'Gaseosas', productos: 1, unidades: 5, valor: 10000, criticos: 1 });
  });
});
