/* =========================================================
   correo.js — envío de correos desde el navegador con EmailJS.
   El proyecto no tiene backend: EmailJS (https://www.emailjs.com) recibe
   la petición y envía el correo con la cuenta que se configuró allá.

   Configuración en el archivo .env.local (ver .env.example):
     NEXT_PUBLIC_EMAILJS_SERVICE_ID, NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
     NEXT_PUBLIC_EMAILJS_TEMPLATE_CONTACTO, NEXT_PUBLIC_EMAILJS_TEMPLATE_RECUPERAR,
     NEXT_PUBLIC_EMAILJS_TEMPLATE_BOLETA,
     NEXT_PUBLIC_CORREO_TIENDA
   Sin esa configuración el envío queda SIMULADO (se muestra en la consola)
   y la app funciona igual.
   ========================================================= */

/* Next.js reemplaza cada process.env.NEXT_PUBLIC_... por su valor al compilar.
   El try evita errores donde no existe process (por ejemplo, en algunas pruebas). */
const leer = (fn) => { try { return fn() || ''; } catch { return ''; } };

/** Es un objeto para que las pruebas puedan cambiar la configuración. */
export const configuracionCorreo = {
  serviceId: leer(() => process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID),
  publicKey: leer(() => process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY),
  plantillaContacto: leer(() => process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_CONTACTO),
  plantillaRecuperar: leer(() => process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_RECUPERAR),
  plantillaBoleta: leer(() => process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_BOLETA),
  correoTienda: leer(() => process.env.NEXT_PUBLIC_CORREO_TIENDA) || 'contacto@cyd.cl',
};

export const URL_EMAILJS = 'https://api.emailjs.com/api/v1.0/email/send';

/** true si hay cuenta de EmailJS configurada y se puede enviar correo real */
export const correoReal = () => Boolean(configuracionCorreo.serviceId && configuracionCorreo.publicKey);

export const servicioCorreo = {
  /**
   * Envía un correo con una plantilla de EmailJS.
   * Devuelve { ok, simulado } o { ok: false, error }.
   */
  async enviar({ plantilla, parametros, destinatario, asunto, cuerpo }) {
    if (!correoReal() || !plantilla) {
      // eslint-disable-next-line no-console
      console.info(`[Correo simulado] Para: ${destinatario} | ${asunto}\n${cuerpo}`);
      return { ok: true, simulado: true };
    }
    try {
      const respuesta = await fetch(URL_EMAILJS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: configuracionCorreo.serviceId,
          template_id: plantilla,
          user_id: configuracionCorreo.publicKey,
          template_params: parametros,
        }),
      });
      if (!respuesta.ok) return { ok: false, error: `El servicio de correo respondió ${respuesta.status}: ${await respuesta.text()}` };
      return { ok: true, simulado: false };
    } catch {
      return { ok: false, error: 'No se pudo conectar con el servicio de correo.' };
    }
  },

  /** Aviso a la tienda cuando alguien escribe en el formulario de Contacto */
  enviarContacto({ nombre, correo, mensaje }) {
    const destino = configuracionCorreo.correoTienda;
    return this.enviar({
      plantilla: configuracionCorreo.plantillaContacto,
      parametros: { to_email: destino, nombre, correo, reply_to: correo, mensaje },
      destinatario: destino,
      asunto: `Nuevo mensaje de contacto de ${nombre}`,
      cuerpo: `${nombre} <${correo}> escribió:\n${mensaje}`,
    });
  },

  /** Código para recuperar la contraseña, al correo del usuario */
  enviarCodigo({ nombre, correo }, codigo, minutos) {
    return this.enviar({
      plantilla: configuracionCorreo.plantillaRecuperar,
      parametros: { to_email: correo, to_name: nombre, codigo, minutos },
      destinatario: correo,
      asunto: 'Recupera tu contraseña — C & D Distribuidora',
      cuerpo: `Hola ${nombre}, tu código para crear una contraseña nueva es ${codigo}. Vence en ${minutos} minutos.`,
    });
  },

  /** Boleta de una compra pagada, al correo del cliente */
  enviarBoleta(orden) {
    const clp = (n) => '$' + Math.round(Number(n) || 0).toLocaleString('es-CL');
    const detalle = orden.items.map((i) => `${i.cantidad} × ${i.nombre} (${clp(i.precio)}) = ${clp(i.precio * i.cantidad)}`).join('\n');
    const entrega = orden.entrega.tipo === 'domicilio'
      ? `Despacho a ${orden.entrega.calle}, ${orden.entrega.comuna}, ${orden.entrega.region}`
      : 'Retiro en tienda: Av. Esq. Blanca 501, Maipú';
    return this.enviar({
      plantilla: configuracionCorreo.plantillaBoleta,
      parametros: {
        to_email: orden.cliente.correo, to_name: orden.cliente.nombre, numero: orden.numero,
        detalle, entrega, despacho: orden.despacho ? clp(orden.despacho) : 'Sin costo', total: clp(orden.total),
      },
      destinatario: orden.cliente.correo,
      asunto: `Boleta de tu compra n.º ${orden.numero} — C & D Distribuidora`,
      cuerpo: `${detalle}\n${entrega}\nTotal: ${clp(orden.total)}`,
    });
  },
};
