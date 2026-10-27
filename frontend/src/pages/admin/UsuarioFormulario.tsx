import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EncabezadoSeccion from '../../components/admin/EncabezadoSeccion.tsx';
import CampoFormulario from '../../components/comunes/CampoFormulario.tsx';
import SelectorRegionComuna from '../../components/tienda/SelectorRegionComuna.tsx';
import { useAviso } from '../../context/AvisoContext.tsx';
import { usuariosDB } from '../../data/db.js';
import { validarEmail, validarRut, validarTelefono } from '../../utils/validadores.js';

const VACIO = { rut: '', nombre: '', apellido: '', correo: '', telefono: '', rol: 'cliente', direccion: '', region: '', comuna: '' };

export default function UsuarioFormulario() {
  const { id } = useParams();
  const existente = id ? usuariosDB.obtener(id) : null;
  const [datos, setDatos] = useState(existente || VACIO);
  const [errores, setErrores] = useState({});
  const navegar = useNavigate();
  const aviso = useAviso();
  const campo = (n) => (v) => setDatos((d) => ({ ...d, [n]: v }));

  if (id && !existente) return <p>No existe el usuario {id}.</p>;

  function guardar(e) {
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
    setErrores(errs);
    if (Object.keys(errs).length) return;
    const fila = { ...datos, nombre: datos.nombre.trim(), apellido: datos.apellido.trim(), correo: datos.correo.trim() };
    const guardado = existente
      ? usuariosDB.actualizar(existente.id, fila)
      : usuariosDB.crear({ ...fila, fechaRegistro: new Date().toISOString() });
    aviso(existente ? 'Usuario actualizado' : 'Usuario creado');
    navegar(`/admin/usuarios/${guardado.id}`);
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
          <button type="button" className="btn btn-outline-secondary" onClick={() => navegar('/admin/usuarios')}>Cancelar</button>
        </div>
      </form>
    </>
  );
}
