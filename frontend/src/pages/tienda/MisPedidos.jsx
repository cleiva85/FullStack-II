import { useEffect, useState } from 'react';
import { api } from '../../services/api.js';
import { clp, fechaHora } from '../../utils/formato.js';
import MensajeAlerta from '../../components/comunes/MensajeAlerta.jsx';

/** Pedidos del usuario guardados en el backend (GET /api/pedidos). */
export default function MisPedidos() {
  const [pedidos, setPedidos] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.misPedidos().then((r) => {
      if (r.ok) setPedidos(r.pedidos);
      else { setError(r.error || 'No se pudieron cargar tus pedidos.'); setPedidos([]); }
    });
  }, []);

  return (
    <div className="row justify-content-center">
      <div className="col-lg-9">
        <h1 className="titulo-seccion">Mis pedidos</h1>
        <MensajeAlerta mensaje={error} />
        {pedidos === null && <p className="texto-suave">Cargando…</p>}
        {pedidos?.length === 0 && !error && <p className="texto-suave">Todavía no tienes pedidos.</p>}
        <div className="accordion">
          {pedidos?.map((p) => (
            <details key={p.numero} className="card mb-2">
              <summary className="card-header">
                Pedido n.º {p.numero} · {fechaHora(p.fecha)} · <strong>{clp(p.total)}</strong> ({p.estado})
              </summary>
              <div className="card-body">
                <ul className="mb-2">{p.items.map((i) => <li key={i.id}>{i.cantidad} × {i.nombre} ({clp(i.precio)})</li>)}</ul>
                <p className="mb-0 small"><strong>Entrega:</strong> {p.despacho}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
