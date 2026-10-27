/** Título de cada página del panel, con espacio para botones de acción a la derecha. */
export default function EncabezadoSeccion({ titulo, descripcion, children }) {
  return (
    <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-4 border-bottom pb-3">
      <div>
        <h1 className="h3 mb-0">{titulo}</h1>
        {descripcion && <p className="text-secondary mb-0">{descripcion}</p>}
      </div>
      {children && <div className="d-flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}
