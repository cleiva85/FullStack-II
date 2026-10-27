/* Se carga antes de las pruebas. Algunas librerías leen process.env,
   que no existe en el navegador: se define un objeto vacío. */
window.process = window.process || { env: {} };
