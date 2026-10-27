/* Pruebas de RENDERIZADO CONDICIONAL: el mensaje de error solo aparece cuando hay error. */
import { render, screen, fireEvent } from '@testing-library/react';
import MensajeAlerta from '@/app/_components/comunes/MensajeAlerta';

describe('MensajeAlerta', () => {
  it('no muestra nada cuando no hay mensaje', () => {
    const { container } = render(<MensajeAlerta mensaje="" />);
    expect(screen.queryByRole('alert')).toBeNull();
    expect(container.innerHTML).toBe('');
  });

  it('muestra el mensaje de error cuando existe', () => {
    render(<MensajeAlerta mensaje="Usuario o contraseña incorrectos." />);
    const alerta = screen.getByRole('alert');
    expect(alerta.textContent).toContain('Usuario o contraseña incorrectos.');
    expect(alerta.className).toContain('alert-danger');
  });

  it('usa el tipo recibido (por ejemplo, éxito)', () => {
    render(<MensajeAlerta mensaje="Cuenta creada" tipo="success" />);
    expect(screen.getByRole('alert').className).toContain('alert-success');
  });

  it('muestra el botón de cerrar solo si recibe onCerrar, y lo ejecuta', () => {
    const onCerrar = jasmine.createSpy('onCerrar');
    const { rerender } = render(<MensajeAlerta mensaje="Aviso" />);
    expect(screen.queryByRole('button', { name: 'Cerrar' })).toBeNull();
    rerender(<MensajeAlerta mensaje="Aviso" onCerrar={onCerrar} />);
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar' }));
    expect(onCerrar).toHaveBeenCalled();
  });
});
