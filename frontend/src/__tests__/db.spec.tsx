/* Pruebas del archivo de datos (db.js): operaciones CRUD sobre la base simulada. */
import {
  productosDB, categoriasDB, ordenesDB, usuariosDB, restablecerBaseDatos, suscribir,
} from '../data/db.js';
import { PRODUCTOS_BASE } from '../data/semilla.js';

describe('db.js', () => {
  beforeEach(() => {
    localStorage.clear();
    restablecerBaseDatos();
  });

  describe('productosDB (CRUD)', () => {
    it('listar devuelve los productos de la semilla', () => {
      expect(productosDB.listar().length).toBe(PRODUCTOS_BASE.length);
    });

    it('crear asigna un id nuevo y lo guarda', () => {
      const nuevo = productosDB.crear({ nombre: 'Jugo Prueba', categoria: 'Aguas y Jugos', precio: 1000, stock: 5 });
      expect(nuevo.id).toBe(Math.max(...PRODUCTOS_BASE.map((p) => p.id)) + 1);
      expect(productosDB.obtener(nuevo.id).nombre).toBe('Jugo Prueba');
    });

    it('actualizar cambia los datos pero no el id', () => {
      const r = productosDB.actualizar(1, { precio: 2700, id: 999 });
      expect(r.id).toBe(1);
      expect(productosDB.obtener(1).precio).toBe(2700);
    });

    it('actualizar o eliminar un id inexistente no hace nada', () => {
      expect(productosDB.actualizar(12345, { precio: 1 })).toBeNull();
      expect(productosDB.eliminar(12345)).toBe(false);
    });

    it('eliminar quita el producto', () => {
      expect(productosDB.eliminar(1)).toBe(true);
      expect(productosDB.obtener(1)).toBeNull();
    });

    it('enOferta y criticos filtran correctamente', () => {
      expect(productosDB.enOferta().every((p) => p.oferta < p.precio)).toBe(true);
      expect(productosDB.criticos().every((p) => p.stock <= p.stockCritico)).toBe(true);
      expect(productosDB.criticos().length).toBeGreaterThan(0);
    });

    it('verificarStock detecta cuando no alcanza y descontarStock descuenta', () => {
      const p = productosDB.obtener(2);
      expect(productosDB.verificarStock([{ id: 2, cantidad: p.stock + 1 }])).toContain('Stock insuficiente');
      expect(productosDB.verificarStock([{ id: 2, cantidad: 1 }])).toBeNull();
      productosDB.descontarStock([{ id: 2, cantidad: 3 }]);
      expect(productosDB.obtener(2).stock).toBe(p.stock - 3);
    });
  });

  describe('categoriasDB', () => {
    it('no permite eliminar una categoría con productos', () => {
      const gaseosas = categoriasDB.listar().find((c) => c.nombre === 'Gaseosas');
      expect(categoriasDB.eliminar(gaseosas.id)).toBe(false);
    });

    it('al renombrar una categoría mueve sus productos', () => {
      const gaseosas = categoriasDB.listar().find((c) => c.nombre === 'Gaseosas');
      const cantidad = productosDB.porCategoria('Gaseosas').length;
      categoriasDB.actualizar(gaseosas.id, { nombre: 'Bebidas' });
      expect(productosDB.porCategoria('Bebidas').length).toBe(cantidad);
      expect(productosDB.porCategoria('Gaseosas').length).toBe(0);
    });
  });

  describe('ordenesDB y usuariosDB', () => {
    it('crear una orden le asigna número correlativo y fecha', () => {
      const ultimo = Math.max(...ordenesDB.listar().map((o) => o.numero));
      const o = ordenesDB.crear({ estado: 'Pagada', cliente: { correo: 'x@y.cl' }, items: [], total: 0 });
      expect(o.numero).toBe(ultimo + 1);
      expect(Number.isNaN(Date.parse(o.fecha))).toBe(false);
      expect(ordenesDB.porNumero(o.numero).id).toBe(o.id);
    });

    it('busca órdenes y usuarios por correo sin importar mayúsculas', () => {
      expect(ordenesDB.porCliente('ANA@correo.cl').length).toBeGreaterThan(0);
      expect(usuariosDB.porCorreo('Admin@CYD.cl').rol).toBe('admin');
    });
  });

  it('avisa a los suscriptores cuando cambian los datos', () => {
    const oyente = jasmine.createSpy('oyente');
    const desuscribir = suscribir(oyente);
    productosDB.actualizar(1, { stock: 1 });
    expect(oyente).toHaveBeenCalledWith('productos');
    desuscribir();
    productosDB.actualizar(1, { stock: 2 });
    expect(oyente).toHaveBeenCalledTimes(1);
  });

  it('recupera la semilla si el dato guardado está dañado', () => {
    localStorage.setItem('cyd_db_productos', '{dañado');
    expect(productosDB.listar().length).toBe(PRODUCTOS_BASE.length);
  });
});
