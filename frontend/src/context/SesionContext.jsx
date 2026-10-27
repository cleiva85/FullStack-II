/* =========================================================
   SesionContext — usuario conectado, disponible en toda la app.
   El login y el registro los valida el backend Node; el token
   se guarda en localStorage para mantener la sesión abierta.
   ========================================================= */
import { createContext, useContext, useState } from 'react';
import { api, CLAVE_SESION } from '../services/api.js';
import { usuariosDB } from '../data/db.js';

const SesionContext = createContext(null);

function leerSesion() {
  try { return JSON.parse(localStorage.getItem(CLAVE_SESION)) || null; } catch { return null; }
}

/** Mantiene la tabla de usuarios del panel admin al día con los usuarios del backend */
function sincronizarUsuario(u) {
  if (!u?.email || usuariosDB.porCorreo(u.email)) return;
  usuariosDB.crear({
    rut: u.rut, nombre: u.nombre, apellido: u.apellido, correo: u.email, rol: u.rol || 'cliente',
    telefono: u.telefono || '', direccion: u.direccion, region: u.region, comuna: u.comuna,
    fechaRegistro: new Date().toISOString(),
  });
}

export function SesionProvider({ children }) {
  const [sesion, setSesion] = useState(leerSesion);

  async function iniciar(clave, password) {
    const r = await api.login(clave, password);
    if (r.ok) {
      const nueva = { token: r.token, usuario: r.usuario };
      localStorage.setItem(CLAVE_SESION, JSON.stringify(nueva));
      sincronizarUsuario(r.usuario);
      setSesion(nueva);
    }
    return r;
  }

  async function registrar(datos) {
    const r = await api.registrar(datos);
    if (r.ok) sincronizarUsuario(datos);
    return r;
  }

  function salir() {
    localStorage.removeItem(CLAVE_SESION);
    setSesion(null);
  }

  const valor = {
    sesion,
    usuario: sesion?.usuario ?? null,
    esAdmin: sesion?.usuario?.rol === 'admin',
    iniciar,
    registrar,
    salir,
  };
  return <SesionContext.Provider value={valor}>{children}</SesionContext.Provider>;
}

export function useSesion() {
  const ctx = useContext(SesionContext);
  if (!ctx) throw new Error('useSesion debe usarse dentro de <SesionProvider>');
  return ctx;
}
