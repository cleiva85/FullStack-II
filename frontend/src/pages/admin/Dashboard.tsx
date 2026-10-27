import { Link } from 'react-router-dom';
import TarjetaResumen from '../../components/admin/TarjetaResumen.tsx';
import EncabezadoSeccion from '../../components/admin/EncabezadoSeccion.tsx';
import { useDatos } from '../../hooks/useDatos.js';
import { ordenesDB, productosDB, usuariosDB } from '../../data/db.js';
import { resumenVentas } from '../../utils/reportes.js';
import { clp } from '../../utils/formato.js';

const ACCESOS = [
  ['/admin/ordenes', 'Órdenes', 'Revisa las compras realizadas y sus boletas.'],
  ['/admin/productos', 'Productos', 'Administra el catálogo, precios, ofertas y stock.'],
  ['/admin/categorias', 'Categorías', 'Organiza los productos para facilitar la navegación.'],
  ['/admin/usuarios', 'Usuarios', 'Gestiona clientes y administradores.'],
  ['/admin/reportes', 'Reportes', 'Ventas por categoría y productos más vendidos.'],
  ['/admin/productos/criticos', 'Stock crítico', 'Productos que hay que reponer pronto.'],
  ['/admin/perfil', 'Perfil', 'Tus datos y opciones del panel.'],
  ['/', 'Tienda', 'Mira la tienda tal como la ven los clientes.'],
];

export default function Dashboard() {
  const ordenes = useDatos(() => ordenesDB.listar());
  const productos = useDatos(() => productosDB.listar());
  const usuarios = useDatos(() => usuariosDB.listar());
  const criticos = useDatos(() => productosDB.criticos());
  const ventas = resumenVentas(ordenes);
  const ahora = new Date();
  const nuevosMes = usuarios.filter((u) => {
    const f = new Date(u.fechaRegistro);
    return f.getMonth() === ahora.getMonth() && f.getFullYear() === ahora.getFullYear();
  }).length;
  const inventario = productos.reduce((n, p) => n + p.stock, 0);

  return (
    <>
      <EncabezadoSeccion titulo="Dashboard" descripcion="Resumen de las actividades de la tienda" />
      <div className="row g-3 mb-4">
        <div className="col-md-4"><TarjetaResumen titulo="Compras" valor={ventas.pagadas} detalle={`Ventas: ${clp(ventas.monto)}`} color="primary" /></div>
        <div className="col-md-4"><TarjetaResumen titulo="Productos" valor={productos.length} detalle={`Inventario actual: ${inventario.toLocaleString('es-CL')} unidades`} color="success" /></div>
        <div className="col-md-4"><TarjetaResumen titulo="Usuarios" valor={usuarios.length} detalle={`Nuevos este mes: ${nuevosMes}`} color="warning" /></div>
      </div>
      {criticos.length > 0 && (
        <div className="alert alert-warning d-flex flex-wrap justify-content-between align-items-center" role="alert">
          <span>Hay {criticos.length} productos con stock crítico.</span>
          <Link to="/admin/productos/criticos" className="btn btn-sm btn-warning">Ver productos críticos</Link>
        </div>
      )}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-4 g-3">
        {ACCESOS.map(([ruta, titulo, texto]) => (
          <div className="col" key={ruta}>
            <Link to={ruta} className="card h-100 text-decoration-none text-center acceso-admin">
              <div className="card-body">
                <h2 className="h6">{titulo}</h2>
                <p className="small text-secondary mb-0">{texto}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
