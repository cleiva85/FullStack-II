/* Pruebas de la vista "Compra exitosa" (Figura 7): resumen, imprimir y enviar boleta por correo (mocks). */
import { screen, fireEvent } from '@testing-library/react';
import CompraExitosa from '@/app/compra/exitosa/[numero]/page';
import { renderizar } from '@/__tests__/apoyo/utilidades';
import { ordenesDB, restablecerBaseDatos } from '@/app/_lib/data/db';
import { servicioCorreo } from '@/app/_lib/services/correo';

const abrir = (numero) => renderizar(<CompraExitosa />, { pathname: `/compra/exitosa/${numero}`, params: { numero: String(numero) } });

describe('CompraExitosa', () => {
  beforeEach(() => {
    localStorage.clear();
    restablecerBaseDatos();
  });

  it('muestra el número, los productos y el total de la compra', () => {
    const orden = ordenesDB.porNumero(20261001);
    abrir(orden.numero);
    expect(screen.getByText(`✓ Se realizó la compra n.º ${orden.numero}`)).toBeTruthy();
    orden.items.forEach((i) => expect(screen.getByText(i.nombre)).toBeTruthy());
    expect(screen.getByText('$21.630')).toBeTruthy();
  });

  it('una orden rechazada no se muestra como compra exitosa', () => {
    abrir(20261003);
    expect(screen.getByText(/No encontramos una compra pagada/)).toBeTruthy();
  });

  it('el botón Imprimir abre la impresión del navegador (mock de window.print)', () => {
    spyOn(window, 'print');
    abrir(20261001);
    fireEvent.click(screen.getByRole('button', { name: 'Imprimir boleta en PDF' }));
    expect(window.print).toHaveBeenCalled();
  });

  it('envía la boleta al correo del cliente', async () => {
    spyOn(servicioCorreo, 'enviarBoleta').and.returnValue(Promise.resolve({ ok: true, simulado: false }));
    abrir(20261001);
    fireEvent.click(screen.getByRole('button', { name: 'Enviar boleta por email' }));
    expect((await screen.findByRole('alert')).textContent).toContain('Enviamos la boleta a ana@correo.cl');
    expect(servicioCorreo.enviarBoleta.calls.mostRecent().args[0].numero).toBe(20261001);
  });

  it('si el envío falla muestra el error', async () => {
    spyOn(servicioCorreo, 'enviarBoleta').and.returnValue(Promise.resolve({ ok: false, error: 'sin conexión' }));
    abrir(20261001);
    fireEvent.click(screen.getByRole('button', { name: 'Enviar boleta por email' }));
    const alerta = await screen.findByRole('alert');
    expect(alerta.className).toContain('alert-danger');
  });
});
