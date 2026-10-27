import { Link } from 'react-router-dom';
import { BLOGS } from '../../data/blogs.js';

export default function Blogs() {
  return (
    <>
      <h1 className="titulo-seccion">Blog</h1>
      <div className="row row-cols-1 row-cols-md-2 g-4">
        {BLOGS.map((b) => (
          <div className="col" key={b.id}>
            <article className="card h-100">
              <img src={b.img} className="card-img-top blog-img" alt="" />
              <div className="card-body d-flex flex-column">
                <p className="small text-secondary mb-1">{new Date(b.fecha + 'T12:00:00').toLocaleDateString('es-CL', { dateStyle: 'long' })}</p>
                <h2 className="h5">{b.titulo}</h2>
                <p>{b.resumen}</p>
                <Link to={`/blogs/${b.id}`} className="btn btn-marca mt-auto align-self-start">Leer artículo</Link>
              </div>
            </article>
          </div>
        ))}
      </div>
    </>
  );
}
