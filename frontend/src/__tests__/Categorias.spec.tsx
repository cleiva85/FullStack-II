import { screen } from '@testing-library/react';
import Categorias from '../pages/tienda/Categorias.tsx';
import { productosDB, restablecerBaseDatos } from '../data/db.js';
import { renderizar } from '../test/utilidades.tsx';

describe('Categorias', () => {
  beforeEach(() => {
    localStorage.clear();
    restablecerBaseDatos();
  });

  it('muestra todos los productos juntos al seleccionar Todas', () => {
    renderizar(<Categorias />, { ruta: '/categorias', path: '/categorias' });

    expect(screen.getAllByTestId('lista-productos').length).toBe(1);
    expect(screen.getAllByRole('article').length).toBe(productosDB.listar().length);
  });
});