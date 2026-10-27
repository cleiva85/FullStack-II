/** Tarjeta de indicador del dashboard (Compras, Productos, Usuarios). */
export default function TarjetaResumen({ titulo, valor, detalle, color = 'primary' }) {
  return (
    <div className={`card text-bg-${color} h-100 border-0`}>
      <div className="card-body">
        <p className="mb-1 fw-semibold">{titulo}</p>
        <p className="display-6 fw-bold mb-1">{valor}</p>
        {detalle && <p className="small mb-0 opacity-75">{detalle}</p>}
      </div>
    </div>
  );
}
