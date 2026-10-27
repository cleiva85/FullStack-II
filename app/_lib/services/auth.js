/* =========================================================
   auth.js — cuentas de usuario sin backend.
   Los usuarios viven en db.js (localStorage). Las contraseñas y los
   códigos de recuperación se guardan cifrados con SHA-256 + sal
   (Web Crypto API del navegador), nunca en texto plano.
   ========================================================= */
import { usuariosDB } from '../data/db';
import { limpiarRut, validarEmail, validarPassword } from '../utils/validadores';
import { servicioCorreo } from './correo';

export const CODIGO_MINUTOS = 15;     // vigencia del código para recuperar la contraseña
export const CODIGO_INTENTOS = 5;     // intentos fallidos permitidos por código
// Si el correo es simulado (EmailJS sin configurar), el código también se devuelve
// para mostrarlo en pantalla (modo demostración).

const aHex = (buffer) => [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, '0')).join('');
const sha256 = async (texto) => aHex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(texto)));

/** "clave123" → "sal:hash" */
export async function crearCredencial(secreto) {
  const sal = aHex(crypto.getRandomValues(new Uint8Array(8)));
  return `${sal}:${await sha256(`${sal}:${secreto}`)}`;
}

export async function verificarCredencial(secreto, guardado) {
  const [sal, hash] = String(guardado || '').split(':');
  if (!sal || !hash) return false;
  return (await sha256(`${sal}:${secreto}`)) === hash;
}

export const normalizarRut = (rut) => {
  const l = limpiarRut(rut);
  return l.length < 2 ? l : `${l.slice(0, -1)}-${l.slice(-1)}`;
};

/** Datos que se guardan en la sesión (sin contraseña ni código de recuperación) */
export function datosPublicos(u) {
  return {
    id: u.id, usuario: u.usuario || '', nombre: u.nombre, apellido: u.apellido, rut: u.rut, email: u.correo,
    telefono: u.telefono || '', direccion: u.direccion || '', region: u.region || '', comuna: u.comuna || '', rol: u.rol || 'cliente',
  };
}

const buscarPorClave = (clave) => {
  const c = String(clave || '').trim().toLowerCase();
  return usuariosDB.listar().find((u) => (u.usuario || '').toLowerCase() === c || u.correo.toLowerCase() === c) || null;
};

export async function registrarUsuario(d) {
  const usuarios = usuariosDB.listar();
  const rut = normalizarRut(d.rut);
  const usuario = String(d.usuario || '').trim();
  if (usuarios.some((u) => normalizarRut(u.rut) === rut)) return { ok: false, campo: 'rut', error: 'Ya existe un cliente con ese RUT.' };
  if (usuarios.some((u) => (u.usuario || '').toLowerCase() === usuario.toLowerCase())) return { ok: false, campo: 'usuario', error: 'Ese nombre de usuario ya está en uso.' };
  if (usuariosDB.porCorreo(String(d.email || '').trim())) return { ok: false, campo: 'email', error: 'Ese correo ya está registrado.' };
  if (!validarPassword(d.password)) return { ok: false, campo: 'password', error: 'La contraseña debe tener mínimo 6 caracteres, con letras y números.' };
  usuariosDB.crear({
    usuario, rut, nombre: d.nombre.trim(), apellido: d.apellido.trim(), correo: d.email.trim(), rol: 'cliente',
    telefono: d.telefono, direccion: d.direccion.trim(), region: d.region, comuna: d.comuna,
    fechaRegistro: new Date().toISOString(), password: await crearCredencial(d.password),
  });
  return { ok: true };
}

export async function iniciarSesion(clave, password) {
  const u = buscarPorClave(clave);
  if (!u || !(await verificarCredencial(password, u.password))) {
    return { ok: false, error: 'Usuario o contraseña incorrectos.' };
  }
  return { ok: true, usuario: datosPublicos(u) };
}

/* ---------- Olvidé mi contraseña ---------- */

const generarCodigo = () => String(crypto.getRandomValues(new Uint32Array(1))[0] % 1000000).padStart(6, '0');

/** Paso 1: genera un código de 6 dígitos y lo "envía" por correo. */
export async function solicitarCodigo(correo) {
  const c = String(correo || '').trim();
  if (!validarEmail(c)) return { ok: false, campo: 'correo', error: 'Ingresa un correo válido.' };
  // La respuesta es la misma exista o no la cuenta, para no revelar qué correos están registrados
  const respuesta = { ok: true, mensaje: `Si el correo está registrado, te enviamos un código válido por ${CODIGO_MINUTOS} minutos.` };
  const u = usuariosDB.porCorreo(c);
  if (!u) return respuesta;
  const codigo = generarCodigo();
  usuariosDB.actualizar(u.id, {
    recuperacion: { codigo: await crearCredencial(codigo), expira: Date.now() + CODIGO_MINUTOS * 60 * 1000, intentos: 0 },
  });
  const envio = await servicioCorreo.enviarCodigo({ nombre: u.nombre, correo: u.correo }, codigo, CODIGO_MINUTOS);
  if (!envio.ok) {
    usuariosDB.actualizar(u.id, { recuperacion: null });
    return { ok: false, error: 'No se pudo enviar el correo con el código. Inténtalo de nuevo en unos minutos.' };
  }
  return envio.simulado ? { ...respuesta, codigoDemo: codigo } : respuesta;
}

/** Paso 2: valida el código y guarda la contraseña nueva. */
export async function restablecerContrasena(correo, codigo, password) {
  const u = usuariosDB.porCorreo(String(correo || '').trim());
  const r = u?.recuperacion;
  const error = (mensaje, campo = 'codigo') => ({ ok: false, campo, error: mensaje });
  if (!r || r.expira < Date.now() || r.intentos >= CODIGO_INTENTOS) {
    if (r) usuariosDB.actualizar(u.id, { recuperacion: null });
    return error('El código venció o no es válido. Solicita uno nuevo.');
  }
  const cod = String(codigo || '').trim();
  if (!/^\d{6}$/.test(cod) || !(await verificarCredencial(cod, r.codigo))) {
    const intentos = r.intentos + 1;
    usuariosDB.actualizar(u.id, { recuperacion: { ...r, intentos } });
    const quedan = CODIGO_INTENTOS - intentos;
    return error(quedan > 0 ? `Código incorrecto. Te quedan ${quedan} intentos.` : 'Código incorrecto. Solicita uno nuevo.');
  }
  if (!validarPassword(password)) return error('La contraseña debe tener mínimo 6 caracteres, con letras y números.', 'password');
  usuariosDB.actualizar(u.id, { password: await crearCredencial(password), recuperacion: null });
  return { ok: true, mensaje: 'Contraseña actualizada. Ya puedes iniciar sesión.' };
}
