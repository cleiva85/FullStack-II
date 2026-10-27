/* =========================================================
   esperarLlamada — espera a que un espía de Jasmine sea llamado.
   Ojo: en Jasmine, expect(...) NO lanza un error cuando falla (solo
   lo anota), así que no sirve dentro de waitFor. Esta función lanza
   un error mientras el espía no haya sido llamado con esos argumentos,
   y waitFor (Testing Library) reintenta hasta que se cumpla.
   ========================================================= */
import { waitFor } from '@testing-library/react';

export function esperarLlamada(espia, ...argumentos) {
  return waitFor(() => {
    const llamado = espia.calls.all().some((c) => JSON.stringify(c.args) === JSON.stringify(argumentos));
    if (!llamado) throw new Error(`Todavía no se llamó con ${JSON.stringify(argumentos)}`);
  }, { timeout: 3000 });
}
