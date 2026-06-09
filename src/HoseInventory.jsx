import { useState } from 'react';
import {
  mangueras as manguerasMock, CATEGORIAS,
  rollos as rollosMock,
  getRolloDisponible, formatFecha,
} from './data/mockData.js';

const TABS_LEGACY = Object.keys(CATEGORIAS);

// ── Modo stock: tarjeta plana, metros_disponibles directo ─────────────────────

function StockCard({ producto, query }) {
  const highlight = text => {
    if (!query) return text;
    const i = text.toLowerCase().indexOf(query.toLowerCase());
    if (i === -1) return text;
    return (
      <>
        {text.slice(0, i)}
        <mark className="bg-yellow-200 text-gray-900 rounded">
          {text.slice(i, i + query.length)}
        </mark>
        {text.slice(i + query.length)}
      </>
    );
  };

  const disp = producto.metros_disponibles;
  return (
    <div className="card mb-3 px-4 py-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-900 leading-tight">
            {highlight(producto.nombre)}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-400 font-mono">{highlight(producto.id)}</span>
            {producto.marca && (
              <span className="text-xs bg-gray-100 text-gray-500 rounded px-1.5 py-0.5">
                {producto.marca}
              </span>
            )}
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className={`font-bold text-xl leading-tight ${disp > 0 ? 'text-blue-700' : 'text-red-400'}`}>
            {disp.toFixed(1)}
          </div>
          <div className="text-xs text-gray-400">metros</div>
        </div>
      </div>
    </div>
  );
}

// ── Modo rollos: tarjeta expandible con filas por rollo ───────────────────────

function RolloRow({ rollo }) {
  const disp = getRolloDisponible(rollo);
  const pct  = Math.round((disp / rollo.metros_totales) * 100);
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

  const highlight = text => {
    if (!query) return text;
    const i = text.toLowerCase().indexOf(query.toLowerCase());
    if (i === -1) return text;
    return (
      <>
        {text.slice(0, i)}
        <mark className="bg-yellow-200 text-gray-900 rounded">
          {text.slice(i, i + query.length)}
        </mark>
        {text.slice(i + query.length)}
      </>
    );
  };

  return (
    <div className="card mb-3">
      <button className="w-full text-left px-4 py-4" onClick={() => setOpen(o => !o)}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 leading-tight">
              {highlight(manguera.nombre)}
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

// ── Componente principal ──────────────────────────────────────────────────────
//
// Modos:
//   productos={[{id, nombre, marca, categoria, metros_disponibles}]}  → stock mode
//   rollos={[{id, manguera_id, ...}]}  (default: mock)                → rolls mode

export default function HoseInventory({ rollos = rollosMock, productos = null }) {
  const isStock = productos !== null;

  // En modo stock, tabs dinámicas derivadas de subfamilia; en modo rollos, estáticas.
  const tabKeys = isStock
    ? [...new Set(productos.map(p => p.categoria))]
    : TABS_LEGACY;

  const [tab,   setTab]   = useState(() => tabKeys[0] ?? '');
  const [query, setQuery] = useState('');

  const lista     = isStock ? productos : manguerasMock;
  const getCodigo = item  => isStock ? item.id : item.codigo;

  // "MANGUERAS HIDRAULICAS" → "HIDRAULICAS", "MANGUERAS DE AIRE Y AGUA" → "AIRE"
  const tabLabel = t => isStock
    ? t.replace(/^MANGUERAS\s+(DE\s+)?/i, '').split(' ')[0]
    : CATEGORIAS[t].split(' / ')[0];

  const filtered = lista.filter(item => {
    const matchCat = query ? true : item.categoria === tab;
    const matchQ   = query
      ? item.nombre.toLowerCase().includes(query.toLowerCase()) ||
        getCodigo(item).toLowerCase().startsWith(query.toLowerCase())
      : true;
    return matchCat && matchQ;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Buscador */}
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
          {tabKeys.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 text-xs font-semibold transition-colors truncate ${
                tab === t ? 'tab-active' : 'tab-inactive'
              }`}
            >
              {tabLabel(t)}
            </button>
          ))}
        </div>
      )}

      {/* Lista */}
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
        ) : isStock ? (
          filtered.map(p => <StockCard key={p.id} producto={p} query={query} />)
        ) : (
          filtered.map(m => <MangueraCard key={m.id} manguera={m} query={query} rollos={rollos} />)
        )}
      </div>
    </div>
  );
}
