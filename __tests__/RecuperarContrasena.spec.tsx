/* Pruebas del flujo "Olvidé mi contraseña": estado por pasos, validaciones y correo simulado (mock). */
import { screen, fireEvent } from '@testing-library/react';
import { esperarLlamada } from '@/__tests__/apoyo/esperar';
import RecuperarContrasena from '@/app/recuperar-contrasena/page';
import { renderizar } from '@/__tests__/apoyo/utilidades';
import { restablecerBaseDatos } from '@/app/_lib/data/db';
import { servicioCorreo } from '@/app/_lib/services/correo';
import { iniciarSesion } from '@/app/_lib/services/auth';

const abrir = () => renderizar(<RecuperarContrasena />, { pathname: '/recuperar-contrasena' });
const escribir = (etiqueta, valor) => fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });
const codigoEnviado = () => servicioCorreo.enviarCodigo.calls.mostRecent().args[1];

async function irAlPaso2(correo = 'ana@correo.cl') {
  escribir('Correo', correo);
  fireEvent.click(screen.getByRole('button', { name: 'Enviar código' }));
  await screen.findByLabelText('Código de 6 dígitos');
}

function completarPaso2(codigo, password = 'nueva123', confirmar = password) {
  escribir('Código de 6 dígitos', codigo);
  escribir('Nueva contraseña', password);
  escribir('Repite la nueva contraseña', confirmar);
  fireEvent.click(screen.getByRole('button', { name: 'Cambiar contraseña' }));
}

describe('RecuperarContrasena', () => {
  beforeEach(() => {
    localStorage.clear();
    restablecerBaseDatos();
    spyOn(servicioCorreo, 'enviarCodigo').and.returnValue(Promise.resolve({ ok: true, simulado: true }));   // mock: no envía nada
  });

  it('con un correo no válido muestra el error y no envía nada', () => {
    abrir();
    escribir('Correo', 'ana@correo');
    fireEvent.click(screen.getByRole('button', { name: 'Enviar código' }));
    expect(screen.getByText('Ingresa un correo válido.')).toBeTruthy();
    expect(servicioCorreo.enviarCodigo).not.toHaveBeenCalled();
  });

  it('envía el código por correo, pasa al segundo paso y lo muestra en modo demostración', async () => {
    abrir();
    await irAlPaso2();
    expect(servicioCorreo.enviarCodigo).toHaveBeenCalledTimes(1);
    expect(servicioCorreo.enviarCodigo.calls.mostRecent().args[0].correo).toBe('ana@correo.cl');
    expect(screen.getByText(codigoEnviado())).toBeTruthy();
  });

  it('con un correo no registrado responde igual, pero no envía correo', async () => {
    abrir();
    await irAlPaso2('nadie@correo.cl');
    expect(screen.getByText(/Si el correo está registrado/)).toBeTruthy();
    expect(servicioCorreo.enviarCodigo).not.toHaveBeenCalled();
  });

  it('valida el código y que las contraseñas coincidan antes de enviar', async () => {
    abrir();
    await irAlPaso2();
    completarPaso2('12', 'nueva123', 'otra1234');
    expect(screen.getByText('El código tiene 6 dígitos.')).toBeTruthy();
    expect(screen.getByText('Las contraseñas no coinciden.')).toBeTruthy();
  });

  it('con el código correcto cambia la contraseña y vuelve al login', async () => {
    const { router } = abrir();
    await irAlPaso2();
    completarPaso2(codigoEnviado());
    await esperarLlamada(router.push, '/login?restablecida=1');
    expect(router.push).toHaveBeenCalledWith('/login?restablecida=1');
    expect((await iniciarSesion('ana_s', 'nueva123')).ok).toBe(true);
    expect((await iniciarSesion('ana_s', 'clave123')).ok).toBe(false);
  });

  it('si el código es incorrecto muestra cuántos intentos quedan', async () => {
    abrir();
    await irAlPaso2();
    const malo = codigoEnviado() === '000000' ? '111111' : '000000';
    completarPaso2(malo);
    expect((await screen.findByRole('alert')).textContent).toContain('Te quedan 4 intentos');
  });
});
