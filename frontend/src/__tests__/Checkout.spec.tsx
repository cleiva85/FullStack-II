/* Prueba de FLUJO del checkout: validación, pago exitoso y pago rechazado por stock. */
import { screen, fireEvent } from '@testing-library/react';
import Checkout from '../pages/tienda/Checkout.tsx';
import { limpiarCacheRegiones } from '../components/tienda/SelectorRegionComuna.tsx';
import { renderizar, respuestaJson, REGIONES_FALSAS, iniciarSesionFalsa } from '../test/utilidades.tsx';
import { CLAVE_CARRITO } from '../context/CarritoContext.tsx';
import { ordenesDB, productosDB, restablecerBaseDatos } from '../data/db.js';

const destinos = { '/compra/exitosa/:numero': 'pagina-exito', '/compra/error/:numero': 'pagina-error' };
const abrir = () => renderizar(<Checkout />, { ruta: '/checkout', path: '/checkout', destinos });
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
    limpiarCacheRegiones();
    spyOn(window, 'fetch').and.callFake(() => respuestaJson(REGIONES_FALSAS));
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
    abrir();
    escribir(/^Nombre/, '');
    fireEvent.click(screen.getByRole('button', { name: /Pagar ahora/ }));
    expect(screen.getByText('Ingresa tu nombre.')).toBeTruthy();
    expect(screen.getByText('Selecciona un medio de pago.')).toBeTruthy();
    expect(ordenesDB.listar().length).toBe(ordenesAntes);
  });

  it('pago exitoso: crea la orden, descuenta stock, vacía el carro y muestra la compra', async () => {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify([{ id: 2, cantidad: 3 }]));
    const stockAntes = productosDB.obtener(2).stock;
    abrir();
    completarComoRetiro();
    fireEvent.click(screen.getByRole('button', { name: /Pagar ahora/ }));

    expect(await screen.findByText('pagina-exito')).toBeTruthy();
    const orden = ordenesDB.listar().at(-1);
    expect(orden.estado).toBe('Pagada');
    expect(orden.total).toBe(2970);
    expect(orden.entrega.tipo).toBe('retiro');
    expect(productosDB.obtener(2).stock).toBe(stockAntes - 3);
    expect(JSON.parse(localStorage.getItem(CLAVE_CARRITO))).toEqual([]);
  });

  it('pago rechazado: si no alcanza el stock va a la página de error y conserva el carro', async () => {
    const stock = productosDB.obtener(2).stock;
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify([{ id: 2, cantidad: stock + 5 }]));
    abrir();
    completarComoRetiro();
    fireEvent.click(screen.getByRole('button', { name: /Pagar ahora/ }));

    expect(await screen.findByText('pagina-error')).toBeTruthy();
    const orden = ordenesDB.listar().at(-1);
    expect(orden.estado).toBe('Rechazada');
    expect(orden.motivo).toContain('Stock insuficiente');
    expect(productosDB.obtener(2).stock).toBe(stock);
    expect(JSON.parse(localStorage.getItem(CLAVE_CARRITO))[0].cantidad).toBe(stock + 5);
  });

  it('con sesión iniciada completa los datos solo y registra el pedido en el backend', async () => {
    iniciarSesionFalsa();
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify([{ id: 2, cantidad: 1 }]));
    window.fetch.and.callFake((url) => (url === '/api/pedidos'
      ? respuestaJson({ ok: true, pedido: { numero: 1 } }, 201)
      : respuestaJson(REGIONES_FALSAS)));
    abrir();
    expect(screen.getByLabelText(/^Nombre/).value).toBe('Ana');
    expect(screen.getByLabelText(/^Correo/).value).toBe('ana@correo.cl');
    expect(screen.getByLabelText(/^Calle y número/).value).toBe('Los Aromos 123');

    await screen.findByRole('option', { name: 'Maipú' });
    fireEvent.change(screen.getByLabelText('Medio de pago'), { target: { value: 'credito' } });
    fireEvent.click(screen.getByRole('button', { name: /Pagar ahora/ }));

    expect(await screen.findByText('pagina-exito')).toBeTruthy();
    const llamada = window.fetch.calls.all().find((c) => c.args[0] === '/api/pedidos');
    expect(llamada).toBeDefined();
    const cuerpo = JSON.parse(llamada.args[1].body);
    expect(cuerpo.items[0]).toEqual({ id: 2, nombre: 'Leche Entera', precio: 990, cantidad: 1 });
    expect(llamada.args[1].headers.Authorization).toBe('Bearer token-de-prueba');
  });
});
