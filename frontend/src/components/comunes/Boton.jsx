/** Botón reutilizable. Recibe el texto (etiqueta) y la acción (onClick) por props. */
export default function Boton({
  etiqueta, onClick, variante = 'primary', tipo = 'button', deshabilitado = false, tamano, className = '', ...resto
}) {
  const clases = ['btn', `btn-${variante}`, tamano ? `btn-${tamano}` : '', className].filter(Boolean).join(' ');
  return (
    <button type={tipo} className={clases} onClick={onClick} disabled={deshabilitado} {...resto}>
      {etiqueta}
    </button>
  );
}
