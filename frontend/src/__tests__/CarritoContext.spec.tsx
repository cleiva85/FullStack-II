/* Pruebas de ESTADO GLOBAL: el contexto del carro actualiza unidades, total y localStorage. */
import { render, screen, fireEvent, act } from '@testing-library/react';
import { CarritoProvider, useCarrito, CLAVE_CARRITO } from '../context/CarritoContext.tsx';
import { restablecerBaseDatos, productosDB } from '../data/db.js';

function Consumidor() {
  const c = useCarrito();
  return (
    <div>
      <span data-testid="unidades">{c.unidades}</span>
      <span data-testid="total">{c.total}</span>
      <button type="button" onClick={() => c.agregar(1, 2)}>agregar</button>
      <button type="button" onClick={() => c.cambiar(1, -1)}>menos</button>
      <button type="button" onClick={() => c.quitar(1)}>quitar</button>
      <button type="button" onClick={c.vaciar}>vaciar</button>
    </div>
  );
}

describe('CarritoContext', () => {
  beforeEach(() => {
    localStorage.clear();
    restablecerBaseDatos();
  });

  it('parte vacío', () => {
    render(<CarritoProvider><Consumidor /></CarritoProvider>);
    expect(screen.getByTestId('unidades').textContent).toBe('0');
    expect(screen.getByTestId('total').textContent).toBe('0');
  });

  it('agregar suma unidades y calcula el total con el precio de oferta', () => {
    render(<CarritoProvider><Consumidor /></CarritoProvider>);
    fireEvent.click(screen.getByText('agregar'));
    const precio = productosDB.obtener(1).oferta; // 2190
    expect(screen.getByTestId('unidades').textContent).toBe('2');
    expect(screen.getByTestId('total').textContent).toBe(String(precio * 2));
  });

  it('guarda el carro en localStorage', () => {
    render(<CarritoProvider><Consumidor /></CarritoProvider>);
    fireEvent.click(screen.getByText('agregar'));
    expect(JSON.parse(localStorage.getItem(CLAVE_CARRITO))).toEqual([{ id: 1, cantidad: 2 }]);
  });

  it('recupera el carro guardado al volver a abrir la página', () => {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify([{ id: 1, cantidad: 4 }]));
    render(<CarritoProvider><Consumidor /></CarritoProvider>);
    expect(screen.getByTestId('unidades').textContent).toBe('4');
  });

  it('cambiar, quitar y vaciar actualizan el estado', () => {
    render(<CarritoProvider><Consumidor /></CarritoProvider>);
    fireEvent.click(screen.getByText('agregar'));
    fireEvent.click(screen.getByText('menos'));
    expect(screen.getByTestId('unidades').textContent).toBe('1');
    fireEvent.click(screen.getByText('quitar'));
    expect(screen.getByTestId('unidades').textContent).toBe('0');
    fireEvent.click(screen.getByText('agregar'));
    fireEvent.click(screen.getByText('vaciar'));
    expect(screen.getByTestId('unidades').textContent).toBe('0');
  });

  it('el total se actualiza en tiempo real si el administrador cambia el precio', () => {
    render(<CarritoProvider><Consumidor /></CarritoProvider>);
    fireEvent.click(screen.getByText('agregar'));
    act(() => { productosDB.actualizar(1, { oferta: null, precio: 3000 }); });
    expect(screen.getByTestId('total').textContent).toBe('6000');
  });
});
