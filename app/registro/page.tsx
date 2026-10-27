'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CampoFormulario from '@/app/_components/comunes/CampoFormulario';
import MensajeAlerta from '@/app/_components/comunes/MensajeAlerta';
import SelectorRegionComuna from '@/app/_components/tienda/SelectorRegionComuna';
import { useSesion } from '@/app/_context/SesionContext';
import { validarRegistro } from '@/app/_lib/utils/validadores';

const VACIO = {
  rut: '', nombre: '', apellido: '', usuario: '', email: '', telefono: '',
  direccion: '', region: '', comuna: '', password: '', confirmar: '',
};


export default function Registro() {
  const [datos, setDatos] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const { registrar } = useSesion();
  const router = useRouter();
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
    router.push('/login?registrado=1');
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
            <Link href="/login" className="small">Ya tengo cuenta</Link>
            <button type="submit" className="btn btn-marca" disabled={enviando}>{enviando ? 'Creando cuenta…' : 'Crear cuenta'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
