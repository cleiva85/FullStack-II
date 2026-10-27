import { useEffect, useState } from 'react';
import { suscribir } from '../data/db.js';

/**
 * Lee datos de db.js y vuelve a leerlos cada vez que la base cambia.
 * Ejemplo: const productos = useDatos(() => productosDB.listar());
 */
export function useDatos(lector, dependencias = []) {
  const [valor, setValor] = useState(lector);
  useEffect(() => {
    setValor(lector());
    return suscribir(() => setValor(lector()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencias);
  return valor;
}
