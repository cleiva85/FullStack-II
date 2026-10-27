/* Pruebas de FORMULARIO: estado de los campos, errores, mensaje guardado en db.js y aviso por correo (mock). */
import { render, screen, fireEvent } from '@testing-library/react';
import Contacto from '@/app/contacto/page';
import { mensajesDB, restablecerBaseDatos } from '@/app/_lib/data/db';
import { servicioCorreo } from '@/app/_lib/services/correo';

const escribir = (etiqueta, valor) => fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });
function completarYEnviar() {
  escribir(/^Nombre/, 'Claudia');
  escribir(/^Correo/, 'claudia@correo.cl');
  escribir(/^Mensaje/, 'Necesito una cotización para mi almacén');
  fireEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }));
}

describe('Contacto', () => {
  beforeEach(() => {
    localStorage.clear();
    restablecerBaseDatos();
  });

  it('guarda en el estado lo que el usuario escribe', () => {
    render(<Contacto />);
    escribir(/^Nombre/, 'Claudia');
    escribir(/^Mensaje/, 'Necesito una cotización');
    expect(screen.getByLabelText(/^Nombre/).value).toBe('Claudia');
    expect(screen.getByLabelText(/^Mensaje/).value).toBe('Necesito una cotización');
  });

  it('muestra un error por cada campo no válido y no guarda ni envía nada', () => {
    spyOn(servicioCorreo, 'enviarContacto');
    const antes = mensajesDB.listar().length;
    render(<Contacto />);
    escribir(/^Correo/, 'no-es-correo');
    fireEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }));
    expect(screen.getByText('Ingresa tu nombre.')).toBeTruthy();
    expect(screen.getByText('Ingresa un correo válido.')).toBeTruthy();
    expect(screen.getByText('Escribe un mensaje de al menos 10 caracteres.')).toBeTruthy();
    expect(screen.queryByRole('alert')).toBeNull();
    expect(mensajesDB.listar().length).toBe(antes);
    expect(servicioCorreo.enviarContacto).not.toHaveBeenCalled();
  });

  it('con datos válidos guarda el mensaje, avisa por correo y limpia el formulario', async () => {
    spyOn(servicioCorreo, 'enviarContacto').and.returnValue(Promise.resolve({ ok: true, simulado: false }));
    render(<Contacto />);
    completarYEnviar();
    expect((await screen.findByRole('alert')).textContent).toContain('Recibimos tu mensaje');
    expect(servicioCorreo.enviarContacto).toHaveBeenCalledWith({ nombre: 'Claudia', correo: 'claudia@correo.cl', mensaje: 'Necesito una cotización para mi almacén' });
    const guardado = mensajesDB.recientes()[0];
    expect(guardado.nombre).toBe('Claudia');
    expect(guardado.estado).toBe('Nuevo');
    expect(guardado.correoEnviado).toBe(true);
    expect(screen.getByLabelText(/^Nombre/).value).toBe('');
  });

  it('si el correo falla igual guarda el mensaje y lo avisa', async () => {
    spyOn(servicioCorreo, 'enviarContacto').and.returnValue(Promise.resolve({ ok: false, error: 'sin conexión' }));
    render(<Contacto />);
    completarYEnviar();
    const alerta = await screen.findByRole('alert');
    expect(alerta.textContent).toContain('no pudimos enviar el aviso por correo');
    expect(alerta.className).toContain('alert-warning');
    expect(mensajesDB.recientes()[0].correoEnviado).toBe(false);
  });
});
