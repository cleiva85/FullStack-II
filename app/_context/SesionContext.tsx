'use client';

/* =========================================================
   SesionContext — usuario conectado, disponible en toda la app.
   El login y el registro se validan contra db.js (services/auth.js);
   la sesión queda en localStorage para mantenerla al recargar.
   ========================================================= */
import { createContext, useContext, useState } from 'react';
import { iniciarSesion, registrarUsuario } from '@/app/_lib/services/auth';

export const CLAVE_SESION = 'cyd_sesion';
const SesionContext = createContext(null);

function leerSesion() {
  try { return JSON.parse(localStorage.getItem(CLAVE_SESION)) || null; } catch { return null; }
}

export function SesionProvider({ children }) {
  const [sesion, setSesion] = useState(leerSesion);

  async function iniciar(clave, password) {
    const r = await iniciarSesion(clave, password);
    if (r.ok) {
      const nueva = { usuario: r.usuario, inicio: new Date().toISOString() };
      localStorage.setItem(CLAVE_SESION, JSON.stringify(nueva));
      setSesion(nueva);
    }
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
    registrar: registrarUsuario,
    salir,
  };
  return <SesionContext.Provider value={valor}>{children}</SesionContext.Provider>;
}

export function useSesion() {
  const ctx = useContext(SesionContext);
  if (!ctx) throw new Error('useSesion debe usarse dentro de <SesionProvider>');
  return ctx;
}
