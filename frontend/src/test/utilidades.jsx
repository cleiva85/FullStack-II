/* =========================================================
   Utilidades compartidas por las pruebas (no se miden en la cobertura).
   ========================================================= */
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { SesionProvider } from '../context/SesionContext.jsx';
import { CarritoProvider } from '../context/CarritoContext.jsx';
import { CLAVE_SESION } from '../services/api.js';

/**
 * Renderiza un componente con router y contextos (sesión y carro).
 * - ruta: URL inicial (ej. '/checkout')
 * - path: patrón de la ruta del componente (ej. '/checkout')
 * - destinos: otras rutas que solo muestran un texto, para comprobar navegaciones
 *   ej. { '/': 'pagina-inicio', '/compra/exitosa/:numero': 'pagina-exito' }
 */
export function renderizar(ui, { ruta = '/', path = '/', destinos = {} } = {}) {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <SesionProvider>
        <CarritoProvider>
          <Routes>
            <Route path={path} element={ui} />
            {Object.entries(destinos).map(([p, texto]) => (
              <Route key={p} path={p} element={<p>{texto}</p>} />
            ))}
          </Routes>
        </CarritoProvider>
      </SesionProvider>
    </MemoryRouter>,
  );
}

/** Respuesta HTTP falsa para usar con spyOn(window, 'fetch') */
export function respuestaJson(cuerpo, status = 200) {
  return Promise.resolve(new Response(JSON.stringify(cuerpo), {
    status,
    headers: { 'Content-Type': 'application/json' },
  }));
}

/** Deja una sesión guardada, como si el usuario ya hubiera iniciado sesión */
export function iniciarSesionFalsa(usuario = {}) {
  localStorage.setItem(CLAVE_SESION, JSON.stringify({
    token: 'token-de-prueba',
    usuario: {
      usuario: 'ana_s', nombre: 'Ana', apellido: 'Soto', email: 'ana@correo.cl', rut: '12345678-5',
      direccion: 'Los Aromos 123', region: 'Metropolitana de Santiago', comuna: 'Maipú', rol: 'cliente',
      ...usuario,
    },
  }));
}

export const REGIONES_FALSAS = {
  regions: [
    { name: 'Metropolitana de Santiago', communes: [{ name: 'Maipú' }, { name: 'Cerrillos' }] },
    { name: 'Valparaíso', communes: [{ name: 'Viña del Mar' }, { name: 'Quilpué' }] },
  ],
};

export const PRODUCTO_EJEMPLO = {
  id: 1, nombre: 'Coca-Cola Original', marca: 'The Coca-Cola Company', categoria: 'Gaseosas',
  descripcion: 'Botella 1.5 Litros', precio: 2500, oferta: null, stock: 40, stockCritico: 10, img: '/img/coca-cola.jpeg',
};
