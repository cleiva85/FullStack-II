/* Pruebas con MOCK de fetch: el componente pide las regiones al backend sin necesitar el servidor. */
import { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SelectorRegionComuna, { limpiarCacheRegiones } from '../components/tienda/SelectorRegionComuna.tsx';
import { respuestaJson, REGIONES_FALSAS } from '../test/utilidades.tsx';

function ConEstado({ onCambiar = () => {} }) {
  const [v, setV] = useState({ region: '', comuna: '' });
  return (
    <SelectorRegionComuna region={v.region} comuna={v.comuna}
      onCambiar={(n) => { setV(n); onCambiar(n); }} />
  );
}

describe('SelectorRegionComuna', () => {
  beforeEach(() => limpiarCacheRegiones());

  it('pide las regiones a /api/regiones y las muestra', async () => {
    spyOn(window, 'fetch').and.callFake(() => respuestaJson(REGIONES_FALSAS));
    render(<ConEstado />);
    expect(await screen.findByRole('option', { name: 'Valparaíso' })).toBeTruthy();
    expect(window.fetch).toHaveBeenCalledTimes(1);
    expect(window.fetch.calls.mostRecent().args[0]).toBe('/api/regiones');
  });

  it('la comuna está deshabilitada hasta elegir región y luego muestra solo sus comunas', async () => {
    spyOn(window, 'fetch').and.callFake(() => respuestaJson(REGIONES_FALSAS));
    const onCambiar = jasmine.createSpy('onCambiar');
    render(<ConEstado onCambiar={onCambiar} />);
    await screen.findByRole('option', { name: 'Valparaíso' });
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

  it('muestra un aviso si el backend no responde', async () => {
    spyOn(window, 'fetch').and.callFake(() => Promise.reject(new TypeError('Failed to fetch')));
    render(<ConEstado />);
    expect(await screen.findByText(/No se pudieron cargar las regiones/)).toBeTruthy();
  });

  it('muestra los errores de validación recibidos por props', () => {
    spyOn(window, 'fetch').and.callFake(() => respuestaJson(REGIONES_FALSAS));
    render(<SelectorRegionComuna region="" comuna="" onCambiar={() => {}} errores={{ region: 'Selecciona una región.' }} />);
    expect(screen.getByText('Selecciona una región.')).toBeTruthy();
    expect(screen.getByLabelText(/Región/).className).toContain('is-invalid');
  });
});
