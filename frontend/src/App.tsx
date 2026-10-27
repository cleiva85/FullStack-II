/* =========================================================
   App.tsx — rutas de la aplicación (React Router).
   Sigue el diagrama de navegación de la pauta: Tienda y Administrador.
   ========================================================= */
import { Route, Routes } from 'react-router-dom';
import LayoutTienda from './components/tienda/LayoutTienda.tsx';
import AdminLayout from './components/admin/AdminLayout.tsx';
import RutaProtegida from './components/comunes/RutaProtegida.tsx';

import Inicio from './pages/tienda/Inicio.tsx';
import Productos from './pages/tienda/Productos.tsx';
import DetalleProducto from './pages/tienda/DetalleProducto.tsx';
import Categorias from './pages/tienda/Categorias.tsx';
import Ofertas from './pages/tienda/Ofertas.tsx';
import Carrito from './pages/tienda/Carrito.tsx';
import Checkout from './pages/tienda/Checkout.tsx';
import CompraExitosa from './pages/tienda/CompraExitosa.tsx';
import CompraError from './pages/tienda/CompraError.tsx';
import IniciarSesion from './pages/tienda/IniciarSesion.tsx';
import Registro from './pages/tienda/Registro.tsx';
import Nosotros from './pages/tienda/Nosotros.tsx';
import Blogs from './pages/tienda/Blogs.tsx';
import DetalleBlog from './pages/tienda/DetalleBlog.tsx';
import Contacto from './pages/tienda/Contacto.tsx';
import MisPedidos from './pages/tienda/MisPedidos.tsx';
import NoEncontrado from './pages/tienda/NoEncontrado.tsx';

import Dashboard from './pages/admin/Dashboard.tsx';
import Ordenes from './pages/admin/Ordenes.tsx';
import DetalleOrden from './pages/admin/DetalleOrden.tsx';
import ProductosAdmin from './pages/admin/ProductosAdmin.tsx';
import ProductoFormulario from './pages/admin/ProductoFormulario.tsx';
import DetalleProductoAdmin from './pages/admin/DetalleProductoAdmin.tsx';
import ProductosCriticos from './pages/admin/ProductosCriticos.tsx';
import ReporteProductos from './pages/admin/ReporteProductos.tsx';
import CategoriasAdmin from './pages/admin/CategoriasAdmin.tsx';
import CategoriaFormulario from './pages/admin/CategoriaFormulario.tsx';
import UsuariosAdmin from './pages/admin/UsuariosAdmin.tsx';
import UsuarioFormulario from './pages/admin/UsuarioFormulario.tsx';
import DetalleUsuario from './pages/admin/DetalleUsuario.tsx';
import HistorialCompras from './pages/admin/HistorialCompras.tsx';
import Reportes from './pages/admin/Reportes.tsx';
import Perfil from './pages/admin/Perfil.tsx';

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
