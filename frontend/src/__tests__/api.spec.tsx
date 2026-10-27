/* Pruebas del servicio de API usando MOCKS de fetch (no necesitan el backend encendido). */
import { api, pedir, CLAVE_SESION } from '../services/api.js';
import { respuestaJson } from '../test/utilidades.tsx';

describe('services/api', () => {
  beforeEach(() => localStorage.clear());

  it('envía el token de la sesión en el encabezado Authorization', async () => {
    localStorage.setItem(CLAVE_SESION, JSON.stringify({ token: 'abc123' }));
    spyOn(window, 'fetch').and.callFake(() => respuestaJson({ ok: true, pedidos: [] }));
    await api.misPedidos();
    const [url, opciones] = window.fetch.calls.mostRecent().args;
    expect(url).toBe('/api/pedidos');
    expect(opciones.method).toBe('GET');
    expect(opciones.headers.Authorization).toBe('Bearer abc123');
  });

  it('sin sesión no envía Authorization', async () => {
    spyOn(window, 'fetch').and.callFake(() => respuestaJson({}));
    await api.regiones();
    expect(window.fetch.calls.mostRecent().args[1].headers.Authorization).toBeUndefined();
  });

  it('marca ok:false y conserva el status cuando el backend responde con error', async () => {
    spyOn(window, 'fetch').and.callFake(() => respuestaJson({ ok: false, error: 'RUT no válido.' }, 400));
    const r = await api.registrar({ rut: '1' });
    expect(r.ok).toBe(false);
    expect(r.status).toBe(400);
    expect(r.error).toBe('RUT no válido.');
  });

  it('si el servidor está apagado devuelve un mensaje claro en vez de fallar', async () => {
    spyOn(window, 'fetch').and.callFake(() => Promise.reject(new TypeError('Failed to fetch')));
    const r = await pedir('GET', '/api/sesion');
    expect(r.ok).toBe(false);
    expect(r.status).toBe(0);
    expect(r.error).toContain('npm start');
  });
});
