'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import EncabezadoSeccion from '@/app/_components/admin/EncabezadoSeccion';
import CampoFormulario from '@/app/_components/comunes/CampoFormulario';
import { useAviso } from '@/app/_context/AvisoContext';
import { categoriasDB } from '@/app/_lib/data/db';
import { slugificar } from '@/app/_lib/utils/formato';

export default function CategoriaFormulario() {
  const { id } = useParams();
  const existente = id ? categoriasDB.obtener(id) : null;
  const [datos, setDatos] = useState(existente || { nombre: '', img: '/img/' });
  const [error, setError] = useState('');
  const router = useRouter();
  const aviso = useAviso();

  if (id && !existente) return <p>No existe la categoría {id}.</p>;

  function guardar(e) {
    e.preventDefault();
    const nombre = datos.nombre.trim();
    if (nombre.length < 3) { setError('El nombre debe tener al menos 3 caracteres.'); return; }
    const repetida = categoriasDB.listar().some((c) => c.nombre.toLowerCase() === nombre.toLowerCase() && c.id !== existente?.id);
    if (repetida) { setError('Ya existe una categoría con ese nombre.'); return; }
    const fila = { nombre, slug: slugificar(nombre), img: datos.img.trim() };
    if (existente) categoriasDB.actualizar(existente.id, fila); else categoriasDB.crear(fila);
    aviso(existente ? 'Categoría actualizada' : 'Categoría creada');
    router.push('/admin/categorias');
  }

  return (
    <>
      <EncabezadoSeccion titulo={existente ? `Editar categoría «${existente.nombre}»` : 'Nueva categoría'} />
      <form onSubmit={guardar} noValidate style={{ maxWidth: 520 }}>
        <CampoFormulario id="c-nombre" etiqueta="Nombre" requerido valor={datos.nombre} error={error}
          onCambiar={(v) => setDatos((d) => ({ ...d, nombre: v }))}
          ayuda={datos.nombre ? `Dirección: /categorias/${slugificar(datos.nombre)}` : undefined} />
        <CampoFormulario id="c-img" etiqueta="Imagen (ruta o URL)" valor={datos.img} onCambiar={(v) => setDatos((d) => ({ ...d, img: v }))} />
        {existente && <p className="small text-secondary">Si cambias el nombre, sus productos se mueven automáticamente al nuevo nombre.</p>}
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">{existente ? 'Guardar cambios' : 'Crear categoría'}</button>
          <button type="button" className="btn btn-outline-secondary" onClick={() => router.push('/admin/categorias')}>Cancelar</button>
        </div>
      </form>
    </>
  );
}
