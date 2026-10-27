/* =========================================================
   Utilidades compartidas por las pruebas (no se miden en la cobertura).
   ========================================================= */
import { render } from '@testing-library/react';
import { SesionProvider, CLAVE_SESION } from '@/app/_context/SesionContext';
import { CarritoProvider } from '@/app/_context/CarritoContext';
import { prepararNavegacion } from './mock-next-navigation';

/**
 * Renderiza una página o componente con los contextos (sesión y carro) y
 * con la navegación de Next simulada.
 * - pathname / params / search: lo que entregan usePathname, useParams y useSearchParams
 * Devuelve el router simulado para revisar router.push / router.replace.
 */
export function renderizar(ui, { pathname = '/', params = {}, search = '' } = {}) {
  const router = prepararNavegacion({ pathname, params, search });
  const resultado = render(
    <SesionProvider>
      <CarritoProvider>{ui}</CarritoProvider>
    </SesionProvider>,
  );
  return { ...resultado, router };
}

/** Deja una sesión guardada, como si el usuario ya hubiera iniciado sesión */
export function iniciarSesionFalsa(usuario = {}) {
  localStorage.setItem(CLAVE_SESION, JSON.stringify({
    usuario: {
      id: 2, usuario: 'ana_s', nombre: 'Ana', apellido: 'Soto', email: 'ana@correo.cl', rut: '12345678-5',
      direccion: 'Los Aromos 123', region: 'Metropolitana de Santiago', comuna: 'Maipú', rol: 'cliente',
      ...usuario,
    },
  }));
}

export const PRODUCTO_EJEMPLO = {
  id: 1, nombre: 'Coca-Cola Original', marca: 'The Coca-Cola Company', categoria: 'Gaseosas',
  descripcion: 'Botella 1.5 Litros', precio: 2500, oferta: null, stock: 40, stockCritico: 10, img: '/img/productos/Coca_cola.webp',
};
