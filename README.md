# C & D Distribuidora Mayorista — Tienda online

Proyecto de la **Evaluación Parcial 2 de DSY1104 Desarrollo Fullstack II (Duoc UC)**. Equipo: Claudia Leiva y Dayana Seguel.

Tienda online de una distribuidora mayorista de Maipú, construida en **Next.js (React) con Bootstrap 5** y **pruebas unitarias en Jasmine + Karma**. Es un proyecto solo frontend: los datos se guardan en el navegador (localStorage) y los correos se envían con EmailJS, sin backend.

---

## Tecnologías

| Tecnología | Para qué se usa |
|---|---|
| **Next.js 16** (App Router) | Framework de React: cada carpeta de `app/` con un `page.tsx` es una página. |
| **React 19** | Componentes con props, estado (`useState`) y contexto (sesión, carro y avisos). |
| **Bootstrap 5** | Diseño responsivo: grilla, navbar, tarjetas, formularios, tablas y alertas. |
| **Jasmine + Karma** | Pruebas unitarias en Chrome sin ventana, con reporte de cobertura (istanbul). |
| **React Testing Library** | Renderiza componentes en las pruebas y los busca como lo haría un usuario. |
| **EmailJS** (opcional) | Envío de correos desde el navegador: contacto, recuperar contraseña y boleta. |
| **Node.js** | Herramienta de desarrollo: instala dependencias (`npm`), levanta Next y corre Karma. |

## Instalación y uso

Requisitos: **Node.js 20.9 o superior** (revisar con `node -v`) y **Google Chrome** para las pruebas.

```bash
npm install      # solo la primera vez
npm run dev      # abre http://localhost:3000
```

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo en http://localhost:3000 |
| `npm test` | Corre las 128 pruebas una vez y genera la cobertura en `coverage/` |
| `npm run test:watch` | Deja Karma abierto y vuelve a correr las pruebas al guardar |
| `npm run build` y `npm start` | Compila y levanta la versión de producción |
| `npm run lint` | Revisa el código con ESLint |

### Cuentas de demostración

| Usuario | Contraseña | Rol |
|---|---|---|
| `admin` | `admin123` | Administrador (entra al panel `/admin`) |
| `ana_s` | `clave123` | Cliente |
| `pedro_r` | `clave123` | Cliente |

También se puede iniciar sesión con el correo (`admin@cyd.cl`, `ana@correo.cl`, `pedro@correo.cl`).

---

## Estructura del proyecto

```
proyecto-comercio/
├── app/                        rutas de Next.js (cada page.tsx es una página)
│   ├── _components/            componentes reutilizables
│   │   ├── comunes/            Boton, CampoFormulario, MensajeAlerta, Precio, TablaItems, RutaProtegida…
│   │   ├── tienda/             Encabezado, ProductoCard, ListaProductos, FiltrosProductos, SelectorCantidad…
│   │   └── admin/              AdminLayout, TarjetaResumen, EncabezadoSeccion, EstadoMensaje
│   ├── _context/               estado global: SesionContext, CarritoContext, AvisoContext
│   ├── _lib/
│   │   ├── data/               db.js (base de datos simulada con CRUD), semilla.js, regiones.json, blogs.js
│   │   ├── services/           auth.js (cuentas) y correo.js (EmailJS)
│   │   ├── hooks/              useDatos (datos en tiempo real), useAgregarAlCarrito
│   │   └── utils/              formato, validadores (RUT, correo, teléfono), carrito, reportes
│   ├── admin/                  panel de administración (protegido, con su propio layout.tsx)
│   ├── productos/  categorias/  ofertas/  carrito/  checkout/  compra/
│   ├── login/  registro/  recuperar-contrasena/  mis-pedidos/
│   ├── nosotros/  blogs/  contacto/
│   ├── layout.tsx              estructura base: Bootstrap, fuente Poppins y proveedores
│   ├── page.tsx                página de inicio
│   ├── not-found.tsx           página 404
│   ├── globals.css             estilos propios sobre Bootstrap
│   └── favicon.ico
├── __tests__/                  22 archivos de pruebas (128 casos)
│   └── apoyo/                  utilidades y mocks de next/navigation y next/link
├── public/img/                 imágenes (productos en WebP)
├── docs/                       documento de cobertura de testing y cambios del catálogo
├── db.json                     datos iniciales: productos, categorías, usuarios, órdenes y mensajes
├── .env.example                plantilla de configuración de EmailJS
├── karma.conf.cjs              configuración de Karma + Jasmine + cobertura
├── next.config.ts · tsconfig.json · eslint.config.mjs · next-env.d.ts
├── AGENTS.md                   guía de convenciones del proyecto
└── package.json
```

En Next.js, las carpetas que empiezan con `_` son privadas: guardan código, pero no se convierten en páginas.

---

## Vistas

Siguen los diagramas de navegación de la pauta (Figuras 3 y 10).

### Tienda (pública)

