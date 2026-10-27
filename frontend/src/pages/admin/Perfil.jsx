import EncabezadoSeccion from '../../components/admin/EncabezadoSeccion.jsx';
import { useSesion } from '../../context/SesionContext.jsx';
import { useAviso } from '../../context/AvisoContext.jsx';
import { restablecerBaseDatos } from '../../data/db.js';

export default function Perfil() {
  const { usuario } = useSesion();
  const aviso = useAviso();

  function restablecer() {
    if (!window.confirm('Se borrarán los productos, categorías, usuarios y órdenes creados en el panel y se cargarán los datos iniciales. ¿Continuar?')) return;
    restablecerBaseDatos();
    aviso('Datos restablecidos');
  }

  return (
    <>
      <EncabezadoSeccion titulo="Perfil" descripcion="Tus datos de administrador" />
      <dl className="row" style={{ maxWidth: 640 }}>
        <dt className="col-sm-4">Nombre</dt><dd className="col-sm-8">{usuario.nombre} {usuario.apellido}</dd>
        <dt className="col-sm-4">Usuario</dt><dd className="col-sm-8">{usuario.usuario}</dd>
        <dt className="col-sm-4">Correo</dt><dd className="col-sm-8">{usuario.email}</dd>
        <dt className="col-sm-4">RUT</dt><dd className="col-sm-8">{usuario.rut}</dd>
        <dt className="col-sm-4">Dirección</dt><dd className="col-sm-8">{usuario.direccion}, {usuario.comuna}, {usuario.region}</dd>
      </dl>
      <div className="card border-danger" style={{ maxWidth: 640 }}>
        <div className="card-body">
          <h2 className="h6">Datos de demostración</h2>
          <p className="small text-secondary">Vuelve el catálogo, las categorías, los usuarios y las órdenes del panel a sus valores iniciales. Las cuentas y pedidos guardados en el backend no se tocan.</p>
          <button type="button" className="btn btn-outline-danger btn-sm" onClick={restablecer}>Restablecer datos</button>
        </div>
      </div>
    </>
  );
}
