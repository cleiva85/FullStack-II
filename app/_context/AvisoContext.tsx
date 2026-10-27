'use client';

/* Avisos emergentes (toasts de Bootstrap), por ejemplo "3 × Leche agregados al carro". */
import { createContext, useCallback, useContext, useState } from 'react';

const AvisoContext = createContext(null);

export function AvisoProvider({ children }) {
  const [avisos, setAvisos] = useState([]);
  const mostrar = useCallback((texto, tipo = 'success') => {
    const id = Date.now() + Math.random();
    setAvisos((a) => [...a, { id, texto, tipo }]);
    setTimeout(() => setAvisos((a) => a.filter((x) => x.id !== id)), 3200);
  }, []);
  return (
    <AvisoContext.Provider value={mostrar}>
      {children}
      <div className="toast-container position-fixed bottom-0 end-0 p-3" aria-live="polite">
        {avisos.map((a) => (
          <div key={a.id} className={`toast show align-items-center text-bg-${a.tipo} border-0`} role="status">
            <div className="toast-body">{a.texto}</div>
          </div>
        ))}
      </div>
    </AvisoContext.Provider>
  );
}

/** Devuelve la función mostrar(texto, tipo). Fuera del provider no hace nada (útil en pruebas). */
export function useAviso() {
  return useContext(AvisoContext) || (() => {});
}
