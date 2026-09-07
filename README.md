# Proyecto Comercio 

Plataforma web desarrollada para la **Evaluación Formativa N° 1** de la asignatura **Desarrollo FullStack II (DSY1104)**. El proyecto implementa la interfaz visual y el sistema de registro de clientes para una distribuidora mayorista, alineado con el ecosistema de microservicios y la base de datos relacional de **Proyecto Comercio**.

---

## Enlaces del Proyecto

* **Sitio Web en Vivo (GitHub Pages):** [https://cleiva85.github.io/FullStack-II/](https://cleiva85.github.io/FullStack-II/)
* **Formulario de Registro:** [https://cleiva85.github.io/FullStack-II/Registro.html](https://cleiva85.github.io/FullStack-II/Registro.html)

---

## Características del Proyecto
### 1. Estructura y Semántica HTML5 (IL1.1)
* Marcado semántico estructurado: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>` y `<footer>`.
* Barra de navegación con fijación superior (`position: sticky`) y enlaces ancla funcionales (`#catalogo`, `#ubicacion`).
* Sección de promoción interactiva destacada para el pack mayorista de abarrotes.
* Integración de mapa interactivo con `<iframe>` para la sucursal física en General Ordoñez 90, Maipú.

### 2. Catálogo Oficial Integrado (C & D Distribuidora Mayorista)
Despliegue de los 10 productos exactos de la distribuidora:
* **Bebidas y Gaseosas:** Coca-Cola Original 1.5L, Pepsi Regular 500ml.
* **Lácteos:** Leche Entera 1L Colun, Leche SemiDescremada 1L Colun.
* **Desayuno y Once:** Queso Gouda Trozo 500g Colun, Manjar Tradicional 200g Nestlé.
* **Confitería y Snacks:** Chocolate Vizzio Costa, Galletas Triton McKay, Ramitas Sabor Queso Evercrisp, Galletas Morochas McKay.

### 3. Estilos y Diseño Visual (CSS3)
* Hoja de estilos externa (`estilo.css`) centralizada con variables CSS (`:root`).
* Paleta temática oscura personalizada (fondo negro `#000000` con detalles en tonos púrpura, lavanda y menta `#00b894`).
* Grilla responsiva mediante `display: grid` y `minmax(220px, 1fr)` sin desbordamientos horizontales.
* Selectores obligatorios de taller: `#contenedor_formulario` y `.mensaje_error`.

### 4. Validaciones con JavaScript (IL1.2)
Validación en tiempo real para el formulario de registro (`Registro.html`):
* **RUT Chileno:** Formato con guion y dígito verificador mediante expresión regular.
* **Campos Alfabéticos:** Control de nombre y apellido sin caracteres numéricos ni especiales.
* **Nombre de Usuario:** Longitud mínima de 4 caracteres para sincronización de credenciales.
* **Correo Electrónico:** Verificación de estructura válida con formato de dominio.
* **Teléfono:** Validación de formato numérico (+569).
* **Comuna:** Asistencia predictiva de comunas mediante `<datalist>`.
* **Contraseñas:** Control de longitud mínima y verificación de coincidencia exacta.
* **Términos y Condiciones:** Checkbox de aceptación obligatorio para el envío.

---

## Estructura del Repositorio

```text
FullStack-II/
├── index.html              # Catálogo comercial C & D, promociones y mapa Maipú
├── Registro.html           # Formulario de registro de clientes y usuarios
├── estilo.css              # Hoja de estilos externa compartida
├── README.md               # Documentación técnica del proyecto
└── *.jpeg / *.webp         # Recursos gráficos de los 10 productos oficiales
