# C & D Distribuidora Mayorista — Evaluación Parcial 2 (DSY1104)

Tienda online migrada de HTML/JS a **React + Bootstrap**, con **pruebas unitarias en Jasmine + Karma** y un **backend en Node.js** para cuentas y pedidos.

## Estructura

```
Proyecto_Comercio/
├── backend/            API REST en Node.js (sin dependencias externas)
│   ├── server.js       registro, login (token), sesión, regiones, pedidos
│   ├── lib/            validadores (RUT, correo, teléfono) y catálogo base
│   ├── datos/          regiones y comunas de Chile (16 regiones, 346 comunas)
│   └── tests/          pruebas de la API (node --test)
├── frontend/           aplicación React (Vite)
│   ├── src/
│   │   ├── components/ comunes/ · tienda/ · admin/   (componentes reutilizables)
│   │   ├── pages/      tienda/ (16 vistas) · admin/ (16 vistas)
│   │   ├── context/    sesión, carro y avisos (estado global)
│   │   ├── data/       db.js = base de datos simulada con CRUD + semilla.js
│   │   ├── services/   api.js = comunicación con el backend
│   │   ├── utils/      formato, validadores, lógica del carro y reportes
│   │   └── __tests__/  17 archivos de pruebas Jasmine (94 casos)
│   ├── karma.conf.cjs  configuración de Karma + Jasmine + cobertura
│   └── vite.config.js  servidor de desarrollo y proxy /api → backend
└── docs/               documento de cobertura de testing
```

## Cómo ejecutarlo

Requiere **Node.js 18 o superior** y **Google Chrome** (para las pruebas).

```bash
# 1) Instalar dependencias del frontend (solo la primera vez)
cd frontend
npm install

# 2) Terminal 1: backend (API en http://localhost:3000)
cd backend
npm start

# 3) Terminal 2: frontend (abre http://localhost:5173)
cd frontend
npm run dev
```

Desde la carpeta raíz también funcionan `npm run instalar`, `npm run backend` y `npm run dev`.

**Cuenta de administrador de demostración:** usuario `admin`, contraseña `admin123` (se crea sola la primera vez que corre el backend).

## Pruebas

```bash
cd frontend
npm test            # corre las 94 pruebas una vez y genera la cobertura
npm run test:watch  # deja Karma abierto y vuelve a correr al guardar
```

- Resultado de cobertura: `frontend/coverage/html/index.html` (abrir en el navegador) y resumen en `frontend/coverage/resumen.txt`.
- Pruebas del backend: `cd backend && npm test`.
- Si Karma no encuentra Chrome (por ejemplo, si solo tienes Edge), indica la ruta antes de correr las pruebas.
  En PowerShell: `$env:CHROME_BIN="C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"; npm test`

## Vistas (según el diagrama de navegación de la pauta)

**Tienda:** Inicio, Productos, Detalle de producto, Categorías y categoría, Ofertas, Carro, Checkout, Compra exitosa, Pago con error, Iniciar sesión, Registro, Nosotros, Blog y detalle de blog, Contacto, Mis pedidos.

**Administrador** (`/admin`, solo rol admin): Dashboard, Órdenes/boletas y Mostrar boleta, Productos (nuevo, mostrar, editar), Productos críticos, Reporte de productos, Categorías (nueva, editar), Usuarios (nuevo, mostrar, editar, historial de compras), Reportes y Perfil.

## Cómo funcionan los datos

| Dato | Dónde vive | Por qué |
|---|---|---|
| Productos, categorías, usuarios del panel, órdenes | `frontend/src/data/db.js` (localStorage) | La pauta pide un archivo JS que actúe como base de datos con CRUD. Los componentes se suscriben y se actualizan en tiempo real. |
| Carro de compras | `CarritoContext` (localStorage) | Se mantiene al recargar la página. |
| Cuentas, contraseñas y sesión | Backend Node (`backend/data/usuarios.json`) | Las contraseñas se guardan cifradas (scrypt) y la sesión usa un token firmado. |
| Pedidos de clientes con sesión | Backend Node (`backend/data/pedidos.json`) | Se ven en "Mis pedidos". |

Para volver a los datos iniciales del catálogo: Panel admin → Perfil → **Restablecer datos**.

## Cambios respecto a la Evaluación 1

- Las páginas `index.html`, `Registro.html`, `Login.html` y `Carrito.html` pasaron a componentes React. Las versiones HTML quedan en el historial de Git.
- Se agregó Bootstrap 5 y diseño responsivo (grillas `row-cols`, navbar colapsable, tablas con scroll).
- El selector de cantidad al agregar al carro quedó como componente (`SelectorCantidad`).
- El pago simula un rechazo cuando no alcanza el stock, para mostrar la vista "Pago con error".
- Nuevas vistas: categorías, ofertas, checkout, compra exitosa, pago con error, blog, contacto y todo el panel de administración.
