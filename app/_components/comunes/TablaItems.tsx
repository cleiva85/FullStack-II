'use client';

import { clp } from '@/app/_lib/utils/formato';

/**
 * Tabla de productos de un carro u orden.
 * items: [{ id, nombre, img?, precioUnitario | precio, cantidad }]
 * Si recibe onCambiar/onQuitar, muestra los controles para editar cantidades.
 */
export default function TablaItems({ items, onCambiar, onQuitar }) {
  const editable = Boolean(onCambiar);
  return (
    <div className="table-responsive">
      <table className="table align-middle mb-0">
        <thead>
          <tr>
            <th scope="col">Producto</th>
            <th scope="col" className="text-end">Precio</th>
            <th scope="col" className="text-center">Cantidad</th>
            <th scope="col" className="text-end">Subtotal</th>
            {editable && <th scope="col"><span className="visually-hidden">Acciones</span></th>}
          </tr>
        </thead>
        <tbody>
          {items.map((i) => {
            const precio = i.precioUnitario ?? i.precio;
            return (
              <tr key={i.id}>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    {i.img && <img src={i.img} alt="" className="miniatura" />}
                    <span>{i.nombre}</span>
                  </div>
                </td>
                <td className="text-end">{clp(precio)}</td>
                <td className="text-center">
                  {editable ? (
                    <div className="btn-group btn-group-sm" role="group" aria-label={`Cantidad de ${i.nombre}`}>
                      <button type="button" className="btn btn-outline-secondary" aria-label="Quitar uno" onClick={() => onCambiar(i.id, -1)}>−</button>
                      <span className="btn btn-light disabled px-3">{i.cantidad}</span>
                      <button type="button" className="btn btn-outline-secondary" aria-label="Agregar uno" onClick={() => onCambiar(i.id, 1)}>+</button>
                    </div>
                  ) : i.cantidad}
                </td>
                <td className="text-end">{clp(precio * i.cantidad)}</td>
                {editable && (
                  <td className="text-end">
                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onQuitar(i.id)}>Eliminar</button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
