/* Pruebas del filtro de búsqueda: eventos del formulario y lógica de filtrado/orden. */
import { render, screen, fireEvent } from '@testing-library/react';
import FiltrosProductos, { filtrarProductos } from '../components/tienda/FiltrosProductos.tsx';
import { PRODUCTO_EJEMPLO } from '../test/utilidades.tsx';

const CATEGORIAS = [{ id: 1, nombre: 'Gaseosas' }, { id: 2, nombre: 'Lácteos' }];
const PRODUCTOS = [
  { ...PRODUCTO_EJEMPLO, id: 1, nombre: 'Coca-Cola', marca: 'Coca-Cola Co', categoria: 'Gaseosas', precio: 2500 },
  { ...PRODUCTO_EJEMPLO, id: 2, nombre: 'Leche Entera', marca: 'Colun', categoria: 'Lácteos', precio: 990 },
  { ...PRODUCTO_EJEMPLO, id: 3, nombre: 'Agua Mineral', marca: 'CCU', categoria: 'Gaseosas', precio: 1100 },
];
const VACIOS = { texto: '', categoria: '', orden: '' };

describe('FiltrosProductos (componente)', () => {
  it('avisa el texto escrito en el buscador conservando los demás filtros', () => {
    const onCambiar = jasmine.createSpy('onCambiar');
    render(<FiltrosProductos filtros={{ ...VACIOS, orden: 'nombre' }} categorias={CATEGORIAS} onCambiar={onCambiar} />);
    fireEvent.change(screen.getByLabelText('Buscar producto o marca'), { target: { value: 'leche' } });
    expect(onCambiar).toHaveBeenCalledWith({ texto: 'leche', categoria: '', orden: 'nombre' });
  });

  it('lista las categorías recibidas y avisa la elegida', () => {
    const onCambiar = jasmine.createSpy('onCambiar');
    render(<FiltrosProductos filtros={VACIOS} categorias={CATEGORIAS} onCambiar={onCambiar} />);
    const select = screen.getByLabelText('Categoría');
    expect(select.options.length).toBe(3); // "Todas" + 2 categorías
    fireEvent.change(select, { target: { value: 'Lácteos' } });
    expect(onCambiar).toHaveBeenCalledWith({ ...VACIOS, categoria: 'Lácteos' });
  });

  it('muestra el contador de resultados', () => {
    render(<FiltrosProductos filtros={VACIOS} categorias={CATEGORIAS} onCambiar={() => {}} total={57} mostrados={7} />);
    expect(screen.getByText('7 de 57 productos')).toBeTruthy();
  });
});

describe('filtrarProductos (lógica)', () => {
  it('busca por nombre o marca sin importar mayúsculas', () => {
    expect(filtrarProductos(PRODUCTOS, { ...VACIOS, texto: 'COLUN' }).map((p) => p.id)).toEqual([2]);
  });
  it('filtra por categoría', () => {
    expect(filtrarProductos(PRODUCTOS, { ...VACIOS, categoria: 'Gaseosas' }).map((p) => p.id)).toEqual([1, 3]);
  });
  it('ordena por precio y por nombre', () => {
    expect(filtrarProductos(PRODUCTOS, { ...VACIOS, orden: 'precio-asc' }).map((p) => p.id)).toEqual([2, 3, 1]);
    expect(filtrarProductos(PRODUCTOS, { ...VACIOS, orden: 'precio-desc' }).map((p) => p.id)).toEqual([1, 3, 2]);
    expect(filtrarProductos(PRODUCTOS, { ...VACIOS, orden: 'nombre' }).map((p) => p.nombre)).toEqual(['Agua Mineral', 'Coca-Cola', 'Leche Entera']);
  });
  it('no modifica la lista original', () => {
    const copia = [...PRODUCTOS];
    filtrarProductos(PRODUCTOS, { ...VACIOS, orden: 'precio-asc' });
    expect(PRODUCTOS).toEqual(copia);
  });
});
