/* =========================================================
   App.jsx — rutas de la aplicación (React Router).
   Sigue el diagrama de navegación de la pauta: Tienda y Administrador.
   ========================================================= */
import { Route, Routes } from 'react-router-dom';
import LayoutTienda from './components/tienda/LayoutTienda.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';
import RutaProtegida from './components/comunes/RutaProtegida.jsx';

import Inicio from './pages/tienda/Inicio.jsx';
import Productos from './pages/tienda/Productos.jsx';
import DetalleProducto from './pages/tienda/DetalleProducto.jsx';
import Categorias from './pages/tienda/Categorias.jsx';
import Ofertas from './pages/tienda/Ofertas.jsx';
import Carrito from './pages/tienda/Carrito.jsx';
import Checkout from './pages/tienda/Checkout.jsx';
import CompraExitosa from './pages/tienda/CompraExitosa.jsx';
import CompraError from './pages/tienda/CompraError.jsx';
import IniciarSesion from './pages/tienda/IniciarSesion.jsx';
import Registro from './pages/tienda/Registro.jsx';
import Nosotros from './pages/tienda/Nosotros.jsx';
import Blogs from './pages/tienda/Blogs.jsx';
import DetalleBlog from './pages/tienda/DetalleBlog.jsx';
import Contacto from './pages/tienda/Contacto.jsx';
import MisPedidos from './pages/tienda/MisPedidos.jsx';
import NoEncontrado from './pages/tienda/NoEncontrado.jsx';

import Dashboard from './pages/admin/Dashboard.jsx';
import Ordenes from './pages/admin/Ordenes.jsx';
import DetalleOrden from './pages/admin/DetalleOrden.jsx';
import ProductosAdmin from './pages/admin/ProductosAdmin.jsx';
import ProductoFormulario from './pages/admin/ProductoFormulario.jsx';
import DetalleProductoAdmin from './pages/admin/DetalleProductoAdmin.jsx';
import ProductosCriticos from './pages/admin/ProductosCriticos.jsx';
import ReporteProductos from './pages/admin/ReporteProductos.jsx';
import CategoriasAdmin from './pages/admin/CategoriasAdmin.jsx';
import CategoriaFormulario from './pages/admin/CategoriaFormulario.jsx';
import UsuariosAdmin from './pages/admin/UsuariosAdmin.jsx';
import UsuarioFormulario from './pages/admin/UsuarioFormulario.jsx';
import DetalleUsuario from './pages/admin/DetalleUsuario.jsx';
import HistorialCompras from './pages/admin/HistorialCompras.jsx';
import Reportes from './pages/admin/Reportes.jsx';
import Perfil from './pages/admin/Perfil.jsx';

export default function App() {
  return (
    <Routes>
      {/* ---------- Tienda (pública) ---------- */}
      <Route element={<LayoutTienda />}>
        <Route index element={<Inicio />} />
        <Route path="productos" element={<Productos />} />
        <Route path="productos/:id" element={<DetalleProducto />} />
        <Route path="categorias" element={<Categorias />} />
        <Route path="categorias/:slug" element={<Categorias />} />
        <Route path="ofertas" element={<Ofertas />} />
        <Route path="carrito" element={<Carrito />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="compra/exitosa/:numero" element={<CompraExitosa />} />
        <Route path="compra/error/:numero" element={<CompraError />} />
        <Route path="login" element={<IniciarSesion />} />
        <Route path="registro" element={<Registro />} />
        <Route path="nosotros" element={<Nosotros />} />
        <Route path="blogs" element={<Blogs />} />
        <Route path="blogs/:id" element={<DetalleBlog />} />
        <Route path="contacto" element={<Contacto />} />
        <Route path="mis-pedidos" element={<RutaProtegida><MisPedidos /></RutaProtegida>} />
        <Route path="*" element={<NoEncontrado />} />
      </Route>

      {/* ---------- Administrador (solo rol admin) ---------- */}
      <Route path="admin" element={<RutaProtegida soloAdmin><AdminLayout /></RutaProtegida>}>
        <Route index element={<Dashboard />} />
        <Route path="ordenes" element={<Ordenes />} />
        <Route path="ordenes/:numero" element={<DetalleOrden />} />
        <Route path="productos" element={<ProductosAdmin />} />
        <Route path="productos/nuevo" element={<ProductoFormulario />} />
        <Route path="productos/criticos" element={<ProductosCriticos />} />
        <Route path="productos/reporte" element={<ReporteProductos />} />
        <Route path="productos/:id" element={<DetalleProductoAdmin />} />
        <Route path="productos/:id/editar" element={<ProductoFormulario key="editar" />} />
        <Route path="categorias" element={<CategoriasAdmin />} />
        <Route path="categorias/nueva" element={<CategoriaFormulario />} />
        <Route path="categorias/:id/editar" element={<CategoriaFormulario key="editar" />} />
        <Route path="usuarios" element={<UsuariosAdmin />} />
        <Route path="usuarios/nuevo" element={<UsuarioFormulario />} />
        <Route path="usuarios/:id" element={<DetalleUsuario />} />
        <Route path="usuarios/:id/editar" element={<UsuarioFormulario key="editar" />} />
        <Route path="usuarios/:id/historial" element={<HistorialCompras />} />
        <Route path="reportes" element={<Reportes />} />
        <Route path="perfil" element={<Perfil />} />
      </Route>
    </Routes>
  );
}
