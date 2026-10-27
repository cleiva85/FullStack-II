'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import EncabezadoSeccion from '@/app/_components/admin/EncabezadoSeccion';
import CampoFormulario from '@/app/_components/comunes/CampoFormulario';
import SelectorRegionComuna from '@/app/_components/tienda/SelectorRegionComuna';
import { useAviso } from '@/app/_context/AvisoContext';
import { usuariosDB } from '@/app/_lib/data/db';
import { validarEmail, validarPassword, validarRut, validarTelefono } from '@/app/_lib/utils/validadores';
import { crearCredencial } from '@/app/_lib/services/auth';

const VACIO = { usuario: '', rut: '', nombre: '', apellido: '', correo: '', telefono: '', rol: 'cliente', direccion: '', region: '', comuna: '' };

export default function UsuarioFormulario() {
  const { id } = useParams();
  const existente = id ? usuariosDB.obtener(id) : null;
  const [datos, setDatos] = useState(existente || VACIO);
  const [errores, setErrores] = useState({});
  const [clave, setClave] = useState('');   // contraseña nueva (se guarda cifrada)
  const router = useRouter();
  const aviso = useAviso();
  const campo = (n) => (v) => setDatos((d) => ({ ...d, [n]: v }));

  if (id && !existente) return <p>No existe el usuario {id}.</p>;

  async function guardar(e) {
    e.preventDefault();
    const errs = {};
    if (!validarRut(datos.rut)) errs.rut = 'RUT no válido.';
    if (datos.nombre.trim().length < 2) errs.nombre = 'Ingresa el nombre.';
    if (datos.apellido.trim().length < 2) errs.apellido = 'Ingresa el apellido.';
    if (!validarEmail(datos.correo)) errs.correo = 'Correo no válido.';
    else {
      const otro = usuariosDB.porCorreo(datos.correo);
      if (otro && otro.id !== existente?.id) errs.correo = 'Ya existe un usuario con ese correo.';
    }
    if (datos.telefono && !validarTelefono(datos.telefono)) errs.telefono = 'Teléfono no válido.';
    const nombreUsuario = String(datos.usuario || '').trim();
    if (nombreUsuario && !/^[A-Za-z0-9_]{4,}$/.test(nombreUsuario)) errs.usuario = 'Mínimo 4 caracteres: letras, números o _.';
    else if (nombreUsuario && usuariosDB.listar().some((u) => (u.usuario || '').toLowerCase() === nombreUsuario.toLowerCase() && u.id !== existente?.id)) {
      errs.usuario = 'Ese nombre de usuario ya está en uso.';
    }
    if ((!existente || clave) && !validarPassword(clave)) errs.clave = 'Mínimo 6 caracteres, con letras y números.';
    setErrores(errs);
    if (Object.keys(errs).length) return;
    const fila = { ...datos, usuario: String(datos.usuario || '').trim(), nombre: datos.nombre.trim(), apellido: datos.apellido.trim(), correo: datos.correo.trim() };
    if (clave) fila.password = await crearCredencial(clave);
    const guardado = existente
      ? usuariosDB.actualizar(existente.id, fila)
      : usuariosDB.crear({ ...fila, fechaRegistro: new Date().toISOString() });
    aviso(existente ? 'Usuario actualizado' : 'Usuario creado');
    router.push(`/admin/usuarios/${guardado.id}`);
  }

  return (
    <>
      <EncabezadoSeccion titulo={existente ? `Editar usuario: ${existente.nombre} ${existente.apellido}` : 'Nuevo usuario'} />
      <form onSubmit={guardar} noValidate style={{ maxWidth: 820 }}>
        <div className="row">
          <CampoFormulario className="col-md-4" id="u-rut" etiqueta="RUT" requerido valor={datos.rut} onCambiar={campo('rut')} error={errores.rut} />
          <CampoFormulario className="col-md-4" id="u-nombre" etiqueta="Nombre" requerido valor={datos.nombre} onCambiar={campo('nombre')} error={errores.nombre} />
          <CampoFormulario className="col-md-4" id="u-apellido" etiqueta="Apellido" requerido valor={datos.apellido} onCambiar={campo('apellido')} error={errores.apellido} />
          <CampoFormulario className="col-md-5" id="u-correo" tipo="email" etiqueta="Correo" requerido valor={datos.correo} onCambiar={campo('correo')} error={errores.correo} />
          <CampoFormulario className="col-md-4" id="u-telefono" etiqueta="Teléfono" valor={datos.telefono} onCambiar={campo('telefono')} error={errores.telefono} />
          <CampoFormulario className="col-md-4" id="u-usuario" etiqueta="Nombre de usuario" valor={datos.usuario} onCambiar={campo('usuario')} error={errores.usuario} ayuda="Opcional: también puede entrar con su correo." />
          <CampoFormulario className="col-md-5" id="u-clave" tipo="password" etiqueta={existente ? 'Nueva contraseña' : 'Contraseña'} requerido={!existente}
            valor={clave} onCambiar={setClave} error={errores.clave} autoComplete="new-password"
            ayuda={existente ? 'Déjala vacía para mantener la actual.' : undefined} />
          <div className="col-md-3 mb-3">
            <label htmlFor="u-rol" className="form-label">Rol</label>
            <select id="u-rol" className="form-select" value={datos.rol} onChange={(e) => campo('rol')(e.target.value)}>
              <option value="cliente">Cliente</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <CampoFormulario className="col-12" id="u-direccion" etiqueta="Dirección" valor={datos.direccion} onCambiar={campo('direccion')} />
        </div>
        <SelectorRegionComuna region={datos.region} comuna={datos.comuna} idPrefijo="usuario"
          onCambiar={({ region, comuna }) => setDatos((d) => ({ ...d, region, comuna }))} />
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">{existente ? 'Guardar cambios' : 'Crear usuario'}</button>
          <button type="button" className="btn btn-outline-secondary" onClick={() => router.push('/admin/usuarios')}>Cancelar</button>
        </div>
      </form>
    </>
  );
}
