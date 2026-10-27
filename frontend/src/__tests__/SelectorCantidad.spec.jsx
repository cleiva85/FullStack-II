/* Pruebas de ESTADO y EVENTOS del selector − / + (límites de 1 a 99). */
import { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SelectorCantidad from '../components/tienda/SelectorCantidad.jsx';

function ConEstado({ inicial = 1 }) {
  const [valor, setValor] = useState(inicial);
  return <SelectorCantidad valor={valor} onCambiar={setValor} />;
}

describe('SelectorCantidad', () => {
  it('avisa el nuevo valor al presionar + y −', () => {
    const onCambiar = jasmine.createSpy('onCambiar');
    render(<SelectorCantidad valor={5} onCambiar={onCambiar} />);
    fireEvent.click(screen.getByRole('button', { name: 'Agregar uno' }));
    expect(onCambiar).toHaveBeenCalledWith(6);
    fireEvent.click(screen.getByRole('button', { name: 'Quitar uno' }));
    expect(onCambiar).toHaveBeenCalledWith(4);
  });

  it('actualiza el número mostrado cuando el padre guarda el estado', () => {
    render(<ConEstado inicial={1} />);
    const input = screen.getByRole('spinbutton');
    fireEvent.click(screen.getByRole('button', { name: 'Agregar uno' }));
    fireEvent.click(screen.getByRole('button', { name: 'Agregar uno' }));
    expect(input.value).toBe('3');
    fireEvent.click(screen.getByRole('button', { name: 'Quitar uno' }));
    expect(input.value).toBe('2');
  });

  it('no baja de 1: el botón − queda deshabilitado', () => {
    render(<ConEstado inicial={1} />);
    expect(screen.getByRole('button', { name: 'Quitar uno' }).disabled).toBe(true);
  });

  it('limita lo que se escribe a mano entre 1 y 99', () => {
    const onCambiar = jasmine.createSpy('onCambiar');
    render(<SelectorCantidad valor={1} onCambiar={onCambiar} />);
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '150' } });
    expect(onCambiar).toHaveBeenCalledWith(99);
    fireEvent.change(input, { target: { value: '-3' } });
    expect(onCambiar).toHaveBeenCalledWith(1);
  });

  it('respeta un máximo distinto (por ejemplo, el stock disponible)', () => {
    render(<SelectorCantidad valor={5} max={5} onCambiar={() => {}} />);
    expect(screen.getByRole('button', { name: 'Agregar uno' }).disabled).toBe(true);
  });
});
