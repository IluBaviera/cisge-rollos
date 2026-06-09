import { useState, useEffect } from 'react';
import { getStock, postIngreso } from './api.js';

function adaptarStock(response) {
  return (response.productos ?? []).map(p => ({
    id:                 p.codigo,
    nombre:             p.descripcion,
    marca:              p.marca,
    metros_disponibles: Object.values(p.almacenes ?? {}).reduce((s, v) => s + v, 0),
  }));
}

export default function IngresosView() {
  const [catalogo,    setCatalogo]    = useState([]);
  const [query,       setQuery]       = useState('');
  const [selProducto, setSelProducto] = useState(null);
  const [metros,      setMetros]      = useState('');
  const [ubicacion,   setUbicacion]   = useState('');
  const [referencia,  setReferencia]  = useState('');
  const [ingresos,    setIngresos]    = useState([]);
  const [submitting,  setSubmitting]  = useState(false);
  const [toast,       setToast]       = useState({ msg: '', ok: true });

  useEffect(() => {
    getStock()
      .then(data => setCatalogo(adaptarStock(data)))
      .catch(() => {});
  }, []);

  const resultados = query.length >= 2
    ? catalogo.filter(p =>
        p.nombre.toLowerCase().includes(query.toLowerCase()) ||
        p.id.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : [];

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast({ msg: '', ok: true }), 3000);
  };

  const handleAgregar = async () => {
    if (!selProducto)        return showToast('Selecciona un producto', false);
    const m = parseFloat(metros);
    if (!m || m <= 0)        return showToast('Metros inválidos', false);
    if (!ubicacion.trim())   return showToast('Ingresa la ubicación', false);

    setSubmitting(true);
    try {
      await postIngreso({
        almacen_id: 1,
        codf:       selProducto.id,
        marca:      selProducto.marca ?? '',
        usuario:    'almacen',
        ubicacion:  ubicacion.trim(),
        referencia: referencia.trim() || '',
        rollos:     [m],
      });

      const now  = new Date();
      const hora = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      setIngresos(prev => [...prev, {
        nombre:     selProducto.nombre,
        codf:       selProducto.id,
        metros:     m,
        ubicacion:  ubicacion.trim(),
        referencia: referencia.trim(),
        hora,
      }]);

      showToast(`✅ Ingreso registrado (${m} m)`);
      setMetros('');
      setUbicacion('');
      setReferencia('');
      setQuery('');
      setSelProducto(null);
    } catch (err) {
      showToast(`Error: ${err.message}`, false);
    } finally {
      setSubmitting(false);
    }
  };

  const totalRollos = ingresos.length;
  const totalMetros = ingresos.reduce((s, i) => s + i.metros, 0);

  return (
    <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24">

      {/* Toast */}
      {toast.msg && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-lg ${
          toast.ok ? 'bg-gray-900' : 'bg-red-600'
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Resumen del día */}
      <div className="card mb-5 p-4">
        <div className="text-xs text-gray-400 uppercase tracking-widest mb-2 font-semibold">
          Ingresos de hoy
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 rounded-xl p-3 text-center">
            <div className="text-3xl font-black text-blue-700">{totalRollos}</div>
            <div className="text-xs text-blue-500 mt-0.5">rollos</div>
          </div>
          <div className="bg-emerald-50 rounded-xl p-3 text-center">
            <div className="text-3xl font-black text-emerald-700">{totalMetros.toFixed(0)}</div>
            <div className="text-xs text-emerald-500 mt-0.5">metros totales</div>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="card mb-4 p-4">
        <div className="text-xs text-gray-400 uppercase tracking-widest mb-3 font-semibold">
          Agregar Rollo
        </div>

        {/* Buscador */}
        <div className="relative mb-3">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            className="input pl-9"
            placeholder="Buscar manguera por código o nombre…"
            value={query}
            onChange={e => { setQuery(e.target.value); setSelProducto(null); }}
          />
        </div>

        {/* Dropdown */}
        {resultados.length > 0 && !selProducto && (
          <ul className="border border-gray-200 rounded-xl overflow-hidden mb-3 divide-y divide-gray-100">
            {resultados.map(p => (
              <li key={p.id}>
                <button
                  onClick={() => { setSelProducto(p); setQuery(p.nombre); }}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{p.nombre}</div>
                    <div className="text-xs text-gray-400 font-mono">{p.id}</div>
                  </div>
                  <span className="text-blue-500 text-lg">›</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Producto seleccionado */}
        {selProducto && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-3 flex items-start justify-between gap-2">
            <div>
              <div className="text-sm font-bold text-blue-900">{selProducto.nombre}</div>
              <div className="text-xs text-blue-500 font-mono">{selProducto.id}</div>
              <div className="text-xs text-gray-500 mt-1">
                {selProducto.metros_disponibles.toFixed(1)} m disponibles en stock
              </div>
            </div>
            <button
              onClick={() => { setSelProducto(null); setQuery(''); }}
              className="text-blue-400 hover:text-blue-700 text-lg mt-0.5"
            >
              ×
            </button>
          </div>
        )}

        {/* Campos */}
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 font-medium mb-1">Metros *</label>
              <input
                type="number"
                inputMode="decimal"
                className="input"
                placeholder="100"
                value={metros}
                onChange={e => setMetros(e.target.value)}
                min="0.1"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 font-medium mb-1">Ubicación *</label>
              <input
                className="input"
                placeholder="P. ej. A-3"
                value={ubicacion}
                onChange={e => setUbicacion(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 font-medium mb-1">
              Referencia <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <input
              className="input"
              placeholder="OC-2025-001"
              value={referencia}
              onChange={e => setReferencia(e.target.value)}
            />
          </div>

          {metros && (
            <div className="bg-gray-50 rounded-lg px-3 py-2 flex items-center gap-2">
              <span className="text-xs text-gray-500">Rollo de</span>
              <span className="font-bold text-gray-900">{parseFloat(metros) || 0} m</span>
              {selProducto && (
                <>
                  <span className="text-xs text-gray-400">·</span>
                  <span className="text-xs text-gray-500 truncate">{selProducto.nombre}</span>
                </>
              )}
            </div>
          )}

          <button
            onClick={handleAgregar}
            disabled={submitting}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <span className="text-lg">+</span>
            )}
            {submitting ? 'Registrando…' : 'Agregar rollo'}
          </button>
        </div>
      </div>

      {/* Historial de la sesión */}
      {ingresos.length > 0 && (
        <div className="card">
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
              Registros de esta sesión
            </div>
          </div>
          <ul className="divide-y divide-gray-100">
            {[...ingresos].reverse().map((ing, i) => (
              <li key={i} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-800 truncate">{ing.nombre}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    Est. {ing.ubicacion}
                    {ing.referencia && ` · ${ing.referencia}`}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-bold text-blue-700 text-sm">{ing.metros} m</div>
                  <div className="text-xs text-gray-400">{ing.hora}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
