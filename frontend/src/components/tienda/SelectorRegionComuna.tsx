import { useEffect, useState } from 'react';
import { api } from '../../services/api.js';

let cache = null;
/** Solo para pruebas: olvida las regiones ya descargadas */
export const limpiarCacheRegiones = () => { cache = null; };

/** Selects dependientes de región y comuna. Las regiones vienen del backend (GET /api/regiones). */
export default function SelectorRegionComuna({ region, comuna, onCambiar, errores = {}, idPrefijo = 'rc' }) {
  const [regiones, setRegiones] = useState(cache || []);
  const [error, setError] = useState('');

  useEffect(() => {
    if (cache) return undefined;
    let activo = true;
    api.regiones().then((r) => {
      if (!activo) return;
      if (r.ok && Array.isArray(r.regions)) { cache = r.regions; setRegiones(r.regions); }
      else setError('No se pudieron cargar las regiones. Revisa que el backend esté encendido (npm start).');
    });
    return () => { activo = false; };
  }, []);

  const comunas = regiones.find((r) => r.name === region)?.communes ?? [];

  return (
    <div className="row">
      {error && <div className="col-12"><div className="alert alert-warning py-2" role="alert">{error}</div></div>}
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
