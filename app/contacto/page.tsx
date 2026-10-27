'use client';

import { useState } from 'react';
import CampoFormulario from '@/app/_components/comunes/CampoFormulario';
import MensajeAlerta from '@/app/_components/comunes/MensajeAlerta';
import { validarEmail } from '@/app/_lib/utils/validadores';
import { mensajesDB } from '@/app/_lib/data/db';
import { servicioCorreo } from '@/app/_lib/services/correo';

const VACIO = { nombre: '', correo: '', mensaje: '' };

/**
 * Formulario de contacto:
 * 1) guarda el mensaje en db.js (se ve en Panel admin → Mensajes);
 * 2) avisa a la tienda por correo con EmailJS (si no está configurado, el envío es simulado).
 */
export default function Contacto() {
  const [datos, setDatos] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [resultado, setResultado] = useState(null);   // { tipo, texto }
  const [enviando, setEnviando] = useState(false);
  const campo = (n) => (v) => setDatos((d) => ({ ...d, [n]: v }));

  async function enviar(e) {
    e.preventDefault();
    const errs = {};
    if (datos.nombre.trim().length < 2) errs.nombre = 'Ingresa tu nombre.';
    if (!validarEmail(datos.correo)) errs.correo = 'Ingresa un correo válido.';
    if (datos.mensaje.trim().length < 10) errs.mensaje = 'Escribe un mensaje de al menos 10 caracteres.';
    setErrores(errs);
    setResultado(null);
    if (Object.keys(errs).length) return;

    setEnviando(true);
    const mensaje = { nombre: datos.nombre.trim(), correo: datos.correo.trim(), mensaje: datos.mensaje.trim() };
    const guardado = mensajesDB.crear(mensaje);
    const envio = await servicioCorreo.enviarContacto(mensaje);
    if (envio.ok && !envio.simulado) mensajesDB.actualizar(guardado.id, { correoEnviado: true });
    setEnviando(false);
    setDatos(VACIO);
    setResultado(envio.ok
      ? { tipo: 'success', texto: 'Recibimos tu mensaje. Te responderemos dentro de 24 horas hábiles.' }
      : { tipo: 'warning', texto: 'Recibimos tu mensaje, pero no pudimos enviar el aviso por correo. Igual lo revisaremos dentro de 24 horas hábiles.' });
  }

  return (
    <div className="row justify-content-center">
      <div className="col-lg-7">
        <form className="card shadow-sm" onSubmit={enviar} noValidate>
          <div className="card-body p-4">
            <h1 className="h4">Contacto</h1>
            <p className="small text-secondary">Escríbenos por pedidos especiales, despachos o cotizaciones para tu negocio.</p>
            <MensajeAlerta mensaje={resultado?.texto} tipo={resultado?.tipo} onCerrar={() => setResultado(null)} />
            <CampoFormulario id="contacto-nombre" etiqueta="Nombre" requerido valor={datos.nombre} onCambiar={campo('nombre')} error={errores.nombre} />
            <CampoFormulario id="contacto-correo" tipo="email" etiqueta="Correo" requerido valor={datos.correo} onCambiar={campo('correo')} error={errores.correo} />
            <CampoFormulario id="contacto-mensaje" tipo="textarea" rows={4} etiqueta="Mensaje" requerido valor={datos.mensaje} onCambiar={campo('mensaje')} error={errores.mensaje} />
            <button type="submit" className="btn btn-marca" disabled={enviando}>{enviando ? 'Enviando…' : 'Enviar mensaje'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