| Vista del diagrama | Ruta |
|---|---|
| Página principal (Home) | `/` |
| Productos y detalle de producto | `/productos`, `/productos/[id]` |
| Categorías y categoría | `/categorias`, `/categorias/[slug]` |
| Ofertas | `/ofertas` |
| Comprar: carro → checkout | `/carrito` → `/checkout` |
| Pago correcto / pago con error | `/compra/exitosa/[numero]`, `/compra/error/[numero]` |
| Iniciar sesión y registro de usuario | `/login`, `/registro` |
| Nosotros, blogs y detalle de blog | `/nosotros`, `/blogs`, `/blogs/[id]` |
| Contacto | `/contacto` |
| *Extras:* recuperar contraseña y mis pedidos | `/recuperar-contrasena`, `/mis-pedidos` |

### Administrador (solo rol admin)

| Vista del diagrama | Ruta |
|---|---|
| Home / Dashboard | `/admin` |
| Órdenes / boletas y mostrar boleta | `/admin/ordenes`, `/admin/ordenes/[numero]` |
| Producto: listado, nuevo, mostrar y editar | `/admin/productos`, `/admin/productos/nuevo`, `/admin/productos/[id]`, `/admin/productos/[id]/editar` |
| Listado de productos críticos y reporte de productos | `/admin/productos/criticos`, `/admin/productos/reporte` |
| Categoría: listado, nueva y editar | `/admin/categorias`, `/admin/categorias/nueva`, `/admin/categorias/[id]/editar` |
| Usuario: listado, nuevo, mostrar, editar e historial de compras | `/admin/usuarios`, `/admin/usuarios/nuevo`, `/admin/usuarios/[id]`, `/admin/usuarios/[id]/editar`, `/admin/usuarios/[id]/historial` |
| Reportes | `/admin/reportes` |
| Perfil | `/admin/perfil` |
| *Extra:* mensajes de contacto | `/admin/mensajes`, `/admin/mensajes/[id]` |

Si alguien entra a `/admin` sin sesión, lo envía a iniciar sesión. Si es un cliente, lo devuelve al inicio.

---

## Cómo se cumplen los requisitos de la pauta

| Requisito | Dónde está |
|---|---|
| Migración de HTML a componentes React reutilizables | `app/_components/`: cada componente tiene una sola responsabilidad y recibe datos y funciones por props. |
| Archivo JS como base de datos simulada con CRUD | `app/_lib/data/db.js`: `listar`, `obtener`, `crear`, `actualizar` y `eliminar` para productos, categorías, usuarios, órdenes y mensajes. |
| Persistencia conectada en tiempo real | `db.js` guarda en localStorage y avisa los cambios. El hook `useDatos` refresca la interfaz: si el admin cambia un precio, el carro se actualiza solo. |
| Diseño responsivo con Bootstrap | Grillas `row-cols-*` (1 producto por fila en móvil, 2 en tablet, 4 en escritorio), navbar colapsable, tablas con scroll y formularios en columnas. |
| Vistas adicionales | Panel de administración completo, detalle de producto, checkout, compra exitosa y pago con error. |
| Interactividad mejorada | Buscador y filtros por categoría y precio, selector de cantidad, validación de RUT, regiones y comunas dependientes, recuperación de contraseña. |
| Entorno de pruebas Jasmine + Karma | `karma.conf.cjs`, con Chrome sin ventana, webpack, babel y cobertura con istanbul. |
| Pruebas unitarias | 128 pruebas en `__tests__/`: renderizado, renderizado condicional, props, estado, eventos y mocks. |

---

## Datos y persistencia

