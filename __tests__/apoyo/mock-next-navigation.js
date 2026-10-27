/* =========================================================
   MOCK de next/navigation para las pruebas.
   Reemplaza el router de Next.js: guarda la ruta, los parámetros y
   la búsqueda que cada prueba necesite, y entrega un router con
   espías de Jasmine para comprobar a dónde se navega.
   Ej.: expect(navegacionMock.router.push).toHaveBeenCalledWith('/');
   ========================================================= */
export const navegacionMock = { pathname: '/', params: {}, search: '', router: null };

function crearRouter() {
  return {
    push: jasmine.createSpy('router.push'),
    replace: jasmine.createSpy('router.replace'),
    back: jasmine.createSpy('router.back'),
    refresh: jasmine.createSpy('router.refresh'),
    prefetch: jasmine.createSpy('router.prefetch'),
  };
}

/** Deja la navegación en un estado conocido. Devuelve el router (con espías nuevos). */
export function prepararNavegacion({ pathname = '/', params = {}, search = '' } = {}) {
  navegacionMock.pathname = pathname;
  navegacionMock.params = params;
  navegacionMock.search = search;
  navegacionMock.router = crearRouter();
  return navegacionMock.router;
}

export const useRouter = () => {
  if (!navegacionMock.router) navegacionMock.router = crearRouter();
  return navegacionMock.router;
};
export const usePathname = () => navegacionMock.pathname;
export const useParams = () => navegacionMock.params;
export const useSearchParams = () => new URLSearchParams(navegacionMock.search);
export const redirect = (url) => useRouter().replace(url);
export const notFound = () => { throw new Error('notFound'); };
