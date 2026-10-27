/* Pruebas de RENDERIZADO CONDICIONAL por rol: el panel admin solo se muestra a administradores. */
import { screen } from '@testing-library/react';
import RutaProtegida from '@/app/_components/comunes/RutaProtegida';
import { renderizar, iniciarSesionFalsa } from '@/__tests__/apoyo/utilidades';

const abrirPanel = () => renderizar(<RutaProtegida soloAdmin><p>panel-admin</p></RutaProtegida>, { pathname: '/admin' });

describe('RutaProtegida', () => {
  beforeEach(() => localStorage.clear());

  it('sin sesión no muestra el contenido y redirige a iniciar sesión', () => {
    const { router } = abrirPanel();
    expect(screen.queryByText('panel-admin')).toBeNull();
    expect(router.replace).toHaveBeenCalledWith('/login?next=%2Fadmin');
  });

  it('un cliente no puede entrar al panel y vuelve al inicio', () => {
    iniciarSesionFalsa({ rol: 'cliente' });
    const { router } = abrirPanel();
    expect(screen.queryByText('panel-admin')).toBeNull();
    expect(router.replace).toHaveBeenCalledWith('/');
  });

  it('un administrador ve el panel', () => {
    iniciarSesionFalsa({ rol: 'admin', nombre: 'Administrador' });
    const { router } = abrirPanel();
    expect(screen.getByText('panel-admin')).toBeTruthy();
    expect(router.replace).not.toHaveBeenCalled();
  });
});
