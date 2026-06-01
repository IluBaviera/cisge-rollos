import { useState } from 'react';
import {
  mangueras, CATEGORIAS,
  rollos as rollosMock,
  getRolloDisponible, formatFecha,
} from './data/mockData.js';

const TABS = Object.keys(CATEGORIAS);

function RolloRow({ rollo }) {
  const disp = getRolloDisponible(rollo);
  const pct = Math.round((disp / rollo.metros_totales) * 100);
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-t border-gray-50">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
            {rollo.id}
          </span>
          <span className="text-sm text-gray-600">Est. {rollo.ubicacion}</span>
        </div>
        <div className="text-xs text-gray-400 mt-0.5">
          Ingresado: {formatFecha(rollo.fecha_ingreso)}
        </div>
      </div>
      <div className="text-right">
        <div className="font-semibold text-gray-900 text-sm">{disp.toFixed(1)} m</div>
        <div className={`text-xs font-medium ${pct > 50 ? 'text-emerald-600' : pct > 20 ? 'text-amber-500' : 'text-red-500'}`}>
          {pct}% restante
        </div>
      </div>
    </div>
  );
}

function MangueraCard({ manguera, query, rollos }) {
  const [open, setOpen] = useState(false);
  const rollosM = rollos.filter(r => r.manguera_id === manguera.id);
  const disp    = rollosM.reduce((s, r) => s + getRolloDisponible(r), 0);
  const avg     = rollosM.length ? disp / rollosM.length : 0;

  const highlightText = text => {
    if (!query) return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <mark className="bg-yellow-200 text-gray-900 rounded">{text.slice(idx, idx + query.length)}</mark>
        {text.slice(idx + query.length)}
      </>
    );
  };

  return (
    <div className="card mb-3">
      <button
        className="w-full text-left px-4 py-4"
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 leading-tight">
              {highlightText(manguera.nombre)}
            </div>
            <div className="text-xs text-gray-400 font-mono mt-0.5">{manguera.codigo}</div>
          </div>
          <span className={`text-gray-400 text-lg transition-transform ${open ? 'rotate-90' : ''}`}>›</span>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="bg-blue-50 rounded-lg p-2 text-center">
            <div className="font-bold text-blue-700 text-lg leading-tight">{disp.toFixed(1)}</div>
            <div className="text-blue-500 text-xs">metros</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <div className="font-bold text-gray-700 text-lg leading-tight">{rollosM.length}</div>
            <div className="text-gray-500 text-xs">rollos</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <div className="font-bold text-gray-700 text-lg leading-tight">{avg.toFixed(0)}</div>
            <div className="text-gray-500 text-xs">prom/rollo</div>
          </div>
        </div>
      </button>

      {open && (
        <div className="border-t border-gray-100">
          {rollosM.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-4">Sin rollos registrados</p>
          ) : (
            rollosM.map(r => <RolloRow key={r.id} rollo={r} />)
          )}
        </div>
      )}
    </div>
  );
}

export default function HoseInventory({ rollos = rollosMock }) {
  const [tab, setTab] = useState(TABS[0]);
  const [query, setQuery] = useState('');

  const filtered = mangueras.filter(m => {
    const matchCat = query ? true : m.categoria === tab;
    const matchQ   = query
      ? m.nombre.toLowerCase().includes(query.toLowerCase()) ||
        m.codigo.toLowerCase().includes(query.toLowerCase())
      : true;
    return matchCat && matchQ;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="px-4 pt-3 pb-2">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            className="input pl-9"
            placeholder="Buscar por código o nombre…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {query && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setQuery('')}
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      {!query && (
        <div className="flex border-b border-gray-200 px-4">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 text-xs font-semibold transition-colors ${
                tab === t ? 'tab-active' : 'tab-inactive'
              }`}
            >
              {CATEGORIAS[t].split(' / ')[0]}
            </button>
          ))}
        </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-24">
        {query && (
          <p className="text-xs text-gray-400 mb-3">
            {filtered.length} resultado{filtered.length !== 1 ? 's' : ''} para "{query}"
          </p>
        )}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <span className="text-4xl mb-3">🔎</span>
            <p className="text-sm">Sin resultados</p>
          </div>
        ) : (
          filtered.map(m => <MangueraCard key={m.id} manguera={m} query={query} rollos={rollos} />)
        )}
      </div>
    </div>
  );
}
