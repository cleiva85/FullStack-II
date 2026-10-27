# Documento de cobertura de testing — C & D Distribuidora (frontend React)

## 1. Herramientas y configuración

| Herramienta | Rol |
|---|---|
| **Jasmine** | Framework en que se escriben las pruebas (`describe`, `it`, `expect`, `spyOn`, `jasmine.createSpy`). |
| **Karma** | Ejecutor: abre Chrome sin ventana (`ChromeHeadless`), carga las pruebas y reporta resultados. |
| **karma-webpack + Babel** | Compilan JSX y módulos ES para el navegador durante las pruebas. |
| **babel-plugin-istanbul + karma-coverage** | Instrumentan el código y generan el reporte de cobertura (HTML, resumen de texto y lcov). |
| **React Testing Library** | Renderiza componentes y los consulta como lo haría un usuario (por texto, rol o etiqueta). |

Archivos clave: `frontend/karma.conf.cjs`, `frontend/src/test/entorno.js` (preparación del navegador) y `frontend/src/test/utilidades.jsx` (render con router y contextos, respuestas falsas de `fetch`).

Comando: `npm test` dentro de `frontend`. Los archivos de prueba y utilidades se excluyen del cálculo de cobertura.

## 2. Estrategia

Las pruebas siguen los cinco tipos que propone la pauta:

1. **Renderizado correcto:** los componentes muestran los datos que reciben (por ejemplo, la lista dibuja una tarjeta por producto).
2. **Renderizado condicional:** elementos que aparecen u ocultan según el estado (mensaje de error, "Sin stock", panel solo para administradores).
3. **Propiedades (props):** los componentes usan las props recibidas (etiqueta y `onClick` del botón, producto de la tarjeta).
4. **Estado (state):** el estado cambia con la interacción (formularios al escribir, cantidad del selector, carro global).
5. **Eventos:** clics y cambios disparan las funciones esperadas o cambian el estado.

Además se prueba la **lógica sin interfaz** (carro, base de datos simulada, validadores y reportes) y la **comunicación con el backend usando mocks**.

## 3. Uso de mocks

| Mock | Dónde | Para qué |
|---|---|---|
| `spyOn(window, 'fetch')` con respuestas falsas | `api.spec`, `IniciarSesion.spec`, `SelectorRegionComuna.spec`, `Checkout.spec` | Probar login, regiones y pedidos sin encender el backend, incluidos los errores 401/400 y el servidor apagado. |
| `jasmine.createSpy` como props | `Boton`, `ProductoCard`, `SelectorCantidad`, `FiltrosProductos`, `MensajeAlerta` | Verificar que el componente llama a la función recibida y con qué argumentos. |
| Sesión falsa en localStorage (`iniciarSesionFalsa`) | `RutaProtegida.spec`, `Checkout.spec` | Simular un cliente o un administrador conectado. |
| `MemoryRouter` con rutas de destino | `IniciarSesion.spec`, `Checkout.spec`, `RutaProtegida.spec` | Comprobar a qué página navega la app sin abrir un navegador real. |

## 4. Matriz de pruebas (94 casos en 17 archivos)

| Archivo | Qué se prueba | Tipo | Casos |
|---|---|---|---|
| `Boton.spec` | Etiqueta, `onClick`, deshabilitado y variante | Props, eventos | 4 |
| `MensajeAlerta.spec` | Aparece solo con mensaje, tipo y botón cerrar | Render condicional | 4 |
| `ListaProductos.spec` | Una tarjeta por producto, nombres y lista vacía | Render, condicional | 3 |
| `ProductoCard.spec` | Datos, oferta, cantidad elegida y sin stock | Props, estado, eventos | 4 |
| `SelectorCantidad.spec` | + y −, límites 1–99 y máximo por stock | Estado, eventos | 5 |
| `FiltrosProductos.spec` | Buscador, categoría, contador y lógica de filtro/orden | Eventos, lógica | 7 |
| `SelectorRegionComuna.spec` | Carga desde la API, comunas dependientes y error de red | Mocks, estado | 4 |
| `IniciarSesion.spec` | Estado al escribir, validación, login, rol admin, `next` y error | Estado, mocks, navegación | 6 |
| `RutaProtegida.spec` | Sin sesión, cliente y administrador | Render condicional | 3 |
| `Checkout.spec` | Total con despacho, retiro, validación, pago exitoso, pago rechazado y sesión | Flujo completo, mocks | 6 |
| `Contacto.spec` | Estado del formulario, errores y éxito | Estado, condicional | 3 |
| `CarritoContext.spec` | Agregar, persistencia, cambiar, quitar, vaciar y precio en tiempo real | Estado global | 6 |
| `carrito.spec` | Funciones puras del carro | Lógica | 8 |
| `db.spec` | CRUD de productos, categorías, órdenes y usuarios; suscripción | Lógica (CRUD) | 13 |
| `validadores.spec` | RUT, correo, teléfono, contraseña, checkout y producto | Lógica | 8 |
| `formato-reportes.spec` | Formato CLP, descuentos, slugs y cálculos de reportes | Lógica | 6 |
| `api.spec` | Token en encabezado, errores HTTP y servidor apagado | Mocks | 4 |

**Componentes y módulos cubiertos directamente:** Boton, MensajeAlerta, CampoFormulario, Precio, TablaItems, RutaProtegida, ProductoCard, ListaProductos, SelectorCantidad, FiltrosProductos, SelectorRegionComuna, IniciarSesion, Contacto, Checkout, SesionContext, CarritoContext, db.js, api.js, carrito.js, formato.js, validadores.js y reportes.js.

**No cubiertos por pruebas unitarias (se verifican manualmente):** páginas del panel de administración, Encabezado, Carrusel y páginas informativas (Nosotros, Blog). Son vistas que principalmente muestran datos ya probados en `db.spec` y `reportes`.

## 5. Resultados

> Completar después de ejecutar `npm test` en `frontend`. Copiar los valores de `coverage/resumen.txt` y adjuntar una captura de `coverage/html/index.html`.

| Métrica | % |
|---|---|
| Sentencias (Statements) | |
| Ramas (Branches) | |
| Funciones (Functions) | |
| Líneas (Lines) | |

Resultado de ejecución: ___ de 94 pruebas exitosas.

Backend (`cd backend && npm test`): 5 pruebas de la API (registro, login, sesión, pedidos, administrador).

## 6. Análisis

- Las funciones de lógica (carro, base de datos, validadores, reportes) concentran las reglas del negocio y tienen pruebas de casos normales y de borde (cantidad 0, stock insuficiente, datos dañados en localStorage).
- El flujo de compra se prueba de punta a punta: validación, pago aprobado (descuenta stock y vacía el carro) y pago rechazado (conserva el carro y registra la orden como rechazada).
- Los mocks de `fetch` permiten probar los errores del backend (credenciales incorrectas, servidor apagado), que en una prueba manual son difíciles de reproducir.
- Mejora pendiente: agregar pruebas a las vistas del panel de administración (formularios de producto y usuario).
