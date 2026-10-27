/* Pruebas del servicio de correo (EmailJS) con MOCK de fetch: no se envía nada de verdad. */
import { servicioCorreo, configuracionCorreo, correoReal, URL_EMAILJS } from '@/app/_lib/services/correo';

const CONFIG_REAL = { serviceId: 'service_test', publicKey: 'clave_publica', plantillaContacto: 'tpl_contacto', plantillaRecuperar: 'tpl_recuperar', plantillaBoleta: 'tpl_boleta', correoTienda: 'tienda@cyd.cl' };
const respuesta = (status, texto = 'OK') => Promise.resolve(new Response(texto, { status }));

describe('services/correo', () => {
  let original;
  beforeEach(() => { original = { ...configuracionCorreo }; });
  afterEach(() => { Object.assign(configuracionCorreo, original); });

  it('sin EmailJS configurado el envío es simulado y no llama a internet', async () => {
    Object.assign(configuracionCorreo, { serviceId: '', publicKey: '' });
    spyOn(window, 'fetch');
    spyOn(console, 'info');
    const r = await servicioCorreo.enviarContacto({ nombre: 'Ana', correo: 'ana@correo.cl', mensaje: 'Hola' });
    expect(correoReal()).toBe(false);
    expect(r).toEqual({ ok: true, simulado: true });
    expect(window.fetch).not.toHaveBeenCalled();
    expect(console.info).toHaveBeenCalled();
  });

  it('con EmailJS configurado envía el aviso de contacto a la tienda', async () => {
    Object.assign(configuracionCorreo, CONFIG_REAL);
    spyOn(window, 'fetch').and.callFake(() => respuesta(200));
    const r = await servicioCorreo.enviarContacto({ nombre: 'Ana', correo: 'ana@correo.cl', mensaje: 'Quiero cotizar' });
    expect(r).toEqual({ ok: true, simulado: false });
    const [url, opciones] = window.fetch.calls.mostRecent().args;
    expect(url).toBe(URL_EMAILJS);
    expect(opciones.method).toBe('POST');
    expect(JSON.parse(opciones.body)).toEqual({
      service_id: 'service_test', template_id: 'tpl_contacto', user_id: 'clave_publica',
      template_params: { to_email: 'tienda@cyd.cl', nombre: 'Ana', correo: 'ana@correo.cl', reply_to: 'ana@correo.cl', mensaje: 'Quiero cotizar' },
    });
  });

  it('envía el código de recuperación al correo del usuario', async () => {
    Object.assign(configuracionCorreo, CONFIG_REAL);
    spyOn(window, 'fetch').and.callFake(() => respuesta(200));
    await servicioCorreo.enviarCodigo({ nombre: 'Ana', correo: 'ana@correo.cl' }, '123456', 15);
    const cuerpo = JSON.parse(window.fetch.calls.mostRecent().args[1].body);
    expect(cuerpo.template_id).toBe('tpl_recuperar');
    expect(cuerpo.template_params).toEqual({ to_email: 'ana@correo.cl', to_name: 'Ana', codigo: '123456', minutos: 15 });
  });

  it('informa el error si EmailJS rechaza el envío', async () => {
    Object.assign(configuracionCorreo, CONFIG_REAL);
    spyOn(window, 'fetch').and.callFake(() => respuesta(400, 'The Public Key is invalid'));
    const r = await servicioCorreo.enviarContacto({ nombre: 'Ana', correo: 'ana@correo.cl', mensaje: 'Hola' });
    expect(r.ok).toBe(false);
    expect(r.error).toContain('400');
  });

  it('informa el error si no hay conexión', async () => {
    Object.assign(configuracionCorreo, CONFIG_REAL);
    spyOn(window, 'fetch').and.callFake(() => Promise.reject(new TypeError('Failed to fetch')));
    const r = await servicioCorreo.enviarCodigo({ nombre: 'Ana', correo: 'ana@correo.cl' }, '123456', 15);
    expect(r).toEqual({ ok: false, error: 'No se pudo conectar con el servicio de correo.' });
  });

  it('envía la boleta con el detalle de la compra al correo del cliente', async () => {
    Object.assign(configuracionCorreo, CONFIG_REAL);
    spyOn(window, 'fetch').and.callFake(() => respuesta(200));
    const orden = {
      numero: 20261010, cliente: { nombre: 'Ana', correo: 'ana@correo.cl' }, entrega: { tipo: 'retiro' }, despacho: 0, total: 2970,
      items: [{ id: 2, nombre: 'Leche Entera', precio: 990, cantidad: 3 }],
    };
    await servicioCorreo.enviarBoleta(orden);
    const cuerpo = JSON.parse(window.fetch.calls.mostRecent().args[1].body);
    expect(cuerpo.template_id).toBe('tpl_boleta');
    expect(cuerpo.template_params.to_email).toBe('ana@correo.cl');
    expect(cuerpo.template_params.detalle).toBe('3 × Leche Entera ($990) = $2.970');
    expect(cuerpo.template_params.total).toBe('$2.970');
    expect(cuerpo.template_params.entrega).toContain('Retiro en tienda');
  });
});
