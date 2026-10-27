/* Prueba de FLUJO del checkout: validación, pago exitoso y pago rechazado por stock. */
import { screen, fireEvent } from '@testing-library/react';
import Checkout from '@/app/checkout/page';
import { renderizar, iniciarSesionFalsa } from '@/__tests__/apoyo/utilidades';
import { CLAVE_CARRITO } from '@/app/_context/CarritoContext';
import { ordenesDB, productosDB, restablecerBaseDatos } from '@/app/_lib/data/db';

const abrir = () => renderizar(<Checkout />, { pathname: '/checkout' });
const escribir = (etiqueta, valor) => fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });

function completarComoRetiro() {
  escribir(/^Nombre/, 'Pedro');
  escribir(/^Apellidos/, 'Rojas');
  escribir(/^Correo/, 'pedro@correo.cl');
  fireEvent.click(screen.getByLabelText('Retiro en tienda (sin costo)'));
  fireEvent.change(screen.getByLabelText('Medio de pago'), { target: { value: 'debito' } });
}

describe('Checkout', () => {
  beforeEach(() => {
    localStorage.clear();
    restablecerBaseDatos();
  });

  it('muestra los productos del carro y el total con despacho', () => {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify([{ id: 2, cantidad: 3 }])); // Leche Entera $990
    abrir();
    expect(screen.getByText('Leche Entera')).toBeTruthy();
    expect(screen.getByText('Total a pagar: $5.960')).toBeTruthy(); // 2.970 + 2.990 de despacho
  });

  it('al elegir retiro en tienda se oculta la dirección y baja el total', () => {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify([{ id: 2, cantidad: 3 }]));
    abrir();
    expect(screen.getByLabelText(/^Calle y número/)).toBeTruthy();
    fireEvent.click(screen.getByLabelText('Retiro en tienda (sin costo)'));
    expect(screen.queryByLabelText(/^Calle y número/)).toBeNull();
    expect(screen.getByText('Total a pagar: $2.970')).toBeTruthy();
  });

  it('no deja pagar con datos incompletos', () => {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify([{ id: 2, cantidad: 3 }]));
    const ordenesAntes = ordenesDB.listar().length;
    const { router } = abrir();
    fireEvent.click(screen.getByRole('button', { name: /Pagar ahora/ }));
    expect(screen.getByText('Ingresa tu nombre.')).toBeTruthy();
    expect(screen.getByText('Selecciona un medio de pago.')).toBeTruthy();
    expect(ordenesDB.listar().length).toBe(ordenesAntes);
    expect(router.push).not.toHaveBeenCalled();
  });

  it('pago exitoso: crea la orden, descuenta stock, vacía el carro y va a la compra exitosa', () => {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify([{ id: 2, cantidad: 3 }]));
    const stockAntes = productosDB.obtener(2).stock;
    const { router } = abrir();
    completarComoRetiro();
    fireEvent.click(screen.getByRole('button', { name: /Pagar ahora/ }));

    const orden = ordenesDB.listar().at(-1);
    expect(router.push).toHaveBeenCalledWith(`/compra/exitosa/${orden.numero}`);
    expect(orden.estado).toBe('Pagada');
    expect(orden.total).toBe(2970);
    expect(orden.entrega.tipo).toBe('retiro');
    expect(productosDB.obtener(2).stock).toBe(stockAntes - 3);
    expect(JSON.parse(localStorage.getItem(CLAVE_CARRITO))).toEqual([]);
  });

  it('pago rechazado: si no alcanza el stock va a la página de error y conserva el carro', () => {
    const stock = productosDB.obtener(2).stock;
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify([{ id: 2, cantidad: stock + 5 }]));
    const { router } = abrir();
    completarComoRetiro();
    fireEvent.click(screen.getByRole('button', { name: /Pagar ahora/ }));

    const orden = ordenesDB.listar().at(-1);
    expect(router.push).toHaveBeenCalledWith(`/compra/error/${orden.numero}`);
    expect(orden.estado).toBe('Rechazada');
    expect(orden.motivo).toContain('Stock insuficiente');
    expect(productosDB.obtener(2).stock).toBe(stock);
    expect(JSON.parse(localStorage.getItem(CLAVE_CARRITO))[0].cantidad).toBe(stock + 5);
  });

  it('con sesión iniciada completa los datos solos y asocia la orden al usuario', () => {
    iniciarSesionFalsa();
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify([{ id: 2, cantidad: 1 }]));
    const { router } = abrir();
    expect(screen.getByLabelText(/^Nombre/).value).toBe('Ana');
    expect(screen.getByLabelText(/^Correo/).value).toBe('ana@correo.cl');
    expect(screen.getByLabelText(/^Calle y número/).value).toBe('Los Aromos 123');
    expect(screen.getByLabelText(/^Comuna/).value).toBe('Maipú');

    fireEvent.change(screen.getByLabelText('Medio de pago'), { target: { value: 'credito' } });
    fireEvent.click(screen.getByRole('button', { name: /Pagar ahora/ }));

    const orden = ordenesDB.listar().at(-1);
    expect(router.push).toHaveBeenCalledWith(`/compra/exitosa/${orden.numero}`);
    expect(orden.usuarioId).toBe(2);
    expect(orden.cliente.correo).toBe('ana@correo.cl');
    expect(orden.items[0]).toEqual({ id: 2, nombre: 'Leche Entera', img: '/img/productos/Leche_entera.webp', precio: 990, cantidad: 1 });
  });
});
