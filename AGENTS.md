# Guía para agentes de IA y colaboradores

- **Framework:** Next.js con App Router, React 19 y Bootstrap 5. Es un proyecto solo frontend: no hay backend ni API.
- **Rutas:** cada `app/**/page.tsx` es una página. El código compartido va en carpetas privadas: `app/_components`, `app/_context` y `app/_lib`.
- **Componentes:** los componentes con estado, efectos, contexto o localStorage llevan `'use client'`. La app se monta en el cliente (`app/_components/Proveedores.tsx`) porque todos los datos viven en localStorage.
- **Navegación:**
  - Usar `next/link` (`<Link href>`) y `next/navigation`: `useRouter`, `useParams`, `useSearchParams` y `usePathname`.
  - Una página que usa `useSearchParams` debe envolverse en `<Suspense>`.
- **Datos:**
  - Los datos se leen y escriben solo con `app/_lib/data/db.js` (CRUD) y se muestran con el hook `useDatos`.
  - Los datos iniciales están en `db.json`. Si se cambian, hay que subir `VERSION_SEMILLA`.
- **Cuentas:** registro, login y recuperación se hacen con `app/_lib/services/auth.js`. Las contraseñas nunca se guardan en texto plano.
- **Correos:** se envían con `app/_lib/services/correo.js` (EmailJS, configurado en `.env.local`). Sin configuración quedan simulados; no se debe agregar un backend para enviarlos.
- **Pruebas:**
  - Se escriben en Jasmine + Karma, en `__tests__/*.spec.tsx`.
  - Las páginas se renderizan con `renderizar()` de `__tests__/apoyo/utilidades.tsx`. El router de Next es un mock con espías.
  - Todas las pruebas deben pasar con `npm test` antes de subir cambios.
- **Idioma:** la interfaz y el código (nombres, comentarios) están en español.
