/* Pruebas de FORMULARIO (estado al escribir), validación y login contra los usuarios de db.js. */
import { screen, fireEvent } from '@testing-library/react';
import IniciarSesion from '@/app/login/page';
import { renderizar } from '@/__tests__/apoyo/utilidades';
import { CLAVE_SESION } from '@/app/_context/SesionContext';
import { restablecerBaseDatos } from '@/app/_lib/data/db';
import { esperarLlamada } from '@/__tests__/apoyo/esperar';

const abrir = (search = '') => renderizar(<IniciarSesion />, { pathname: '/login', search });
const escribir = (etiqueta, valor) => fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });
/** Espera a que la página navegue (waitFor envuelve los cambios de estado en act) y lo confirma */
const esperarNavegacion = async (router, destino) => {
  await esperarLlamada(router.push, destino);
  expect(router.push).toHaveBeenCalledWith(destino);
};

describe('IniciarSesion', () => {
  beforeEach(() => {
    localStorage.clear();
    restablecerBaseDatos();
  });

  it('el estado del formulario cambia cuando el usuario escribe', () => {
    abrir();
    escribir('Usuario o correo', 'ana_s');
    escribir('Contraseña', 'clave123');
    expect(screen.getByLabelText('Usuario o correo').value).toBe('ana_s');
    expect(screen.getByLabelText('Contraseña').value).toBe('clave123');
  });

  it('con campos vacíos muestra los errores', () => {
    const { router } = abrir();
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    expect(screen.getByText('Ingresa tu usuario o correo.')).toBeTruthy();
    expect(screen.getByText('Ingresa tu contraseña.')).toBeTruthy();
    expect(router.push).not.toHaveBeenCalled();
  });

  it('con credenciales correctas guarda la sesión (sin la contraseña) y vuelve al inicio', async () => {
    const { router } = abrir();
    escribir('Usuario o correo', 'ana_s');
    escribir('Contraseña', 'clave123');
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    await esperarNavegacion(router, '/');
    const sesion = JSON.parse(localStorage.getItem(CLAVE_SESION));
    expect(sesion.usuario.nombre).toBe('Ana');
    expect(sesion.usuario.password).toBeUndefined();
  });

  it('también acepta el correo y un administrador entra directo al panel', async () => {
    const { router } = abrir();
    escribir('Usuario o correo', 'ADMIN@cyd.cl');
    escribir('Contraseña', 'admin123');
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    await esperarNavegacion(router, '/admin');
  });

  it('respeta el parámetro next (por ejemplo, volver al checkout)', async () => {
    const { router } = abrir('?next=/checkout');
    escribir('Usuario o correo', 'ana_s');
    escribir('Contraseña', 'clave123');
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    await esperarNavegacion(router, '/checkout');
  });

  it('con una contraseña incorrecta muestra el error y no inicia sesión', async () => {
    const { router } = abrir();
    escribir('Usuario o correo', 'ana_s');
    escribir('Contraseña', 'mala123');
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    expect((await screen.findByRole('alert')).textContent).toContain('Usuario o contraseña incorrectos.');
    expect(localStorage.getItem(CLAVE_SESION)).toBeNull();
    expect(router.push).not.toHaveBeenCalled();
  });

  it('muestra el enlace para recuperar la contraseña', () => {
    abrir();
    expect(screen.getByRole('link', { name: '¿Olvidaste tu contraseña?' }).getAttribute('href')).toBe('/recuperar-contrasena');
  });
});
