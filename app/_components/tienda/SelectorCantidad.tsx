'use client';

/** Selector − / número / + . Componente controlado: el valor lo maneja el padre. */
export default function SelectorCantidad({ valor, onCambiar, min = 1, max = 99, etiqueta = 'Cantidad' }) {
  const ajustar = (n) => Math.max(min, Math.min(max, Number.isNaN(n) ? min : n));
  return (
    <div className="input-group input-group-sm selector-cantidad" role="group" aria-label={etiqueta}>
      <button type="button" className="btn btn-outline-secondary" aria-label="Quitar uno"
        onClick={() => onCambiar(ajustar(valor - 1))} disabled={valor <= min}>−</button>
      <input
        type="number"
        className="form-control text-center"
        aria-label={etiqueta}
        min={min}
        max={max}
        value={valor}
        onChange={(e) => onCambiar(ajustar(parseInt(e.target.value, 10)))}
      />
      <button type="button" className="btn btn-outline-secondary" aria-label="Agregar uno"
        onClick={() => onCambiar(ajustar(valor + 1))} disabled={valor >= max}>+</button>
    </div>
  );
}
