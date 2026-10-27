import { Link } from 'react-router-dom';
import EncabezadoSeccion from '../../components/admin/EncabezadoSeccion.jsx';
import { useDatos } from '../../hooks/useDatos.js';
import { useAviso } from '../../context/AvisoContext.jsx';
import { categoriasDB, productosDB } from '../../data/db.js';

export default function CategoriasAdmin() {
  const categorias = useDatos(() => categoriasDB.listar());
  const productos = useDatos(() => productosDB.listar());
  const aviso = useAviso();
  const cantidad = (c) => productos.filter((p) => p.categoria === c.nombre).length;

  function eliminar(c) {
    if (!window.confirm(`¿Eliminar la categoría «${c.nombre}»?`)) return;
    if (categoriasDB.eliminar(c.id)) aviso('Categoría eliminada', 'secondary');
    else aviso('No se puede eliminar: la categoría todavía tiene productos', 'danger');
  }

  return (
    <>
      <EncabezadoSeccion titulo="Categorías" descripcion={`${categorias.length} categorías`}>
        <Link to="/admin/categorias/nueva" className="btn btn-sm btn-primary">Nueva categoría</Link>
      </EncabezadoSeccion>
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead><tr><th>Categoría</th><th>Dirección</th><th className="text-end">Productos</th><th /></tr></thead>
          <tbody>
            {categorias.map((c) => (
              <tr key={c.id}>
                <td><div className="d-flex align-items-center gap-2"><img src={c.img} alt="" className="miniatura" />{c.nombre}</div></td>
                <td><code>/categorias/{c.slug}</code></td>
                <td className="text-end">{cantidad(c)}</td>
                <td className="text-end text-nowrap">
                  <Link to={`/admin/categorias/${c.id}/editar`} className="btn btn-sm btn-outline-primary me-1">Editar</Link>
                  <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => eliminar(c)}
                    disabled={cantidad(c) > 0} title={cantidad(c) > 0 ? 'Mueve o elimina sus productos primero' : undefined}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
