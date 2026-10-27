import { Link, useParams } from 'react-router-dom';
import { BLOGS } from '../../data/blogs.js';

export default function DetalleBlog() {
  const { id } = useParams();
  const blog = BLOGS.find((b) => b.id === Number(id));
  if (!blog) return <p className="text-center py-5">No encontramos este artículo. <Link to="/blogs">Ver el blog</Link></p>;
  return (
    <article className="row justify-content-center">
      <div className="col-lg-8">
        <Link to="/blogs" className="enlace-claro small">Volver al blog</Link>
        <h1 className="mt-2">{blog.titulo}</h1>
        <p className="texto-suave">{new Date(blog.fecha + 'T12:00:00').toLocaleDateString('es-CL', { dateStyle: 'long' })}</p>
        <img src={blog.img} alt="" className="img-fluid rounded-4 mb-4" />
        {blog.contenido.map((p) => <p key={p.slice(0, 20)} className="lectura">{p}</p>)}
      </div>
    </article>
  );
}
