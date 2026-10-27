import { useState } from 'react';
import CampoFormulario from '../../components/comunes/CampoFormulario.tsx';
import MensajeAlerta from '../../components/comunes/MensajeAlerta.tsx';
import { validarEmail } from '../../utils/validadores.js';

const VACIO = { nombre: '', correo: '', mensaje: '' };

export default function Contacto() {
  const [datos, setDatos] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);
  const campo = (n) => (v) => setDatos((d) => ({ ...d, [n]: v }));

  function enviar(e) {
    e.preventDefault();
    const errs = {};
    if (datos.nombre.trim().length < 2) errs.nombre = 'Ingresa tu nombre.';
    if (!validarEmail(datos.correo)) errs.correo = 'Ingresa un correo válido.';
    if (datos.mensaje.trim().length < 10) errs.mensaje = 'Escribe un mensaje de al menos 10 caracteres.';
    setErrores(errs);
    if (Object.keys(errs).length) return;
    setEnviado(true);
    setDatos(VACIO);
  }

  return (
    <div className="row justify-content-center">
      <div className="col-lg-7">
        <form className="card shadow-sm" onSubmit={enviar} noValidate>
          <div className="card-body p-4">
            <h1 className="h4">Contacto</h1>
            <p className="small text-secondary">Escríbenos por pedidos especiales, despachos o cotizaciones para tu negocio.</p>
            <MensajeAlerta mensaje={enviado ? 'Recibimos tu mensaje. Te responderemos dentro de 24 horas hábiles.' : ''} tipo="success" onCerrar={() => setEnviado(false)} />
            <CampoFormulario id="contacto-nombre" etiqueta="Nombre" requerido valor={datos.nombre} onCambiar={campo('nombre')} error={errores.nombre} />
            <CampoFormulario id="contacto-correo" tipo="email" etiqueta="Correo" requerido valor={datos.correo} onCambiar={campo('correo')} error={errores.correo} />
            <CampoFormulario id="contacto-mensaje" tipo="textarea" rows={4} etiqueta="Mensaje" requerido valor={datos.mensaje} onCambiar={campo('mensaje')} error={errores.mensaje} />
            <button type="submit" className="btn btn-marca">Enviar mensaje</button>
          </div>
        </form>
      </div>
    </div>
  );
}
