'use client';

import AdminLayout from '@/app/_components/admin/AdminLayout';
import RutaProtegida from '@/app/_components/comunes/RutaProtegida';

/** Todas las páginas de /admin: solo para administradores, con la barra lateral del panel. */
export default function LayoutAdmin({ children }) {
  return (
    <RutaProtegida soloAdmin>
      <AdminLayout>{children}</AdminLayout>
    </RutaProtegida>
  );
}
