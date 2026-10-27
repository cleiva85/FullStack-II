'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import EncabezadoSeccion from '@/app/_components/admin/EncabezadoSeccion';
import CampoFormulario from '@/app/_components/comunes/CampoFormulario';
import { useAviso } from '@/app/_context/AvisoContext';
import { categoriasDB, productosDB } from '@/app/_lib/data/db';
import { validarProducto } from '@/app/_lib/utils/validadores';

const VACIO = { nombre: '', marca: '', categoria: '', descripcion: '', precio: '', oferta: '', stock: '', stockCritico: '10', img: '/img/' };

/** Crea un producto (/admin/productos/nuevo) o edita uno existente (/admin/productos/:id/editar). */
export default function ProductoFormulario() {
  const { id } = useParams();
  const editando = Boolean(id);
  const existente = editando ? productosDB.obtener(id) : null;
  const [datos, setDatos] = useState(() => (existente
    ? { ...existente, precio: String(existente.precio), oferta: existente.oferta == null ? '' : String(existente.oferta), stock: String(existente.stock), stockCritico: String(existente.stockCritico ?? 10) }
    : VACIO));
  const [errores, setErrores] = useState({});
  const categorias = categoriasDB.listar();
  const router = useRouter();
  const aviso = useAviso();
  const campo = (n) => (v) => setDatos((d) => ({ ...d, [n]: v }));

  if (editando && !existente) return <p>No existe el producto {id}.</p>;

  function guardar(e) {
    e.preventDefault();
    const errs = validarProducto(datos);
    setErrores(errs);
    if (Object.keys(errs).length) return;
    const fila = {
      nombre: datos.nombre.trim(), marca: datos.marca.trim(), categoria: datos.categoria,
      descripcion: datos.descripcion.trim(), precio: Number(datos.precio),
      oferta: datos.oferta === '' ? null : Number(datos.oferta), stock: Number(datos.stock),
      stockCritico: Number(datos.stockCritico) || 10, img: datos.img.trim() || '/img/distribuidora.jpeg',
    };
    const guardado = editando ? productosDB.actualizar(id, fila) : productosDB.crear(fila);
    aviso(editando ? 'Producto actualizado' : 'Producto creado');
    router.push(`/admin/productos/${guardado.id}`);
  }

  return (
    <>
      <EncabezadoSeccion titulo={editando ? `Editar producto #${id}` : 'Nuevo producto'} />
      <form onSubmit={guardar} noValidate className="row g-4">
        <div className="col-lg-8">
          <div className="row">
            <CampoFormulario className="col-md-7" id="p-nombre" etiqueta="Nombre" requerido valor={datos.nombre} onCambiar={campo('nombre')} error={errores.nombre} />
            <CampoFormulario className="col-md-5" id="p-marca" etiqueta="Marca" valor={datos.marca} onCambiar={campo('marca')} />
            <div className="col-md-6 mb-3">
              <label htmlFor="p-categoria" className="form-label">Categoría<span className="text-danger"> *</span></label>
              <select id="p-categoria" className={`form-select ${errores.categoria ? 'is-invalid' : ''}`} value={datos.categoria} onChange={(e) => campo('categoria')(e.target.value)}>
                <option value="">Selecciona una categoría</option>
                {categorias.map((c) => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
              </select>
              {errores.categoria && <div className="invalid-feedback">{errores.categoria}</div>}
            </div>
            <CampoFormulario className="col-md-6" id="p-img" etiqueta="Imagen (ruta o URL)" valor={datos.img} onCambiar={campo('img')} ayuda="Ej: /img/productos/Coca_cola.webp" />
            <CampoFormulario className="col-12" id="p-descripcion" tipo="textarea" rows={2} etiqueta="Descripción" valor={datos.descripcion} onCambiar={campo('descripcion')} />
            <CampoFormulario className="col-md-3" id="p-precio" tipo="number" min="1" etiqueta="Precio" requerido valor={datos.precio} onCambiar={campo('precio')} error={errores.precio} />
            <CampoFormulario className="col-md-3" id="p-oferta" tipo="number" min="1" etiqueta="Precio oferta" valor={datos.oferta} onCambiar={campo('oferta')} error={errores.oferta} ayuda="Vacío = sin oferta" />
            <CampoFormulario className="col-md-3" id="p-stock" tipo="number" min="0" etiqueta="Stock" requerido valor={datos.stock} onCambiar={campo('stock')} error={errores.stock} />
            <CampoFormulario className="col-md-3" id="p-critico" tipo="number" min="0" etiqueta="Stock crítico" valor={datos.stockCritico} onCambiar={campo('stockCritico')} />
          </div>
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary">{editando ? 'Guardar cambios' : 'Crear producto'}</button>
            <button type="button" className="btn btn-outline-secondary" onClick={() => router.back()}>Cancelar</button>
          </div>
        </div>
        <div className="col-lg-4">
          <p className="form-label">Vista previa</p>
          <img src={datos.img} alt="" className="img-fluid rounded border bg-white p-2" onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }} onLoad={(e) => { e.currentTarget.style.visibility = 'visible'; }} />
        </div>
      </form>
    </>
  );
}
