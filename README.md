# C & D Distribuidora Mayorista - Proyecto Comercio

Plataforma frontend de proyecto anterior de Microservicios desarrollada para Gestion de Inventario y Venta de Producto

---

## 🔗 Enlaces del Proyecto

* **Repositorio en GitHub:** [https://cleiva85.github.io/FullStack-II/]

---

## 🏢 Sobre la Empresa

> **C & D Distribuidora Mayorista** Nacida como un emprendimiento familiar, C & D Distribuidora Mayorista trabaja día a día para ser el socio estratégico de los comerciantes locales. Entendemos el esfuerzo que hay detrás de cada negocio de barrio; por eso, ofrecemos una atención cercana, facilidades de compra y un catálogo seleccionado de productos de primera necesidad al mejor precio mayorista..

---

## 🚀 Características y Cumplimiento Técnico

### 1. Estructura y Semántica HTML5
* Marcado semántico estandarizado: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>` y `<footer>`.
* Cabecera fija (`position: sticky`) con enlace de marca directo al catálogo principal y barra de navegación responsive.
* Integración de recursos multimedia: iframe con ubicación física de la distribuidora en Maipú y reproductor de video institucional en proporción 16:9.

### 2. Catálogo Oficial de Productos
Despliegue de los 10 productos base con insignias de categoría, descripción y precio unitario:
* **Bebidas y Gaseosas:** Coca-Cola Original 1.5L, Pepsi Regular 500ml.
* **Lácteos:** Leche Entera 1L Colun, Leche SemiDescremada 1L Colun.
* **Desayuno y Once:** Queso Gouda Trozo 500g Colun, Manjar Tradicional 200g Nestlé.
* **Confitería y Snacks:** Chocolate Vizzio Costa, Galletas Triton McKay, Ramitas Sabor Queso Evercrisp, Galletas Morochas McKay.

### 3. Diseño y Estilos Personalizados (CSS3)
* Hoja de estilos externa e integrada (`estilo.css`).
* Variables de diseño centralizadas en `:root` para paleta de colores corporativa (tonos morados, lavanda y menta para precios).
* Tipografía modular importada (*Poppins*).
* Grilla responsiva fluida mediante CSS Grid (`minmax(220px, 1fr)`) y Flexbox adaptada para resoluciones móviles y de escritorio.

### 4. Lógica y Validaciones en JavaScript
Control del formulario de clientes (`Registro.html`) mediante funciones dedicadas de validación y retroalimentación:
* **Feedback en Consola:** Uso de funciones específicas (`funcionCorrecto` y `funcionError`) que informan en consola el estado individual de cada campo procesado (`-- función validación: [Campo] --` / `-- función error: [Campo] --`).
* **RUT Chileno:** Control de formato sin puntos y con guion mediante expresión regular (`/^[0-9]{7,8}-[0-9kK]{1}$/`).
* **Identidad:** Longitud mínima obligatoria de 2 caracteres en nombre y apellido.
* **Nombre de Usuario:** Mínimo 4 caracteres requeridos para la generación de cuenta.
* **Correo Electrónico:** Verificación de formato y sintaxis de correo electrónico.
* **Teléfono:** Validación de formato móvil chileno de 9 dígitos o con prefijo nacional (+569).
* **Dirección y Comuna:** Longitud mínima de despacho y asistencia predictiva mediante `<datalist>` para comunas.
* **Contraseñas:** Control de longitud mínima (6 caracteres) y validación estricta de coincidencia entre clave y confirmación.
* **Confirmación de Envío:** Notificación visual emergente (`alerta-exito`) y resumen de datos estructurados por consola (`console.table`) al registrar correctamente.

---

## 📁 Estructura del Directorio

```text
FullStack-II/
├── index.html                  # Catálogo comercial, portada institucional y mapa
├── Registro.html               # Formulario de registro con validaciones JS
├── estilo.css                  # Hoja de estilos externa compartida
├── README.md                   # Documentación técnica del proyecto
└── *.jpeg / *.webp             # Recursos gráficos oficiales del catálogo


👥 Equipo y Asignatura
Alumnas: Claudia Leiva - Dayana Seguel
Carrera: Ingeniería en Informática
Institución: Duoc UC
Asignatura: Desarrollo FullStack II (DSY1104)
Evaluación: Evaluación Parcial 1 (30%)
