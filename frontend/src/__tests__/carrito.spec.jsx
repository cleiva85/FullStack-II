/* Pruebas de la LÓGICA del carro (funciones puras de utils/carrito.js). */
import {
  agregarItem, cambiarCantidad, quitarItem, detalleCarrito, totalCarrito, unidadesCarrito,
} from '../utils/carrito.js';
import { PRODUCTO_EJEMPLO } from '../test/utilidades.jsx';

const PRODUCTOS = [
  { ...PRODUCTO_EJEMPLO, id: 1, precio: 2500, oferta: 2190 },
  { ...PRODUCTO_EJEMPLO, id: 2, nombre: 'Leche Entera', precio: 990, oferta: null },
];

describe('utils/carrito', () => {
  it('agrega un producto nuevo con la cantidad indicada', () => {
    expect(agregarItem([], 1, 3)).toEqual([{ id: 1, cantidad: 3 }]);
  });

  it('si el producto ya está, suma la cantidad', () => {
    expect(agregarItem([{ id: 1, cantidad: 2 }], 1, 5)).toEqual([{ id: 1, cantidad: 7 }]);
  });

  it('limita cada agregado a entre 1 y 99 unidades', () => {
    expect(agregarItem([], 1, 500)).toEqual([{ id: 1, cantidad: 99 }]);
    expect(agregarItem([], 1, 0)).toEqual([{ id: 1, cantidad: 1 }]);
  });

  it('no modifica el arreglo original (inmutabilidad para React)', () => {
    const original = [{ id: 1, cantidad: 1 }];
    agregarItem(original, 1, 1);
    expect(original).toEqual([{ id: 1, cantidad: 1 }]);
  });

  it('cambiarCantidad quita el producto cuando llega a 0', () => {
    expect(cambiarCantidad([{ id: 1, cantidad: 1 }, { id: 2, cantidad: 4 }], 1, -1)).toEqual([{ id: 2, cantidad: 4 }]);
  });

  it('quitarItem elimina solo el producto indicado', () => {
    expect(quitarItem([{ id: 1, cantidad: 1 }, { id: 2, cantidad: 1 }], 2)).toEqual([{ id: 1, cantidad: 1 }]);
  });

  it('el detalle usa el precio de oferta y descarta productos que ya no existen', () => {
    const detalle = detalleCarrito([{ id: 1, cantidad: 2 }, { id: 2, cantidad: 3 }, { id: 99, cantidad: 1 }], PRODUCTOS);
    expect(detalle.length).toBe(2);
    expect(detalle[0].precioUnitario).toBe(2190);
    expect(detalle[0].subtotal).toBe(4380);
    expect(totalCarrito(detalle)).toBe(4380 + 2970);
  });

  it('cuenta las unidades totales', () => {
    expect(unidadesCarrito([{ id: 1, cantidad: 2 }, { id: 2, cantidad: 3 }])).toBe(5);
  });
});
