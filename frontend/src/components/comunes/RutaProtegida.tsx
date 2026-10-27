import { Navigate, useLocation } from 'react-router-dom';
import { useSesion } from '../../context/SesionContext.tsx';

/** Deja pasar solo a usuarios con sesión (y, si soloAdmin, con rol administrador). */
export default function RutaProtegida({ children, soloAdmin = false }) {
  const { usuario, esAdmin } = useSesion();
  const ubicacion = useLocation();
  if (!usuario) return <Navigate to={`/login?next=${encodeURIComponent(ubicacion.pathname)}`} replace />;
  if (soloAdmin && !esAdmin) return <Navigate to="/" replace />;
  return children;
}
