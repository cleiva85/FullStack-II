'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ResumenOrden from '@/app/_components/comunes/ResumenOrden';
import MensajeAlerta from '@/app/_components/comunes/MensajeAlerta';
import { ordenesDB } from '@/app/_lib/data/db';
import { servicioCorreo } from '@/app/_lib/services/correo';

export default function CompraExitosa() {
  const { numero } = useParams();
  const orden = ordenesDB.porNumero(numero);
  const [aviso, setAviso] = useState(null);   // { tipo, texto }
  const [enviando, setEnviando] = useState(false);

  async function enviarBoleta() {
    setEnviando(true);
    const r = await servicioCorreo.enviarBoleta(orden);
    setEnviando(false);
    if (!r.ok) setAviso({ tipo: 'danger', texto: 'No pudimos enviar la boleta. Inténtalo de nuevo en unos minutos.' });
    else if (r.simulado) setAviso({ tipo: 'info', texto: `Modo demostración: el envío de correos no está configurado; la boleta para ${orden.cliente.correo} se mostró en la consola del navegador.` });
    else setAviso({ tipo: 'success', texto: `Enviamos la boleta a ${orden.cliente.correo}.` });
  }

  if (!orden || orden.estado !== 'Pagada') {
    return <p className="text-center py-5">No encontramos una compra pagada con el número {numero}. <Link href="/">Volver al inicio</Link></p>;
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
            <MensajeAlerta mensaje={aviso?.texto} tipo={aviso?.tipo} onCerrar={() => setAviso(null)} />
            <ResumenOrden orden={orden} />
          </div>
          <div className="card-footer d-flex flex-wrap justify-content-center gap-2 no-imprimir">
            <button type="button" className="btn btn-danger" onClick={() => window.print()}>Imprimir boleta en PDF</button>
            <button type="button" className="btn btn-success" onClick={enviarBoleta} disabled={enviando}>{enviando ? 'Enviando…' : 'Enviar boleta por email'}</button>
            <Link href="/productos" className="btn btn-outline-secondary">Seguir comprando</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
