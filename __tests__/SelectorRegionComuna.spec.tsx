/* Pruebas de selects dependientes: las comunas cambian según la región elegida. */
import { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SelectorRegionComuna from '@/app/_components/tienda/SelectorRegionComuna';

function ConEstado({ onCambiar = () => {} }) {
  const [v, setV] = useState({ region: '', comuna: '' });
  return <SelectorRegionComuna region={v.region} comuna={v.comuna} onCambiar={(n) => { setV(n); onCambiar(n); }} />;
}

describe('SelectorRegionComuna', () => {
  it('muestra las 16 regiones de Chile', () => {
    render(<ConEstado />);
    expect(screen.getByLabelText(/Región/).options.length).toBe(17); // + "Selecciona una región"
    expect(screen.getByRole('option', { name: 'Valparaíso' })).toBeTruthy();
  });

  it('la comuna está deshabilitada hasta elegir región y luego muestra solo sus comunas', () => {
    const onCambiar = jasmine.createSpy('onCambiar');
    render(<ConEstado onCambiar={onCambiar} />);
    const comuna = screen.getByLabelText(/Comuna/);
    expect(comuna.disabled).toBe(true);

    fireEvent.change(screen.getByLabelText(/Región/), { target: { value: 'Valparaíso' } });
    expect(onCambiar).toHaveBeenCalledWith({ region: 'Valparaíso', comuna: '' });
    expect(comuna.disabled).toBe(false);
    expect(screen.getByRole('option', { name: 'Viña del Mar' })).toBeTruthy();
    expect(screen.queryByRole('option', { name: 'Maipú' })).toBeNull();

    fireEvent.change(comuna, { target: { value: 'Viña del Mar' } });
    expect(onCambiar).toHaveBeenCalledWith({ region: 'Valparaíso', comuna: 'Viña del Mar' });
  });

  it('al cambiar de región se borra la comuna elegida', () => {
    const onCambiar = jasmine.createSpy('onCambiar');
    render(<ConEstado onCambiar={onCambiar} />);
    fireEvent.change(screen.getByLabelText(/Región/), { target: { value: 'Valparaíso' } });
    fireEvent.change(screen.getByLabelText(/Comuna/), { target: { value: 'Viña del Mar' } });
    fireEvent.change(screen.getByLabelText(/Región/), { target: { value: 'Metropolitana de Santiago' } });
    expect(onCambiar).toHaveBeenCalledWith({ region: 'Metropolitana de Santiago', comuna: '' });
    expect(screen.getByLabelText(/Comuna/).value).toBe('');
  });

  it('muestra los errores de validación recibidos por props', () => {
    render(<SelectorRegionComuna region="" comuna="" onCambiar={() => {}} errores={{ region: 'Selecciona una región.' }} />);
    expect(screen.getByText('Selecciona una región.')).toBeTruthy();
    expect(screen.getByLabelText(/Región/).className).toContain('is-invalid');
  });
});
