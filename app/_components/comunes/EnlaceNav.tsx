'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Enlace de menú que sabe si está activo (reemplaza al NavLink de React Router).
 * className puede ser un texto o una función ({ isActive }) => texto.
 * Con "exacto" solo se marca activo en esa ruta exacta (no en sus subrutas).
 */
export default function EnlaceNav({ href, exacto = false, className, children, ...resto }) {
  const ruta = usePathname() || '/';
  const isActive = exacto ? ruta === href : ruta === href || ruta.startsWith(`${href}/`);
  const clases = typeof className === 'function' ? className({ isActive }) : className;
  return (
    <Link href={href} className={clases} aria-current={isActive ? 'page' : undefined} {...resto}>
      {children}
    </Link>
  );
}
