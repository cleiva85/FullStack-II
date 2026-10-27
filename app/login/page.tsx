'use client';

import { Suspense } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import CampoFormulario from '@/app/_components/comunes/CampoFormulario';
import MensajeAlerta from '@/app/_components/comunes/MensajeAlerta';
import { useSesion } from '@/app/_context/SesionContext';

function IniciarSesion() {
  const [datos, setDatos] = useState({ clave: '', password: '' });
  const [errores, setErrores] = useState({});
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const { iniciar } = useSesion();
  const router = useRouter();
  const params = useSearchParams();

  async function enviar(e) {
    e.preventDefault();
    const errs = {};
    if (!datos.clave.trim()) errs.clave = 'Ingresa tu usuario o correo.';
    if (!datos.password) errs.password = 'Ingresa tu contraseña.';
    setErrores(errs);
    setError('');
    if (Object.keys(errs).length) return;

    setCargando(true);
    const r = await iniciar(datos.clave.trim(), datos.password);
    setCargando(false);
    if (!r.ok) { setError(r.error || 'No se pudo iniciar sesión.'); return; }
    router.push(params.get('next') || (r.usuario?.rol === 'admin' ? '/admin' : '/'));
  }

  return (
    <div className="row justify-content-center">
      <div className="col-sm-10 col-md-7 col-lg-5">
        <form className="card shadow-sm" onSubmit={enviar} noValidate>
          <div className="card-body p-4">
            <h1 className="h4 mb-3">Iniciar sesión</h1>
            {params.get('registrado') && <MensajeAlerta mensaje="Cuenta creada. Ya puedes iniciar sesión." tipo="success" />}
            {params.get('restablecida') && <MensajeAlerta mensaje="Contraseña actualizada. Inicia sesión con tu nueva contraseña." tipo="success" />}
            <MensajeAlerta mensaje={error} />
            <CampoFormulario id="clave" etiqueta="Usuario o correo" valor={datos.clave} error={errores.clave}
              onCambiar={(v) => setDatos((d) => ({ ...d, clave: v }))} autoComplete="username" />
            <CampoFormulario id="password" tipo="password" etiqueta="Contraseña" valor={datos.password} error={errores.password}
              onCambiar={(v) => setDatos((d) => ({ ...d, password: v }))} autoComplete="current-password" />
            <p className="small text-end mb-3" style={{ marginTop: "-0.5rem" }}><Link href="/recuperar-contrasena">¿Olvidaste tu contraseña?</Link></p>
            <button type="submit" className="btn btn-marca w-100" disabled={cargando}>{cargando ? 'Ingresando…' : 'Iniciar sesión'}</button>
            <p className="small text-center mt-3 mb-0">¿No tienes cuenta? <Link href="/registro">Crea una aquí</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}

/** useSearchParams() necesita un límite de Suspense en Next.js */
export default function PaginaIniciarSesion() {
  return (
    <Suspense>
      <IniciarSesion />
    </Suspense>
  );
}
