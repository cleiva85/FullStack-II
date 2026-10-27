import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ResumenOrden from '../../components/comunes/ResumenOrden.tsx';
import MensajeAlerta from '../../components/comunes/MensajeAlerta.tsx';
import { ordenesDB } from '../../data/db.js';

export default function CompraExitosa() {
  const { numero } = useParams();
  const orden = ordenesDB.porNumero(numero);
  const [enviada, setEnviada] = useState(false);

  if (!orden || orden.estado !== 'Pagada') {
    return <p className="text-center py-5">No encontramos una compra pagada con el número {numero}. <Link to="/">Volver al inicio</Link></p>;
  }
  return (
    <div className="row justify-content-center">
      <div className="col-xl-9">
        <div className="card shadow-sm boleta">
          <div className="card-body p-4">
            <div className="d-flex flex-wrap justify-content-between gap-2 mb-3">
              <h1 className="h4 text-success mb-0">✓ Se realizó la compra n.º {orden.numero}</h1>
              <span className="small text-secondary">Código de orden: ORDER{orden.id}</span>
            </div>
            <MensajeAlerta mensaje={enviada ? `Enviamos la boleta a ${orden.cliente.correo}.` : ''} tipo="success" onCerrar={() => setEnviada(false)} />
            <ResumenOrden orden={orden} />
          </div>
          <div className="card-footer d-flex flex-wrap justify-content-center gap-2 no-imprimir">
            <button type="button" className="btn btn-danger" onClick={() => window.print()}>Imprimir boleta en PDF</button>
            <button type="button" className="btn btn-success" onClick={() => setEnviada(true)}>Enviar boleta por email</button>
            <Link to="/productos" className="btn btn-outline-secondary">Seguir comprando</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
