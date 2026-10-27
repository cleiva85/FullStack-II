import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TablaItems from '../../components/comunes/TablaItems.tsx';
import CampoFormulario from '../../components/comunes/CampoFormulario.tsx';
import MensajeAlerta from '../../components/comunes/MensajeAlerta.tsx';
import SelectorRegionComuna from '../../components/tienda/SelectorRegionComuna.tsx';
import { useCarrito } from '../../context/CarritoContext.tsx';
import { useSesion } from '../../context/SesionContext.tsx';
import { ordenesDB, productosDB } from '../../data/db.js';
import { api } from '../../services/api.js';
import { validarCheckout } from '../../utils/validadores.js';
import { COSTO_DESPACHO } from '../../utils/carrito.js';
import { clp } from '../../utils/formato.js';

/** Si el usuario inició sesión, sus datos se completan solos (nota de la Figura 6 de la pauta). */
const datosIniciales = (u) => ({
  nombre: u?.nombre || '',
  apellido: u?.apellido || '',
  correo: u?.email || '',
  tipoEntrega: 'domicilio',
  calle: u?.direccion || '',
  departamento: '',
  region: u?.region || '',
  comuna: u?.comuna || '',
  indicaciones: '',
  medioPago: '',
});

export default function Checkout() {
  const { detalle, total, vaciar } = useCarrito();
  const { usuario } = useSesion();
  const navegar = useNavigate();
  const [datos, setDatos] = useState(() => datosIniciales(usuario));
  const [errores, setErrores] = useState({});
  const [procesando, setProcesando] = useState(false);

  const campo = (nombre) => (valor) => setDatos((d) => ({ ...d, [nombre]: valor }));
  const despacho = datos.tipoEntrega === 'domicilio' ? COSTO_DESPACHO : 0;
  const totalPagar = total + despacho;

  if (!detalle.length) {
    return (
      <div className="text-center py-5">
        <h1 className="h3">No hay productos para pagar</h1>
        <Link to="/productos" className="btn btn-light">Ver productos</Link>
      </div>
    );
  }

  async function pagar(e) {
    e.preventDefault();
    const errs = validarCheckout(datos);
    setErrores(errs);
    if (Object.keys(errs).length) return;
    setProcesando(true);

    const items = detalle.map((i) => ({ id: i.id, nombre: i.nombre, img: i.img, precio: i.precioUnitario, cantidad: i.cantidad }));
    const entrega = datos.tipoEntrega === 'domicilio'
      ? { tipo: 'domicilio', calle: datos.calle.trim(), departamento: datos.departamento.trim(), region: datos.region, comuna: datos.comuna, indicaciones: datos.indicaciones.trim() }
      : { tipo: 'retiro' };

    // Simulación del pago: se rechaza si no alcanza el stock de algún producto
    const problema = productosDB.verificarStock(items);
    const orden = ordenesDB.crear({
      estado: problema ? 'Rechazada' : 'Pagada',
      ...(problema ? { motivo: problema } : {}),
      cliente: { nombre: datos.nombre.trim(), apellido: datos.apellido.trim(), correo: datos.correo.trim() },
      entrega,
      medioPago: datos.medioPago,
      items,
      subtotal: total,
      despacho,
      total: totalPagar,
    });

    if (problema) {
      setProcesando(false);
      navegar(`/compra/error/${orden.numero}`);
      return;
    }

    productosDB.descontarStock(items);
    if (usuario) {
      // Con sesión iniciada el pedido también queda registrado en el backend ("Mis pedidos")
      await api.crearPedido({
        numero: orden.numero,
        costoDespacho: despacho,
        items: items.map(({ id, nombre, precio, cantidad }) => ({ id, nombre, precio, cantidad })),
        despacho: entrega.tipo === 'domicilio'
          ? { direccion: entrega.calle + (entrega.departamento ? `, depto. ${entrega.departamento}` : ''), region: entrega.region, comuna: entrega.comuna }
          : { direccion: 'Retiro en tienda, Av. Esq. Blanca 501', region: 'Metropolitana de Santiago', comuna: 'Maipú' },
      });
    }
    vaciar();
    setProcesando(false);
    navegar(`/compra/exitosa/${orden.numero}`);
  }

  return (
    <div className="row justify-content-center">
      <div className="col-xl-9">
        <form className="card shadow-sm" onSubmit={pagar} noValidate>
          <div className="card-body p-4">
            <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
              <div>
                <h1 className="h4 mb-0">Finalizar compra</h1>
                <p className="small text-secondary mb-0">Revisa tus productos y completa los datos de entrega.</p>
              </div>
              <span className="btn btn-primary disabled">Total a pagar: {clp(totalPagar)}</span>
            </div>
            <TablaItems items={detalle} />

            <h2 className="h5 mt-4">Información del cliente</h2>
            <div className="row">
              <CampoFormulario className="col-md-6" id="nombre" etiqueta="Nombre" requerido valor={datos.nombre} onCambiar={campo('nombre')} error={errores.nombre} autoComplete="given-name" />
              <CampoFormulario className="col-md-6" id="apellido" etiqueta="Apellidos" requerido valor={datos.apellido} onCambiar={campo('apellido')} error={errores.apellido} autoComplete="family-name" />
              <CampoFormulario className="col-md-6" id="correo" tipo="email" etiqueta="Correo" requerido valor={datos.correo} onCambiar={campo('correo')} error={errores.correo} autoComplete="email" />
            </div>

            <h2 className="h5 mt-2">Entrega</h2>
            <div className="mb-3">
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="tipoEntrega" id="entrega-domicilio" value="domicilio"
                  checked={datos.tipoEntrega === 'domicilio'} onChange={() => campo('tipoEntrega')('domicilio')} />
                <label className="form-check-label" htmlFor="entrega-domicilio">Despacho a domicilio ({clp(COSTO_DESPACHO)})</label>
              </div>
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="tipoEntrega" id="entrega-retiro" value="retiro"
                  checked={datos.tipoEntrega === 'retiro'} onChange={() => campo('tipoEntrega')('retiro')} />
                <label className="form-check-label" htmlFor="entrega-retiro">Retiro en tienda (sin costo)</label>
              </div>
            </div>

            {datos.tipoEntrega === 'domicilio' && (
              <fieldset>
                <legend className="h6 text-secondary">Dirección de entrega</legend>
                <div className="row">
                  <CampoFormulario className="col-md-8" id="calle" etiqueta="Calle y número" requerido valor={datos.calle} onCambiar={campo('calle')} error={errores.calle} autoComplete="street-address" />
                  <CampoFormulario className="col-md-4" id="departamento" etiqueta="Departamento (opcional)" valor={datos.departamento} onCambiar={campo('departamento')} placeholder="Ej: 603" />
                </div>
                <SelectorRegionComuna region={datos.region} comuna={datos.comuna} errores={errores} idPrefijo="checkout"
                  onCambiar={({ region, comuna }) => setDatos((d) => ({ ...d, region, comuna }))} />
                <CampoFormulario id="indicaciones" tipo="textarea" etiqueta="Indicaciones para la entrega (opcional)" rows={2}
                  valor={datos.indicaciones} onCambiar={campo('indicaciones')} placeholder="Ej: entre calles, color del edificio, no tiene timbre" />
              </fieldset>
            )}
            {datos.tipoEntrega === 'retiro' && (
              <p className="alert alert-light border">Retira en Av. Esq. Blanca 501, Maipú, de lunes a sábado de 08:30 a 19:30 hrs.</p>
            )}

            <h2 className="h5 mt-2">Medio de pago</h2>
            <div className="mb-3" style={{ maxWidth: 320 }}>
              <label htmlFor="medioPago" className="visually-hidden">Medio de pago</label>
              <select id="medioPago" className={`form-select ${errores.medioPago ? 'is-invalid' : ''}`}
                value={datos.medioPago} onChange={(e) => campo('medioPago')(e.target.value)}>
                <option value="">Selecciona un medio de pago</option>
                <option value="debito">Tarjeta de débito</option>
                <option value="credito">Tarjeta de crédito</option>
                <option value="transferencia">Transferencia bancaria</option>
              </select>
              {errores.medioPago && <div className="invalid-feedback">{errores.medioPago}</div>}
            </div>

            <MensajeAlerta mensaje={Object.keys(errores).length ? 'Revisa los campos marcados en rojo.' : ''} tipo="warning" />
          </div>
          <div className="card-footer text-end">
            <button type="submit" className="btn btn-success btn-lg" disabled={procesando}>
              {procesando ? 'Procesando pago…' : `Pagar ahora ${clp(totalPagar)}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
