'use client';

import REGIONES from '@/app/_lib/data/regiones.json';

/** Selects dependientes de región y comuna (16 regiones y 346 comunas de Chile, en regiones.json). */
export default function SelectorRegionComuna({ region, comuna, onCambiar, errores = {}, idPrefijo = 'rc' }) {
  const regiones = REGIONES.regions;
  const comunas = regiones.find((r) => r.name === region)?.communes ?? [];

  return (
    <div className="row">
      <div className="col-md-6 mb-3">
        <label htmlFor={`${idPrefijo}-region`} className="form-label">Región<span className="text-danger"> *</span></label>
        <select id={`${idPrefijo}-region`} className={`form-select ${errores.region ? 'is-invalid' : ''}`}
          value={region} onChange={(e) => onCambiar({ region: e.target.value, comuna: '' })}>
          <option value="">Selecciona una región</option>
          {regiones.map((r) => <option key={r.name} value={r.name}>{r.name}</option>)}
        </select>
        {errores.region && <div className="invalid-feedback">{errores.region}</div>}
      </div>
      <div className="col-md-6 mb-3">
        <label htmlFor={`${idPrefijo}-comuna`} className="form-label">Comuna<span className="text-danger"> *</span></label>
        <select id={`${idPrefijo}-comuna`} className={`form-select ${errores.comuna ? 'is-invalid' : ''}`}
          value={comuna} disabled={!region} onChange={(e) => onCambiar({ region, comuna: e.target.value })}>
          <option value="">{region ? 'Selecciona una comuna' : 'Primero elige una región'}</option>
          {comunas.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
        </select>
        {errores.comuna && <div className="invalid-feedback">{errores.comuna}</div>}
      </div>
    </div>
  );
}
