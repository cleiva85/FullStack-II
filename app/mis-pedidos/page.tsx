'use client';

import Link from 'next/link';
import RutaProtegida from '@/app/_components/comunes/RutaProtegida';
import { useSesion } from '@/app/_context/SesionContext';
import { useDatos } from '@/app/_lib/hooks/useDatos';
import { ordenesDB } from '@/app/_lib/data/db';
import { clp, fechaHora } from '@/app/_lib/utils/formato';

/** Compras hechas con el correo del usuario conectado (se leen de db.js). */
function ListaPedidos() {
  const { usuario } = useSesion();
  const pedidos = useDatos(() => [...ordenesDB.porCliente(usuario?.email)].reverse(), [usuario?.email]);

  return (
    <div className="row justify-content-center">
      <div className="col-lg-9">
        <h1 className="titulo-seccion">Mis pedidos</h1>
        {!pedidos.length && <p className="texto-suave">Todavía no tienes pedidos. <Link href="/productos" className="enlace-claro">Ver productos</Link></p>}
        {pedidos.map((p) => (
          <details key={p.numero} className="card mb-2">
            <summary className="card-header">
              Pedido n.º {p.numero} · {fechaHora(p.fecha)} · <strong>{clp(p.total)}</strong>{' '}
              <span className={`badge ${p.estado === 'Pagada' ? 'text-bg-success' : 'text-bg-danger'}`}>{p.estado}</span>
            </summary>
            <div className="card-body">
              <ul className="mb-2">{p.items.map((i) => <li key={i.id}>{i.cantidad} × {i.nombre} ({clp(i.precio)})</li>)}</ul>
              <p className="mb-0 small">
                <strong>Entrega:</strong>{' '}
                {p.entrega.tipo === 'domicilio' ? `${p.entrega.calle}, ${p.entrega.comuna}, ${p.entrega.region}` : 'Retiro en tienda'}
              </p>
              {p.motivo && <p className="mb-0 small text-danger">{p.motivo}</p>}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

export default function MisPedidos() {
  return (
    <RutaProtegida>
      <ListaPedidos />
    </RutaProtegida>
  );
}
