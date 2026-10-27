'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSesion } from '@/app/_context/SesionContext';

/** Deja pasar solo a usuarios con sesión (y, si soloAdmin, con rol administrador). */
export default function RutaProtegida({ children, soloAdmin = false }) {
  const { usuario, esAdmin } = useSesion();
  const router = useRouter();
  const ruta = usePathname();
  const destino = !usuario ? `/login?next=${encodeURIComponent(ruta)}` : soloAdmin && !esAdmin ? '/' : null;

  useEffect(() => {
    if (destino) router.replace(destino);
  }, [destino, router]);

  if (destino) return null;
  return children;
}
