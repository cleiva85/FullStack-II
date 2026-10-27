/* Pruebas de RENDERIZADO CONDICIONAL por rol: el panel admin solo se muestra a administradores. */
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import RutaProtegida from '../components/comunes/RutaProtegida.jsx';
import { SesionProvider } from '../context/SesionContext.jsx';
import { iniciarSesionFalsa } from '../test/utilidades.jsx';

function abrirPanel() {
  render(
    <MemoryRouter initialEntries={['/admin']}>
      <SesionProvider>
        <Routes>
          <Route path="/admin" element={<RutaProtegida soloAdmin><p>panel-admin</p></RutaProtegida>} />
          <Route path="/login" element={<p>pagina-login</p>} />
          <Route path="/" element={<p>pagina-inicio</p>} />
        </Routes>
      </SesionProvider>
    </MemoryRouter>,
  );
}

describe('RutaProtegida', () => {
  beforeEach(() => localStorage.clear());

  it('sin sesión redirige a iniciar sesión', () => {
    abrirPanel();
    expect(screen.getByText('pagina-login')).toBeTruthy();
    expect(screen.queryByText('panel-admin')).toBeNull();
  });

  it('un cliente no puede entrar al panel y vuelve al inicio', () => {
    iniciarSesionFalsa({ rol: 'cliente' });
    abrirPanel();
    expect(screen.getByText('pagina-inicio')).toBeTruthy();
  });

  it('un administrador ve el panel', () => {
    iniciarSesionFalsa({ rol: 'admin', nombre: 'Administrador' });
    abrirPanel();
    expect(screen.getByText('panel-admin')).toBeTruthy();
  });
});
