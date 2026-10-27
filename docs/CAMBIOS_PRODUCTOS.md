# Actualización del catálogo de productos

## Imágenes
- Las 58 fotos de `Productos.zip` están en `public/img/productos/` en formato **WebP** de máximo 400 px. Pasaron de 5,9 MB a 0,66 MB, para que la tienda cargue más rápido.
- Se eliminaron del repo las ilustraciones `.svg` y las fotos `.jpeg` antiguas que dejaron de usarse.
- `Duraznos en Conserva` usa `Durazno_en_conserva.webp`, que se agregó después.
- `Agua_conGas.png` (Cachantun con gas) se incorporó, pero no se usa: el producto 17 es Benedictino y usa `Agua_conGas_B`.

## Datos
- Todos los cambios de `Cambiar productos.txt` quedaron en `db.json`.
- Harina: el producto 40 pasó a ser **Harina Sin Polvos de Hornear** y se agregó el 58, **Harina Con Polvos de Hornear**. Ambas son Selecta 1 kg y cuestan $1.190.
- Queso Mantecoso Laminado: la marca cambió de Colun a **Río Bueno**, porque así aparece en la foto.
- Se agregó `VERSION_SEMILLA` (ahora versión 3). Cuando cambia, `db.js` descarta los datos guardados en el navegador y carga los nuevos. **Cada vez que se modifique la semilla, hay que subir ese número.**
