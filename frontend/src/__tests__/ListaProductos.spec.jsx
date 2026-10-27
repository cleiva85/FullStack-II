/* Pruebas de RENDERIZADO: la lista muestra todos los elementos del conjunto de datos. */
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ListaProductos from '../components/tienda/ListaProductos.jsx';
import { PRODUCTO_EJEMPLO } from '../test/utilidades.jsx';

const PRODUCTOS = [
  PRODUCTO_EJEMPLO,
  { ...PRODUCTO_EJEMPLO, id: 2, nombre: 'Leche Entera', categoria: 'Lácteos', precio: 990 },
  { ...PRODUCTO_EJEMPLO, id: 3, nombre: 'Galleta Triton', categoria: 'Galletas', precio: 850 },
];

const renderLista = (productos, props = {}) => render(
  <MemoryRouter><ListaProductos productos={productos} onAgregar={() => {}} {...props} /></MemoryRouter>,
);

describe('ListaProductos', () => {
  it('renderiza una tarjeta por cada producto', () => {
    renderLista(PRODUCTOS);
    expect(screen.getAllByRole('article').length).toBe(PRODUCTOS.length);
  });

  it('muestra el nombre de todos los productos', () => {
    renderLista(PRODUCTOS);
    PRODUCTOS.forEach((p) => expect(screen.getByText(p.nombre)).toBeTruthy());
  });

  it('muestra el mensaje de lista vacía cuando no hay productos', () => {
    renderLista([], { mensajeVacio: 'No encontramos productos' });
    expect(screen.queryAllByRole('article').length).toBe(0);
    expect(screen.getByText('No encontramos productos')).toBeTruthy();
  });
});
