'use client';

/** Muestra una alerta de Bootstrap solo cuando hay un mensaje (renderizado condicional). */
export default function MensajeAlerta({ mensaje, tipo = 'danger', onCerrar }) {
  if (!mensaje) return null;
  return (
    <div className={`alert alert-${tipo} d-flex justify-content-between align-items-start`} role="alert">
      <span>{mensaje}</span>
      {onCerrar && <button type="button" className="btn-close ms-3" aria-label="Cerrar" onClick={onCerrar} />}
    </div>
  );
}
