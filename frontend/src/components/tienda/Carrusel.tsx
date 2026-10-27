import { useEffect, useState } from 'react';

/** Carrusel de portada hecho con estado de React (índice de la diapositiva visible). */
export default function Carrusel({ diapositivas, intervalo = 6000 }) {
  const [indice, setIndice] = useState(0);
  const total = diapositivas.length;
  const mover = (paso) => setIndice((i) => (i + paso + total) % total);

  useEffect(() => {
    if (!intervalo || total < 2) return undefined;
    const t = setInterval(() => setIndice((i) => (i + 1) % total), intervalo);
    return () => clearInterval(t);
  }, [intervalo, total]);

  const d = diapositivas[indice];
  return (
    <section className="carrusel position-relative overflow-hidden rounded-4 mb-5" aria-roledescription="carrusel">
      <img src={d.img} alt="" className="carrusel-img" />
      <div className="carrusel-texto">
        <h2 className="display-6 fw-bold">{d.titulo}</h2>
        <p className="lead mb-3">{d.texto}</p>
        {d.accion}
      </div>
      {total > 1 && (
        <>
          <button type="button" className="carrusel-control izq" aria-label="Anterior" onClick={() => mover(-1)}>‹</button>
          <button type="button" className="carrusel-control der" aria-label="Siguiente" onClick={() => mover(1)}>›</button>
          <div className="carrusel-indicadores">
            {diapositivas.map((x, i) => (
              <button key={x.titulo} type="button" aria-label={`Ir a ${x.titulo}`}
                className={i === indice ? 'activo' : ''} onClick={() => setIndice(i)} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