| Dato | Dónde vive |
|---|---|
| Datos iniciales | `db.json` |
| Productos, categorías, usuarios, órdenes y mensajes | `app/_lib/data/db.js`, sobre localStorage |
| Contraseñas y códigos de recuperación | Cifrados con SHA-256 + sal (`app/_lib/services/auth.js`). Nunca en texto plano. |
| Carro y sesión | localStorage: se mantienen al recargar la página |
| Regiones y comunas de Chile | `app/_lib/data/regiones.json` (16 regiones, 346 comunas; fuente: [chile-regiones-comunas](https://github.com/juanbrujo/chile-regiones-comunas)) |

- **Al modificar `db.json`, sube `VERSION_SEMILLA`** en `app/_lib/data/semilla.js`. Así el navegador descarta los datos antiguos y carga los nuevos.
- Para volver a los datos iniciales: Panel admin → Perfil → **Restablecer datos**.
- **Compra:** el pago es simulado. Se aprueba si hay stock y se rechaza si algún producto no alcanza, lo que lleva a la vista de pago con error. Al aprobarse, descuenta el stock y vacía el carro.

---

## Correos con EmailJS

La app envía tres correos:

| Correo | Cuándo | Para quién |
|---|---|---|
| Aviso de contacto | Alguien escribe en **Contacto**. El mensaje además queda en Panel admin → Mensajes. | Correo de la tienda |
| Código de recuperación | **¿Olvidaste tu contraseña?**: código de 6 dígitos que vence a los 15 minutos, admite 5 intentos y sirve una vez. | Usuario |
| Boleta | Botón **Enviar boleta por email** en la compra exitosa | Cliente |

**Sin configurar EmailJS, la app funciona igual (modo demostración).** Los correos se muestran en la consola del navegador y el código de recuperación aparece en pantalla.

### Configurar EmailJS (gratis, unos 10 minutos)

1. Crea una cuenta en https://www.emailjs.com.
2. En **Email Services → Add New Service**, conecta el correo que enviará los mensajes (por ejemplo, un Gmail de la tienda). Copia el **Service ID**.
3. En **Email Templates**, crea tres plantillas. En todas, en *To Email* pon `{{to_email}}`. Copia el **Template ID** de cada una.

   | Plantilla | Asunto sugerido | Contenido (variables disponibles) |
   |---|---|---|
   | Contacto | `Nuevo mensaje de {{nombre}}` | `{{nombre}} ({{correo}}) escribió: {{mensaje}}`. En *Reply To* pon `{{reply_to}}`. |
   | Recuperar contraseña | `Recupera tu contraseña` | `Hola {{to_name}}, tu código es {{codigo}}. Vence en {{minutos}} minutos.` |
   | Boleta | `Boleta de tu compra n.º {{numero}}` | `Hola {{to_name}}: {{detalle}} · {{entrega}} · Despacho: {{despacho}} · Total: {{total}}` |

4. En **Account → General**, copia tu **Public Key**.
5. Copia `.env.example` como `.env.local`, completa los datos y reinicia `npm run dev`.

`.env.local` no se sube a GitHub (está en `.gitignore`). La Public Key de EmailJS está pensada para usarse en el navegador; en EmailJS se puede limitar a tu dominio. El plan gratuito tiene un límite mensual de envíos.

---

## Pruebas

```bash
npm test
```

- **Resultado:** 128 de 128 pruebas exitosas, en 22 archivos. Cada prueba aparece en la consola con su nombre y un ✓.
- **Cobertura obtenida:** 88,77 % de sentencias, 78,99 % de ramas, 89,88 % de funciones y 92,47 % de líneas.
- **Cobertura:** `coverage/html/index.html` (abrir en el navegador) y resumen en `coverage/resumen.txt`.
- **Detalle:** la matriz de pruebas y su análisis están en `docs/COBERTURA_TESTING.md`.

| Tipo de prueba (según la pauta) | Ejemplos |
|---|---|
| Renderizado correcto | `ListaProductos` dibuja una tarjeta por producto; `Categorias` muestra los productos de la categoría de la URL. |
| Renderizado condicional | `MensajeAlerta` solo aparece si hay un error; `RutaProtegida` oculta el panel a quien no es admin. |
| Props | `Boton` recibe la etiqueta y la función `onClick`; `ProductoCard` muestra el producto que recibe. |
| Estado | Los formularios de login y contacto cambian al escribir; `SelectorCantidad` sube y baja entre 1 y 99. |
| Eventos | Un clic en "Agregar al carro" llama a `onAgregar` con la cantidad elegida; el checkout navega a la compra exitosa. |
| Mocks | Router de Next (`router.push`), `fetch` hacia EmailJS, `servicioCorreo`, `Date.now` (vencimiento del código), `window.confirm` y `window.print`. |

**Para ver el reporte visual de Jasmine en Chrome:** `npx karma start karma.conf.cjs --browsers Chrome`. Las pruebas se repiten cada vez que guardas un archivo. No hagas clic en los nombres de las pruebas dentro de esa página, porque recargan la página y Karma se desconecta. Para cerrar, presiona Ctrl + C en la consola.

**Si Karma no encuentra Chrome** (por ejemplo, si solo tienes Edge), en PowerShell:

```
$env:CHROME_BIN="C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"; npm test
```

---

## Solución de problemas

| Problema | Solución |
|---|---|
| `npm error enoent Could not read package.json` | Estás en otra carpeta. Entra a la que tiene `package.json` (usa `dir` en Windows para revisar). |
| No aparecen productos o imágenes nuevas | Sube `VERSION_SEMILLA`, o borra el localStorage (F12 → Application → Local Storage). |
| El puerto 3000 está ocupado | `npm run dev -- -p 3001` |
| Next pide una versión más nueva de Node | Instala Node.js 20.9 o superior desde https://nodejs.org. |
| Los correos no llegan | Revisa `.env.local`, reinicia `npm run dev` y mira la carpeta de spam. Sin configuración, los correos solo aparecen en la consola. |

---

## Entregables de la Evaluación 2

- [ ] Enlace público del repositorio en GitHub
- [ ] Proyecto comprimido (sin la carpeta `node_modules`)
- [ ] Documento ERS actualizado (V2)
- [x] Documento de cobertura de testing (`docs/COBERTURA_TESTING.md`), con los resultados de `npm test`
