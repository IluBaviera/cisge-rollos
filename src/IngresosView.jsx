import { useState } from 'react';
import {
  mangueras, ingresosDelDia, getManguera, getRolloDisponible,
  getRollosByManguera, agregarRollo, formatFecha,
} from './data/mockData.js';

export default function IngresosView() {
  const [query,      setQuery]      = useState('');
  const [selManguera,setSelManguera]= useState(null);
  const [metros,     setMetros]     = useState('');
  const [ubicacion,  setUbicacion]  = useState('');
  const [referencia, setReferencia] = useState('');
  const [ingresos,   setIngresos]   = useState(ingresosDelDia);
  const [toast,      setToast]      = useState('');

  const resultados = query.length >= 2
    ? mangueras.filter(m =>
        m.nombre.toLowerCase().includes(query.toLowerCase()) ||
        m.codigo.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : [];

  const showToast = msg => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleAgregar = () => {
    if (!selManguera) return showToast('Selecciona un producto');
    const m = parseFloat(metros);
    if (!m || m <= 0)   return showToast('Metros inválidos');
    if (!ubicacion)     return showToast('Ingresa la ubicación');

    const rolloId = agregarRollo({
      manguera_id: selManguera.id,
      metros: m,
      ubicacion,
    });

    const now = new Date();
    const hora = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

    setIngresos(prev => [...prev, {
      id: rolloId,
      manguera_id: selManguera.id,
      metros: m,
      ubicacion,
      referencia,
      hora,
    }]);

    showToast(`✅ Rollo ${rolloId} agregado (${m} m)`);
    setMetros('');
    setUbicacion('');
    setReferencia('');
    setQuery('');
    setSelManguera(null);
  };

  const totalRollos = ingresos.length;
  const totalMetros = ingresos.reduce((s, i) => s + i.metros, 0);

  return (
    <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24">

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-lg transition-all">
          {toast}
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

      {/* Buscador de producto */}
      <div className="card mb-4 p-4">
        <div className="text-xs text-gray-400 uppercase tracking-widest mb-3 font-semibold">
          Agregar Rollo
        </div>

        {/* Buscar */}
        <div className="relative mb-3">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            className="input pl-9"
            placeholder="Buscar manguera por código o nombre…"
            value={query}
            onChange={e => { setQuery(e.target.value); setSelManguera(null); }}
          />
        </div>

        {/* Dropdown resultados */}
        {resultados.length > 0 && !selManguera && (
          <ul className="border border-gray-200 rounded-xl overflow-hidden mb-3 divide-y divide-gray-100">
            {resultados.map(m => (
              <li key={m.id}>
                <button
                  onClick={() => { setSelManguera(m); setQuery(m.nombre); }}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{m.nombre}</div>
                    <div className="text-xs text-gray-400 font-mono">{m.codigo}</div>
                  </div>
                  <span className="text-blue-500 text-lg">›</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Producto seleccionado */}
        {selManguera && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-3 flex items-start justify-between gap-2">
            <div>
              <div className="text-sm font-bold text-blue-900">{selManguera.nombre}</div>
              <div className="text-xs text-blue-500 font-mono">{selManguera.codigo}</div>
              <div className="text-xs text-gray-500 mt-1">
                {getRollosByManguera(selManguera.id).length} rollo(s) en stock
              </div>
            </div>
            <button
              onClick={() => { setSelManguera(null); setQuery(''); }}
              className="text-blue-400 hover:text-blue-700 text-lg mt-0.5"
            >
              ×
            </button>
          </div>
        )}

        {/* Campos del rollo */}
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

          {/* Total en tiempo real */}
          {metros && (
            <div className="bg-gray-50 rounded-lg px-3 py-2 flex items-center gap-2">
              <span className="text-xs text-gray-500">Rollo de</span>
              <span className="font-bold text-gray-900">{parseFloat(metros) || 0} m</span>
              {selManguera && (
                <>
                  <span className="text-xs text-gray-400">·</span>
                  <span className="text-xs text-gray-500 truncate">{selManguera.nombre}</span>
                </>
              )}
            </div>
          )}

          <button
            onClick={handleAgregar}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3"
          >
            <span className="text-lg">+</span>
            Agregar rollo
          </button>
        </div>
      </div>

      {/* Historial de hoy */}
      {ingresos.length > 0 && (
        <div className="card">
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
              Registros del día
            </div>
          </div>
          <ul className="divide-y divide-gray-100">
            {[...ingresos].reverse().map(ing => {
              const mng = getManguera(ing.manguera_id);
              return (
                <li key={ing.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-800 truncate">{mng?.nombre}</div>
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
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
