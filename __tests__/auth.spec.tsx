/* Pruebas del servicio de cuentas (services/auth.js): registro, login y recuperación con MOCKS
   del correo (spyOn servicioCorreo.enviarCodigo) y del reloj (spyOn Date.now). */
import {
  registrarUsuario, iniciarSesion, solicitarCodigo, restablecerContrasena, crearCredencial, verificarCredencial, CODIGO_MINUTOS,
} from '@/app/_lib/services/auth';
import { servicioCorreo } from '@/app/_lib/services/correo';
import { usuariosDB, restablecerBaseDatos } from '@/app/_lib/data/db';

const NUEVO = {
  rut: '15.234.567-4', nombre: 'Claudia', apellido: 'Leiva', usuario: 'claudia_l', email: 'claudia@correo.cl',
  telefono: '912345678', direccion: 'Pajaritos 1000', region: 'Metropolitana de Santiago', comuna: 'Maipú', password: 'clave123',
};

describe('services/auth', () => {
  beforeEach(() => {
    localStorage.clear();
    restablecerBaseDatos();
    spyOn(servicioCorreo, 'enviarCodigo').and.returnValue(Promise.resolve({ ok: true, simulado: true }));
  });

  it('cifra las contraseñas con sal: el mismo texto da resultados distintos', async () => {
    const a = await crearCredencial('clave123');
    const b = await crearCredencial('clave123');
    expect(a).not.toBe(b);
    expect(a).not.toContain('clave123');
    expect(await verificarCredencial('clave123', a)).toBe(true);
    expect(await verificarCredencial('otra', a)).toBe(false);
  });

  it('registra un usuario nuevo y puede iniciar sesión con usuario o correo', async () => {
    expect((await registrarUsuario(NUEVO)).ok).toBe(true);
    const guardado = usuariosDB.porCorreo('claudia@correo.cl');
    expect(guardado.password).not.toBe('clave123');
    expect(guardado.rut).toBe('15234567-4');
    expect((await iniciarSesion('claudia_l', 'clave123')).ok).toBe(true);
    const r = await iniciarSesion('CLAUDIA@correo.cl', 'clave123');
    expect(r.usuario.email).toBe('claudia@correo.cl');
    expect(r.usuario.password).toBeUndefined();
  });

  it('no permite RUT, usuario ni correo repetidos', async () => {
    expect((await registrarUsuario({ ...NUEVO, rut: '12.345.678-5' })).campo).toBe('rut');
    expect((await registrarUsuario({ ...NUEVO, usuario: 'ANA_S' })).campo).toBe('usuario');
    expect((await registrarUsuario({ ...NUEVO, email: 'ana@correo.cl' })).campo).toBe('email');
  });

  it('rechaza credenciales incorrectas con un mensaje genérico', async () => {
    expect(await iniciarSesion('ana_s', 'mala123')).toEqual({ ok: false, error: 'Usuario o contraseña incorrectos.' });
    expect((await iniciarSesion('nadie', 'clave123')).ok).toBe(false);
  });

  it('el código de recuperación sirve una sola vez', async () => {
    const { codigoDemo } = await solicitarCodigo('ana@correo.cl');
    expect(codigoDemo).toMatch(/^\d{6}$/);
    expect(servicioCorreo.enviarCodigo.calls.mostRecent().args[1]).toBe(codigoDemo);
    expect((await restablecerContrasena('ana@correo.cl', codigoDemo, 'nueva123')).ok).toBe(true);
    expect((await restablecerContrasena('ana@correo.cl', codigoDemo, 'otra1234')).ok).toBe(false);
  });

  it('el código vence a los 15 minutos (mock del reloj)', async () => {
    const ahora = Date.now();
    const { codigoDemo } = await solicitarCodigo('ana@correo.cl');
    spyOn(Date, 'now').and.returnValue(ahora + (CODIGO_MINUTOS + 1) * 60 * 1000);
    const r = await restablecerContrasena('ana@correo.cl', codigoDemo, 'nueva123');
    expect(r.error).toContain('venció');
  });

  it('después de 5 intentos fallidos el código se anula', async () => {
    const { codigoDemo } = await solicitarCodigo('ana@correo.cl');
    const malo = codigoDemo === '000000' ? '111111' : '000000';
    for (let i = 0; i < 5; i++) await restablecerContrasena('ana@correo.cl', malo, 'nueva123');
    const r = await restablecerContrasena('ana@correo.cl', codigoDemo, 'nueva123');
    expect(r.error).toContain('venció o no es válido');
  });

  it('valida la contraseña nueva', async () => {
    const { codigoDemo } = await solicitarCodigo('ana@correo.cl');
    const r = await restablecerContrasena('ana@correo.cl', codigoDemo, 'corta');
    expect(r.campo).toBe('password');
  });

  it('con correo real no muestra el código en pantalla', async () => {
    servicioCorreo.enviarCodigo.and.returnValue(Promise.resolve({ ok: true, simulado: false }));
    const r = await solicitarCodigo('ana@correo.cl');
    expect(r.ok).toBe(true);
    expect(r.codigoDemo).toBeUndefined();
  });

  it('si el correo no se puede enviar, avisa el error y anula el código', async () => {
    servicioCorreo.enviarCodigo.and.returnValue(Promise.resolve({ ok: false, error: 'sin conexión' }));
    const r = await solicitarCodigo('ana@correo.cl');
    expect(r.ok).toBe(false);
    expect(usuariosDB.porCorreo('ana@correo.cl').recuperacion).toBeNull();
  });
});
