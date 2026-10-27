'use client';

import { useEffect, useState } from 'react';
import { SesionProvider } from '@/app/_context/SesionContext';
import { CarritoProvider } from '@/app/_context/CarritoContext';
import { AvisoProvider } from '@/app/_context/AvisoContext';
import LayoutTienda from '@/app/_components/tienda/LayoutTienda';

/**
 * Estado global de la app (sesión, carro y avisos).
 * Los datos viven en localStorage, que solo existe en el navegador: por eso la app
 * se muestra después de montarse en el cliente y así se evitan diferencias entre
 * el HTML del servidor y el del navegador (errores de hidratación).
 */
export default function Proveedores({ children }) {
  const [montado, setMontado] = useState(false);
  useEffect(() => { setMontado(true); }, []);

  if (!montado) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100" role="status">
        <div className="spinner-border text-secondary" aria-hidden="true" />
        <span className="visually-hidden">Cargando…</span>
      </div>
    );
  }
  return (
    <SesionProvider>
      <CarritoProvider>
        <AvisoProvider>
          <LayoutTienda>{children}</LayoutTienda>
        </AvisoProvider>
      </CarritoProvider>
    </SesionProvider>
  );
}
