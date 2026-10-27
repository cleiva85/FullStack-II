'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CampoFormulario from '@/app/_components/comunes/CampoFormulario';
import MensajeAlerta from '@/app/_components/comunes/MensajeAlerta';
import { solicitarCodigo, restablecerContrasena } from '@/app/_lib/services/auth';
import { validarEmail, validarPassword } from '@/app/_lib/utils/validadores';

/**
 * Olvidé mi contraseña, en dos pasos:
 *  1) el usuario ingresa su correo y se genera un código de 6 dígitos (válido 15 minutos);
 *  2) ingresa el código y su nueva contraseña.
 * Como el proyecto es solo frontend (sin servidor de correo), el envío es simulado:
 * el código aparece en pantalla (modo demostración) y en la consola del navegador.
 */
export default function RecuperarContrasena() {
  const [paso, setPaso] = useState(1);
  const [correo, setCorreo] = useState('');
  const [datos, setDatos] = useState({ codigo: '', password: '', confirmar: '' });
  const [errores, setErrores] = useState({});
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');
  const [codigoDemo, setCodigoDemo] = useState('');
  const [enviando, setEnviando] = useState(false);
  const router = useRouter();
  const campo = (n) => (v) => setDatos((d) => ({ ...d, [n]: v }));

  async function pedirCodigo(e) {
    e.preventDefault();
    setError('');
    if (!validarEmail(correo)) { setErrores({ correo: 'Ingresa un correo válido.' }); return; }
    setErrores({});
    setEnviando(true);
    const r = await solicitarCodigo(correo.trim());
    setEnviando(false);
    if (!r.ok) { setError(r.error || 'No se pudo enviar el código.'); return; }
    setAviso(r.mensaje);
    setCodigoDemo(r.codigoDemo || '');
    setPaso(2);
  }

  async function restablecer(e) {
    e.preventDefault();
    setError('');
    const errs = {};
    if (!/^\d{6}$/.test(datos.codigo.trim())) errs.codigo = 'El código tiene 6 dígitos.';
    if (!validarPassword(datos.password)) errs.password = 'Mínimo 6 caracteres, con letras y números.';
    if (datos.confirmar !== datos.password) errs.confirmar = 'Las contraseñas no coinciden.';
    setErrores(errs);
    if (Object.keys(errs).length) return;
    setEnviando(true);
    const r = await restablecerContrasena(correo.trim(), datos.codigo.trim(), datos.password);
    setEnviando(false);
    if (!r.ok) {
      if (r.campo && r.campo !== 'codigo') setErrores({ [r.campo]: r.error });
      setError(r.error || 'No se pudo cambiar la contraseña.');
      return;
    }
    router.push('/login?restablecida=1');
  }

  return (
    <div className="row justify-content-center">
      <div className="col-sm-10 col-md-7 col-lg-5">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h1 className="h4 mb-1">Recuperar contraseña</h1>

            {paso === 1 && (
              <form onSubmit={pedirCodigo} noValidate>
                <p className="small text-secondary">Ingresa el correo de tu cuenta y te enviaremos un código para crear una contraseña nueva.</p>
                <MensajeAlerta mensaje={error} />
                <CampoFormulario id="recuperar-correo" tipo="email" etiqueta="Correo" valor={correo} onCambiar={setCorreo}
                  error={errores.correo} autoComplete="email" />
                <button type="submit" className="btn btn-marca w-100" disabled={enviando}>
                  {enviando ? 'Enviando…' : 'Enviar código'}
                </button>
              </form>
            )}

            {paso === 2 && (
              <form onSubmit={restablecer} noValidate>
                <p className="small text-secondary">{aviso}</p>
                {codigoDemo && (
                  <div className="alert alert-info py-2" role="status">
                    <strong>Modo demostración:</strong> tu código es <span className="fw-bold fs-5">{codigoDemo}</span>.
                    El envío de correos no está configurado, por eso lo mostramos aquí.
                  </div>
                )}
                <MensajeAlerta mensaje={error} />
                <CampoFormulario id="recuperar-codigo" etiqueta="Código de 6 dígitos" valor={datos.codigo} onCambiar={campo('codigo')}
                  error={errores.codigo} inputMode="numeric" maxLength={6} autoComplete="one-time-code" />
                <CampoFormulario id="recuperar-password" tipo="password" etiqueta="Nueva contraseña" valor={datos.password}
                  onCambiar={campo('password')} error={errores.password} autoComplete="new-password" />
                <CampoFormulario id="recuperar-confirmar" tipo="password" etiqueta="Repite la nueva contraseña" valor={datos.confirmar}
                  onCambiar={campo('confirmar')} error={errores.confirmar} autoComplete="new-password" />
                <button type="submit" className="btn btn-marca w-100" disabled={enviando}>
                  {enviando ? 'Guardando…' : 'Cambiar contraseña'}
                </button>
                <button type="button" className="btn btn-link btn-sm w-100 mt-2"
                  onClick={() => { setPaso(1); setError(''); setErrores({}); setDatos({ codigo: '', password: '', confirmar: '' }); }}>
                  Pedir un código nuevo
                </button>
              </form>
            )}

            <p className="small text-center mt-3 mb-0"><Link href="/login">Volver a iniciar sesión</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
