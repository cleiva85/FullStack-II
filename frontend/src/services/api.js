/* =========================================================
   api.js — comunicación con el backend Node (carpeta backend).
   En desarrollo Vite reenvía /api a http://localhost:3000.
   ========================================================= */
export const CLAVE_SESION = 'cyd_sesion';

export async function pedir(metodo, url, cuerpo) {
  let token = null;
  try { token = JSON.parse(localStorage.getItem(CLAVE_SESION))?.token; } catch { /* sin sesión */ }
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = 'Bearer ' + token;

  let res;
  try {
    res = await fetch(url, { method: metodo, headers, body: cuerpo ? JSON.stringify(cuerpo) : undefined });
  } catch {
    return {
      ok: false,
      status: 0,
      error: 'No se pudo conectar con el servidor. Inícialo con "npm start" en la carpeta backend.',
    };
  }
  let datos = {};
  try { datos = await res.json(); } catch { /* respuesta sin JSON */ }
  return { ...datos, ok: res.ok && datos.ok !== false, status: res.status };
}

export const api = {
  regiones: () => pedir('GET', '/api/regiones'),
  registrar: (datos) => pedir('POST', '/api/registro', datos),
  login: (clave, password) => pedir('POST', '/api/login', { clave, password }),
  sesion: () => pedir('GET', '/api/sesion'),
  crearPedido: (pedido) => pedir('POST', '/api/pedidos', pedido),
  misPedidos: () => pedir('GET', '/api/pedidos'),
};
