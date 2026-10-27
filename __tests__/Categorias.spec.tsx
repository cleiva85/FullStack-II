import { screen } from '@testing-library/react';
import Categorias from '@/app/categorias/page';
import { categoriasDB, productosDB, restablecerBaseDatos } from '@/app/_lib/data/db';
import { renderizar } from '@/__tests__/apoyo/utilidades';

describe('Categorias', () => {
  beforeEach(() => {
    localStorage.clear();
    restablecerBaseDatos();
  });

  it('muestra todos los productos juntos al seleccionar Todas', () => {
    renderizar(<Categorias />, { pathname: '/categorias' });

    expect(screen.getAllByTestId('lista-productos').length).toBe(1);
    expect(screen.getAllByRole('article').length).toBe(productosDB.listar().length);
  });

  it('con una categoría en la URL muestra solo sus productos', () => {
    const lacteos = categoriasDB.porSlug('lacteos');
    renderizar(<Categorias />, { pathname: '/categorias/lacteos', params: { slug: 'lacteos' } });
    expect(screen.getAllByRole('article').length).toBe(productosDB.porCategoria(lacteos.nombre).length);
  });

  it('avisa si la categoría de la URL no existe', () => {
    renderizar(<Categorias />, { pathname: '/categorias/no-existe', params: { slug: 'no-existe' } });
    expect(screen.getByText('Esa categoría no existe. Elige una de la lista.')).toBeTruthy();
  });
});
