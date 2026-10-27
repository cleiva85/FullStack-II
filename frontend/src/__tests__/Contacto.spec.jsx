/* Pruebas de FORMULARIO: estado de los campos, mensajes de error y mensaje de éxito. */
import { render, screen, fireEvent } from '@testing-library/react';
import Contacto from '../pages/tienda/Contacto.jsx';

const escribir = (etiqueta, valor) => fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });

describe('Contacto', () => {
  it('guarda en el estado lo que el usuario escribe', () => {
    render(<Contacto />);
    escribir(/^Nombre/, 'Claudia');
    escribir(/^Mensaje/, 'Necesito una cotización');
    expect(screen.getByLabelText(/^Nombre/).value).toBe('Claudia');
    expect(screen.getByLabelText(/^Mensaje/).value).toBe('Necesito una cotización');
  });

  it('muestra un error por cada campo no válido', () => {
    render(<Contacto />);
    escribir(/^Correo/, 'no-es-correo');
    fireEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }));
    expect(screen.getByText('Ingresa tu nombre.')).toBeTruthy();
    expect(screen.getByText('Ingresa un correo válido.')).toBeTruthy();
    expect(screen.getByText('Escribe un mensaje de al menos 10 caracteres.')).toBeTruthy();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('con datos válidos muestra el mensaje de éxito y limpia el formulario', () => {
    render(<Contacto />);
    escribir(/^Nombre/, 'Claudia');
    escribir(/^Correo/, 'claudia@correo.cl');
    escribir(/^Mensaje/, 'Necesito una cotización para mi almacén');
    fireEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }));
    expect(screen.getByRole('alert').textContent).toContain('Recibimos tu mensaje');
    expect(screen.getByLabelText(/^Nombre/).value).toBe('');
  });
});
