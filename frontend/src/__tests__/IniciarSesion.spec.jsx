/* Pruebas de FORMULARIO (estado al escribir), validación y login con el backend simulado (mock). */
import { screen, fireEvent } from '@testing-library/react';
import IniciarSesion from '../pages/tienda/IniciarSesion.jsx';
import { renderizar, respuestaJson } from '../test/utilidades.jsx';
import { CLAVE_SESION } from '../services/api.js';
import { restablecerBaseDatos } from '../data/db.js';

const destinos = { '/': 'pagina-inicio', '/admin': 'pagina-admin', '/checkout': 'pagina-checkout' };
const abrir = (ruta = '/login') => renderizar(<IniciarSesion />, { ruta, path: '/login', destinos });

function escribir(etiqueta, valor) {
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });
}

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

  it('con campos vacíos muestra errores y no llama al backend', () => {
    spyOn(window, 'fetch');
    abrir();
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    expect(screen.getByText('Ingresa tu usuario o correo.')).toBeTruthy();
    expect(screen.getByText('Ingresa tu contraseña.')).toBeTruthy();
    expect(window.fetch).not.toHaveBeenCalled();
  });

  it('con credenciales correctas guarda la sesión y vuelve al inicio', async () => {
    spyOn(window, 'fetch').and.callFake(() => respuestaJson({
      ok: true, token: 'abc', usuario: { usuario: 'ana_s', nombre: 'Ana', email: 'ana@correo.cl', rol: 'cliente' },
    }));
    abrir();
    escribir('Usuario o correo', 'ana_s');
    escribir('Contraseña', 'clave123');
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

    expect(await screen.findByText('pagina-inicio')).toBeTruthy();
    const [url, opciones] = window.fetch.calls.mostRecent().args;
    expect(url).toBe('/api/login');
    expect(JSON.parse(opciones.body)).toEqual({ clave: 'ana_s', password: 'clave123' });
    expect(JSON.parse(localStorage.getItem(CLAVE_SESION)).token).toBe('abc');
  });

  it('un administrador entra directo al panel', async () => {
    spyOn(window, 'fetch').and.callFake(() => respuestaJson({
      ok: true, token: 'xyz', usuario: { usuario: 'admin', nombre: 'Administrador', email: 'admin@cyd.cl', rol: 'admin' },
    }));
    abrir();
    escribir('Usuario o correo', 'admin');
    escribir('Contraseña', 'admin123');
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    expect(await screen.findByText('pagina-admin')).toBeTruthy();
  });

  it('respeta el parámetro next (por ejemplo, volver al checkout)', async () => {
    spyOn(window, 'fetch').and.callFake(() => respuestaJson({
      ok: true, token: 'abc', usuario: { usuario: 'ana_s', nombre: 'Ana', email: 'ana@correo.cl', rol: 'cliente' },
    }));
    abrir('/login?next=/checkout');
    escribir('Usuario o correo', 'ana_s');
    escribir('Contraseña', 'clave123');
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    expect(await screen.findByText('pagina-checkout')).toBeTruthy();
  });

  it('si el backend rechaza el login muestra su mensaje de error', async () => {
    spyOn(window, 'fetch').and.callFake(() => respuestaJson({ ok: false, error: 'Usuario o contraseña incorrectos.' }, 401));
    abrir();
    escribir('Usuario o correo', 'ana_s');
    escribir('Contraseña', 'mala');
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    expect((await screen.findByRole('alert')).textContent).toContain('Usuario o contraseña incorrectos.');
    expect(localStorage.getItem(CLAVE_SESION)).toBeNull();
  });
});
