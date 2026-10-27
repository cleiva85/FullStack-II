'use client';

/** Campo de formulario con etiqueta y mensaje de error (estilos de Bootstrap). */
export default function CampoFormulario({
  id, etiqueta, valor, onCambiar, error, tipo = 'text', requerido = false, ayuda, className = '', ...resto
}) {
  const Control = tipo === 'textarea' ? 'textarea' : 'input';
  return (
    <div className={`mb-3 ${className}`}>
      <label htmlFor={id} className="form-label">
        {etiqueta}{requerido && <span className="text-danger"> *</span>}
      </label>
      <Control
        id={id}
        name={id}
        type={tipo === 'textarea' ? undefined : tipo}
        className={`form-control ${error ? 'is-invalid' : ''}`}
        value={valor ?? ''}
        onChange={(e) => onCambiar(e.target.value)}
        aria-invalid={Boolean(error)}
        {...resto}
      />
      {ayuda && !error && <div className="form-text">{ayuda}</div>}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}
