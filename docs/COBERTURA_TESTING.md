# Documento de cobertura de testing — C & D Distribuidora (Next.js + React)

## 1. Herramientas y configuración

| Herramienta | Rol |
|---|---|
| **Jasmine** | Framework en que se escriben las pruebas (`describe`, `it`, `expect`, `spyOn`, `jasmine.createSpy`). |
| **Karma** | Ejecutor: abre Chrome sin ventana (`ChromeHeadless`), carga las pruebas y reporta resultados. |
| **karma-webpack + Babel** | Compilan JSX y módulos ES para el navegador durante las pruebas. |
| **babel-plugin-istanbul + karma-coverage** | Instrumentan el código y generan el reporte de cobertura (HTML, resumen de texto y lcov). |
| **React Testing Library** | Renderiza componentes y los consulta como lo haría un usuario (por texto, rol o etiqueta). |
| **Mocks de Next.js** | `next/navigation` y `next/link` se reemplazan por versiones de prueba (`__tests__/apoyo/`) con espías de Jasmine en `router.push` y `router.replace`. |

Archivos clave: `karma.conf.cjs`, `__tests__/apoyo/entorno.js` (preparación del navegador), `__tests__/apoyo/utilidades.tsx` (render con contextos y navegación simulada) y `__tests__/apoyo/mock-next-*.js` (mocks del router de Next).

Comando: `npm test` en la raíz del proyecto. Los archivos de prueba y utilidades se excluyen del cálculo de cobertura.

## 2. Estrategia

Las pruebas siguen los cinco tipos que propone la pauta:

1. **Renderizado correcto:** los componentes muestran los datos que reciben (por ejemplo, la lista dibuja una tarjeta por producto).
2. **Renderizado condicional:** elementos que aparecen u ocultan según el estado (mensaje de error, "Sin stock", panel solo para administradores).
3. **Propiedades (props):** los componentes usan las props recibidas (etiqueta y `onClick` del botón, producto de la tarjeta).
4. **Estado (state):** el estado cambia con la interacción (formularios al escribir, cantidad del selector, carro global).
5. **Eventos:** clics y cambios disparan las funciones esperadas o cambian el estado.

Además se prueba la **lógica sin interfaz** (carro, base de datos simulada, validadores y reportes) y el **servicio de cuentas** (registro, login y recuperación de contraseña) usando mocks.

## 3. Uso de mocks

| Mock | Dónde | Para qué |
|---|---|---|
| Router de Next (`next/navigation`) con `jasmine.createSpy` | `IniciarSesion`, `Checkout`, `RutaProtegida`, `RecuperarContrasena`, `Categorias` | Comprobar a qué página se navega (`router.push`, `router.replace`) y entregar parámetros de la URL sin servidor. |
| `spyOn(window, 'fetch')` con respuestas falsas | `correo.spec` | Probar el envío a EmailJS (datos enviados, error 400 y sin conexión) sin mandar correos reales. |
| `spyOn(servicioCorreo, 'enviarCodigo' / 'enviarContacto' / 'enviarBoleta')` | `auth.spec`, `RecuperarContrasena.spec`, `Contacto.spec`, `CompraExitosa.spec` | Capturar el código de recuperación y simular que el correo se envió o falló. |
| `spyOn(window, 'confirm')` y `spyOn(window, 'print')` | `MensajesAdmin.spec`, `CompraExitosa.spec` | Aceptar la confirmación al eliminar y comprobar que se abre la impresión de la boleta. |
| `spyOn(Date, 'now')` | `auth.spec` | Adelantar el reloj para probar que el código vence a los 15 minutos. |
| `jasmine.createSpy` como props | `Boton`, `ProductoCard`, `SelectorCantidad`, `FiltrosProductos`, `MensajeAlerta`, `SelectorRegionComuna` | Verificar que el componente llama a la función recibida y con qué argumentos. |
| Sesión falsa en localStorage (`iniciarSesionFalsa`) | `RutaProtegida.spec`, `Checkout.spec` | Simular un cliente o un administrador conectado. |

## 4. Matriz de pruebas (128 casos en 22 archivos)

