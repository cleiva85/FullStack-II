/* =========================================================
   validadores.js — reglas de validación de formularios.
   ========================================================= */

export const limpiarRut = (rut) => String(rut ?? '').replace(/[.\s-]/g, '').toUpperCase();

export function calcularDv(cuerpo) {
  let suma = 0;
  let mult = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * mult;
    mult = mult === 7 ? 2 : mult + 1;
  }
  const r = 11 - (suma % 11);
  return r === 11 ? '0' : r === 10 ? 'K' : String(r);
}

export function validarRut(rut) {
  const l = limpiarRut(rut);
  if (!/^\d{7,8}[0-9K]$/.test(l)) return false;
  return calcularDv(l.slice(0, -1)) === l.slice(-1);
}

export function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email ?? '').trim());
}

export function validarTelefono(tel) {
  return /^(\+?56)?[2-9]\d{8}$/.test(String(tel ?? '').replace(/[\s()-]/g, ''));
}

export function validarPassword(pw) {
  const s = String(pw ?? '');
  return s.length >= 6 && /[A-Za-z]/.test(s) && /\d/.test(s);
}

/** Valida los datos del checkout. Devuelve un objeto { campo: mensaje } (vacío si todo está bien). */
export function validarCheckout(d) {
  const e = {};
  if (String(d.nombre ?? '').trim().length < 2) e.nombre = 'Ingresa tu nombre.';
  if (String(d.apellido ?? '').trim().length < 2) e.apellido = 'Ingresa tus apellidos.';
  if (!validarEmail(d.correo)) e.correo = 'Ingresa un correo válido, por ejemplo nombre@correo.cl.';
  if (d.tipoEntrega === 'domicilio') {
    if (String(d.calle ?? '').trim().length < 5) e.calle = 'Ingresa la calle y el número.';
    if (!d.region) e.region = 'Selecciona una región.';
    if (!d.comuna) e.comuna = 'Selecciona una comuna.';
  }
  if (!d.medioPago) e.medioPago = 'Selecciona un medio de pago.';
  return e;
}

/** Valida el formulario de producto del panel de administración */
export function validarProducto(d) {
  const e = {};
  const precio = Number(d.precio);
  const stock = Number(d.stock);
  if (String(d.nombre ?? '').trim().length < 3) e.nombre = 'El nombre debe tener al menos 3 caracteres.';
  if (!d.categoria) e.categoria = 'Selecciona una categoría.';
  if (d.precio === '' || !Number.isInteger(precio) || precio <= 0) e.precio = 'El precio debe ser un número entero mayor a 0.';
  if (d.oferta !== '' && d.oferta != null) {
    const oferta = Number(d.oferta);
    if (!Number.isInteger(oferta) || oferta <= 0 || oferta >= precio) e.oferta = 'La oferta debe ser menor al precio normal.';
  }
  if (d.stock === '' || !Number.isInteger(stock) || stock < 0) e.stock = 'El stock debe ser un número entero de 0 o más.';
  return e;
}

/** Valida el formulario de registro de clientes. Devuelve { campo: mensaje }. */
export function validarRegistro(d) {
  const e = {};
  if (!validarRut(d.rut)) e.rut = 'RUT no válido. Revisa el dígito verificador.';
  if (d.nombre.trim().length < 2) e.nombre = 'Ingresa tu nombre.';
  if (d.apellido.trim().length < 2) e.apellido = 'Ingresa tu apellido.';
  if (!/^[A-Za-z0-9_]{4,}$/.test(d.usuario)) e.usuario = 'Mínimo 4 caracteres: letras, números o _.';
  if (!validarEmail(d.email)) e.email = 'Ingresa un correo válido.';
  if (!validarTelefono(d.telefono)) e.telefono = 'Ingresa un teléfono de 9 dígitos, por ejemplo 912345678.';
  if (d.direccion.trim().length < 5) e.direccion = 'Ingresa tu dirección.';
  if (!d.region) e.region = 'Selecciona una región.';
  if (!d.comuna) e.comuna = 'Selecciona una comuna.';
  if (!validarPassword(d.password)) e.password = 'Mínimo 6 caracteres, con letras y números.';
  if (d.confirmar !== d.password) e.confirmar = 'Las contraseñas no coinciden.';
  return e;
}
