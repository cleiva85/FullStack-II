const COLOR = { Nuevo: 'text-bg-primary', Leído: 'text-bg-secondary', Respondido: 'text-bg-success' };

/** Etiqueta de color con el estado de un mensaje de contacto. */
export default function EstadoMensaje({ estado }) {
  return <span className={`badge ${COLOR[estado] || 'text-bg-light'}`}>{estado}</span>;
}