| Archivo | Qué se prueba | Tipo | Casos |
|---|---|---|---|
| `Boton.spec` | Etiqueta, `onClick`, deshabilitado y variante | Props, eventos | 4 |
| `MensajeAlerta.spec` | Aparece solo con mensaje, tipo y botón cerrar | Render condicional | 4 |
| `ListaProductos.spec` | Una tarjeta por producto, nombres y lista vacía | Render, condicional | 3 |
| `ProductoCard.spec` | Datos, oferta, cantidad elegida y sin stock | Props, estado, eventos | 4 |
| `SelectorCantidad.spec` | + y −, límites 1–99 y máximo por stock | Estado, eventos | 5 |
| `FiltrosProductos.spec` | Buscador, categoría, contador y lógica de filtro/orden | Eventos, lógica | 7 |
| `SelectorRegionComuna.spec` | 16 regiones, comunas dependientes y errores | Estado, eventos | 4 |
| `Categorias.spec` | Todas, categoría de la URL y categoría inexistente | Render, mocks de router | 3 |
| `IniciarSesion.spec` | Estado al escribir, validación, login, admin, `next`, error y enlace de recuperación | Estado, mocks, navegación | 7 |
| `RecuperarContrasena.spec` | Correo no válido, envío del código, correo no registrado, validaciones, cambio exitoso e intentos | Flujo completo, mocks | 6 |
| `RutaProtegida.spec` | Sin sesión, cliente y administrador | Render condicional, mocks de router | 3 |
| `Checkout.spec` | Total con despacho, retiro, validación, pago exitoso, pago rechazado y sesión | Flujo completo | 6 |
| `Contacto.spec` | Estado del formulario, errores, mensaje guardado, aviso por correo y fallo del correo | Estado, condicional, mocks | 4 |
| `MensajesAdmin.spec` | Listado, filtro por estado, detalle que marca leído, respondido y eliminar | Render, eventos, mocks | 5 |
| `correo.spec` | Envío simulado, aviso de contacto, código de recuperación, boleta, error 400 y sin conexión | Mocks de fetch | 6 |
| `CompraExitosa.spec` | Resumen de la compra, orden rechazada, imprimir, enviar boleta y fallo del envío | Render condicional, eventos, mocks | 5 |
| `CarritoContext.spec` | Agregar, persistencia, cambiar, quitar, vaciar y precio en tiempo real | Estado global | 6 |
| `auth.spec` | Cifrado con sal, registro, duplicados, login, código de un solo uso, vencimiento, intentos, correo real y fallo del correo | Lógica, mocks | 10 |
| `carrito.spec` | Funciones puras del carro | Lógica | 8 |
| `db.spec` | CRUD de productos, categorías, órdenes, usuarios y mensajes; suscripción | Lógica (CRUD) | 14 |
| `validadores.spec` | RUT, correo, teléfono, contraseña, checkout y producto | Lógica | 8 |
| `formato-reportes.spec` | Formato CLP, descuentos, slugs y cálculos de reportes | Lógica | 6 |

**Componentes y módulos cubiertos directamente:** Boton, MensajeAlerta, CampoFormulario, Precio, TablaItems, RutaProtegida, ProductoCard, ListaProductos, SelectorCantidad, FiltrosProductos, SelectorRegionComuna, Categorías, IniciarSesion, RecuperarContrasena, Contacto, Mensajes (admin), Checkout, CompraExitosa, SesionContext, CarritoContext, db.js, auth.js, correo.js, carrito.js, formato.js, validadores.js y reportes.js.

**No cubiertos por pruebas unitarias (se verifican manualmente):** páginas del panel de administración (salvo Mensajes), Encabezado, Carrusel y páginas informativas (Nosotros, Blog). Son vistas que principalmente muestran datos ya probados en `db.spec` y `reportes`.

## 5. Resultados

Ejecución con `npm test` en Chrome Headless 155 (Windows 10), el 27-10-2026.

**Resultado: 128 de 128 pruebas exitosas** (`Executed 128 of 128 SUCCESS`), en 22 archivos.

| Métrica | Cubierto | % |
|---|---|---|
| Sentencias (Statements) | 688 de 775 | **88,77 %** |
| Ramas (Branches) | 455 de 576 | **78,99 %** |
| Funciones (Functions) | 240 de 267 | **89,88 %** |
| Líneas (Lines) | 541 de 585 | **92,47 %** |

El detalle por archivo está en `coverage/html/index.html` (adjuntar una captura) y en `coverage/resumen.txt`.

La cobertura mide el código que cargan las pruebas: componentes, contextos, servicios, datos y utilidades. Las páginas que ninguna prueba importa (la mayoría del panel de administración, Encabezado, Carrusel, Nosotros y Blog) no entran en el cálculo, y se verificaron manualmente.

## 6. Análisis

- **Líneas y sentencias (92 % y 89 %):** casi todo el código probado se ejecuta en alguna prueba. Lo que falta son mensajes de error poco frecuentes y ramas defensivas, por ejemplo cuando localStorage no está disponible.
- **Ramas (79 %), la métrica más baja:** cada `if`, `? :` y `&&` cuenta dos caminos. Los que no se recorren son sobre todo combinaciones de validación de formularios (cada campo con cada tipo de error) y estados visuales secundarios, como los botones de "Enviando…". Las reglas de negocio (stock, precios de oferta, vencimiento del código, intentos fallidos y duplicados en el registro) sí tienen sus dos caminos probados.
- **Funciones (90 %):** las funciones sin probar son principalmente de reportes y de categorías del panel de administración (renombrar en cascada se prueba; algunos cálculos de reportes no).
- **Lógica de negocio:** carro, base de datos, validadores y reportes tienen pruebas de casos normales y de borde (cantidad 0, stock insuficiente, datos dañados en localStorage).
- **Flujo de compra completo:** se prueba la validación, el pago aprobado (descuenta stock y vacía el carro) y el pago rechazado (conserva el carro y registra la orden como rechazada).
- **Mocks:** el router de Next permite comprobar cada navegación sin levantar el servidor; el mock del reloj (`Date.now`) prueba el vencimiento del código sin esperar 15 minutos; el mock de `fetch` prueba el envío a EmailJS y sus errores sin mandar correos reales.

**Mejoras propuestas:** agregar pruebas a los formularios del panel de administración (nuevo y editar producto y usuario) y a las combinaciones de errores de validación. Con eso deberían subir sobre todo las ramas.
