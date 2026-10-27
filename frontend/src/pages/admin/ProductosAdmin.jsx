import { useState } from 'react';
import { Link } from 'react-router-dom';
import EncabezadoSeccion from '../../components/admin/EncabezadoSeccion.jsx';
import { useDatos } from '../../hooks/useDatos.js';
import { useAviso } from '../../context/AvisoContext.jsx';
import { productosDB } from '../../data/db.js';
import { clp } from '../../utils/formato.js';

export default function ProductosAdmin() {
  const [texto, setTexto] = useState('');
  const productos = useDatos(() => productosDB.buscar(texto), [texto]);
  const aviso = useAviso();

  function eliminar(p) {
    if (!window.confirm(`¿Eliminar «${p.nombre}» del catálogo?`)) return;
    productosDB.eliminar(p.id);
    aviso(`Producto «${p.nombre}» eliminado`, 'secondary');
  }

  return (
    <>
      <EncabezadoSeccion titulo="Productos" descripcion={`${productos.length} productos`}>
        <Link to="/admin/productos/nuevo" className="btn btn-sm btn-primary">Nuevo producto</Link>
        <Link to="/admin/productos/criticos" className="btn btn-sm btn-outline-warning">Productos críticos</Link>
        <Link to="/admin/productos/reporte" className="btn btn-sm btn-outline-secondary">Reporte</Link>
      </EncabezadoSeccion>
      <input type="search" className="form-control mb-3" placeholder="Buscar por nombre, marca o categoría" aria-label="Buscar productos"
        value={texto} onChange={(e) => setTexto(e.target.value)} />
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead><tr><th>ID</th><th>Producto</th><th>Categoría</th><th className="text-end">Precio</th><th className="text-end">Oferta</th><th className="text-end">Stock</th><th><span className="visually-hidden">Acciones</span></th></tr></thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td><div className="d-flex align-items-center gap-2"><img src={p.img} alt="" className="miniatura" />{p.nombre}</div></td>
                <td>{p.categoria}</td>
                <td className="text-end">{clp(p.precio)}</td>
                <td className="text-end">{p.oferta ? clp(p.oferta) : '—'}</td>
                <td className={`text-end ${p.stock <= p.stockCritico ? 'text-danger fw-bold' : ''}`}>{p.stock}</td>
                <td className="text-end text-nowrap">
                  <Link to={`/admin/productos/${p.id}`} className="btn btn-sm btn-outline-secondary me-1">Ver</Link>
                  <Link to={`/admin/productos/${p.id}/editar`} className="btn btn-sm btn-outline-primary me-1">Editar</Link>
                  <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => eliminar(p)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
