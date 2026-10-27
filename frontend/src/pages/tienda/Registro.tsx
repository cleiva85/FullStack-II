import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CampoFormulario from '../../components/comunes/CampoFormulario.tsx';
import MensajeAlerta from '../../components/comunes/MensajeAlerta.tsx';
import SelectorRegionComuna from '../../components/tienda/SelectorRegionComuna.tsx';
import { useSesion } from '../../context/SesionContext.tsx';
import { validarEmail, validarPassword, validarRut, validarTelefono } from '../../utils/validadores.js';

const VACIO = {
  rut: '', nombre: '', apellido: '', usuario: '', email: '', telefono: '',
  direccion: '', region: '', comuna: '', password: '', confirmar: '',
};

export function validarRegistro(d) {
  const e = {};
  if (!validarRut(d.rut)) e.rut = 'RUT no válido. Revisa el dígito verificador.';
  if (d.nombre.trim().length < 2) e.nombre = 'Ingresa tu nombre.';
  if (d.apellido.trim().length < 2) e.apellido = 'Ingresa tu apellido.';
  if (!/^[A-Za-z0-9_]{4,}$/.test(d.usuario)) e.usuario = 'Mínimo 4 caracteres: letras, números o _.';
  if (!validarEmail(d.email)) e.email = 'Ingresa un correo válido.';
  if (!validarTelefono(d.telefono)) e.telefono = 'Ingresa un teléfono de 9 dígitos, por ejemplo 912345678.';
  if (d.direccion.trim().length < 5) e.direccion = 'Ingresa tu dirección.';
  if (!d.region) e.region = 'Selecciona una región.';
  if (!d.comuna) e.comuna = 'Selecciona una comuna.';
  if (!validarPassword(d.password)) e.password = 'Mínimo 6 caracteres, con letras y números.';
  if (d.confirmar !== d.password) e.confirmar = 'Las contraseñas no coinciden.';
  return e;
}

export default function Registro() {
  const [datos, setDatos] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const { registrar } = useSesion();
  const navegar = useNavigate();
  const campo = (n) => (v) => setDatos((d) => ({ ...d, [n]: v }));

  async function enviar(e) {
    e.preventDefault();
    const errs = validarRegistro(datos);
    setErrores(errs);
    setError('');
    if (Object.keys(errs).length) return;
    setEnviando(true);
    const { confirmar, ...cuerpo } = datos;
    const r = await registrar(cuerpo);
    setEnviando(false);
    if (!r.ok) {
      if (r.campo) setErrores({ [r.campo]: r.error });
      setError(r.error || 'No se pudo crear la cuenta.');
      return;
    }
    navegar('/login?registrado=1');
  }

  return (
    <div className="row justify-content-center">
      <div className="col-lg-9">
        <form className="card shadow-sm" onSubmit={enviar} noValidate>
          <div className="card-body p-4">
            <h1 className="h4">Crear cuenta</h1>
            <p className="small text-secondary">Con tu cuenta tus datos se completan solos al pagar y puedes revisar tus pedidos.</p>
            <MensajeAlerta mensaje={error} />
            <div className="row">
              <CampoFormulario className="col-md-4" id="rut" etiqueta="RUT" requerido valor={datos.rut} onCambiar={campo('rut')} error={errores.rut} placeholder="12.345.678-5" />
              <CampoFormulario className="col-md-4" id="nombre" etiqueta="Nombre" requerido valor={datos.nombre} onCambiar={campo('nombre')} error={errores.nombre} />
              <CampoFormulario className="col-md-4" id="apellido" etiqueta="Apellido" requerido valor={datos.apellido} onCambiar={campo('apellido')} error={errores.apellido} />
              <CampoFormulario className="col-md-4" id="usuario" etiqueta="Nombre de usuario" requerido valor={datos.usuario} onCambiar={campo('usuario')} error={errores.usuario} />
              <CampoFormulario className="col-md-4" id="email" tipo="email" etiqueta="Correo" requerido valor={datos.email} onCambiar={campo('email')} error={errores.email} />
              <CampoFormulario className="col-md-4" id="telefono" tipo="tel" etiqueta="Teléfono" requerido valor={datos.telefono} onCambiar={campo('telefono')} error={errores.telefono} />
              <CampoFormulario className="col-12" id="direccion" etiqueta="Dirección" requerido valor={datos.direccion} onCambiar={campo('direccion')} error={errores.direccion} />
            </div>
            <SelectorRegionComuna region={datos.region} comuna={datos.comuna} errores={errores} idPrefijo="registro"
              onCambiar={({ region, comuna }) => setDatos((d) => ({ ...d, region, comuna }))} />
            <div className="row">
              <CampoFormulario className="col-md-6" id="password" tipo="password" etiqueta="Contraseña" requerido valor={datos.password} onCambiar={campo('password')} error={errores.password} autoComplete="new-password" />
              <CampoFormulario className="col-md-6" id="confirmar" tipo="password" etiqueta="Repite la contraseña" requerido valor={datos.confirmar} onCambiar={campo('confirmar')} error={errores.confirmar} autoComplete="new-password" />
            </div>
          </div>
          <div className="card-footer d-flex justify-content-between align-items-center">
            <Link to="/login" className="small">Ya tengo cuenta</Link>
            <button type="submit" className="btn btn-marca" disabled={enviando}>{enviando ? 'Creando cuenta…' : 'Crear cuenta'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
