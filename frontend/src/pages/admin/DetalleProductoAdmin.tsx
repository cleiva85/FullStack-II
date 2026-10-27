import { Link, useParams } from 'react-router-dom';
import EncabezadoSeccion from '../../components/admin/EncabezadoSeccion.tsx';
import Precio from '../../components/comunes/Precio.tsx';
import { useDatos } from '../../hooks/useDatos.js';
import { productosDB } from '../../data/db.js';

export default function DetalleProductoAdmin() {
  const { id } = useParams();
  const p = useDatos(() => productosDB.obtener(id), [id]);
  if (!p) return <p>No existe el producto {id}. <Link to="/admin/productos">Volver</Link></p>;
  return (
    <>
      <EncabezadoSeccion titulo={p.nombre} descripcion={`Producto #${p.id}`}>
        <Link to={`/admin/productos/${p.id}/editar`} className="btn btn-sm btn-primary">Editar producto</Link>
        <Link to="/admin/productos" className="btn btn-sm btn-outline-secondary">Volver</Link>
      </EncabezadoSeccion>
      <div className="row g-4">
        <div className="col-md-4"><img src={p.img} alt={p.nombre} className="img-fluid rounded border bg-white p-2" /></div>
        <div className="col-md-8">
          <dl className="row">
            <dt className="col-sm-4">Marca</dt><dd className="col-sm-8">{p.marca || '—'}</dd>
            <dt className="col-sm-4">Categoría</dt><dd className="col-sm-8">{p.categoria}</dd>
            <dt className="col-sm-4">Descripción</dt><dd className="col-sm-8">{p.descripcion || '—'}</dd>
            <dt className="col-sm-4">Precio</dt><dd className="col-sm-8"><Precio producto={p} /></dd>
            <dt className="col-sm-4">Stock</dt>
            <dd className={`col-sm-8 ${p.stock <= p.stockCritico ? 'text-danger fw-bold' : ''}`}>{p.stock} unidades (crítico: {p.stockCritico})</dd>
          </dl>
          <Link to={`/productos/${p.id}`} className="small">Ver en la tienda</Link>
        </div>
      </div>
    </>
  );
}
