import { useState, useEffect } from 'react';
import { getRollos } from './api.js';

function adaptarRollos(data) {
  const map = {};
  for (const r of data) {
    if (!map[r.codf]) {
      map[r.codf] = {
        codf:        r.codf,
        descripcion: r.descripcion,
        metros:      0,
        nrollos:     0,
        rollos:      [],
      };
    }
    map[r.codf].metros  += r.metros_actuales;
    map[r.codf].nrollos += 1;
    map[r.codf].rollos.push(r);
  }
  return Object.values(map).sort((a, b) =>
    a.descripcion.localeCompare(b.descripcion)
  );
}

function RolloRow({ rollo }) {
  const pct = rollo.metros_inicial > 0
    ? Math.round((rollo.metros_actuales / rollo.metros_inicial) * 100)
    : 0;
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-t border-gray-50">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
            {rollo.id_rollo}
          </span>
          <span className="text-sm text-gray-600 truncate">Est. {rollo.ubicacion}</span>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="font-semibold text-gray-900 text-sm">{rollo.metros_actuales.toFixed(1)} m</div>
        <div className={`text-xs font-medium ${
          pct > 50 ? 'text-emerald-600' : pct > 20 ? 'text-amber-500' : 'text-red-500'
        }`}>
          {pct}% restante
        </div>
      </div>
    </div>
  );
}

function ProductoCard({ producto, query }) {
  const [open, setOpen] = useState(false);

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
              {highlight(producto.descripcion)}
            </div>
            <div className="text-xs text-gray-400 font-mono mt-0.5">
              {highlight(producto.codf)}
            </div>
          </div>
          <span className={`text-gray-400 text-lg transition-transform flex-shrink-0 ${open ? 'rotate-90' : ''}`}>›</span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="bg-blue-50 rounded-lg p-2 text-center">
            <div className="font-bold text-blue-700 text-lg leading-tight">
              {producto.metros.toFixed(1)}
            </div>
            <div className="text-blue-500 text-xs">metros</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <div className="font-bold text-gray-700 text-lg leading-tight">{producto.nrollos}</div>
            <div className="text-gray-500 text-xs">rollos</div>
          </div>
        </div>
      </button>

      {open && (
        <div className="border-t border-gray-100">
          {producto.rollos.map(r => (
            <RolloRow key={r.id_rollo} rollo={r} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function MisRollosView() {
  const [productos, setProductos] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [query,     setQuery]     = useState('');

  const fetch_ = () => {
    setLoading(true);
    setError(null);
    getRollos(1)
      .then(data => { setProductos(adaptarRollos(data)); setLoading(false); })
      .catch(err  => { setError(err.message); setLoading(false); });
  };

  useEffect(fetch_, []);

  if (loading) return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 text-gray-400 py-20">
      <div className="w-8 h-8 border-2 border-blue-300 border-t-blue-700 rounded-full animate-spin" />
      <p className="text-sm">Cargando rollos…</p>
    </div>
  );

  if (error) return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 py-20 text-center">
      <span className="text-4xl">⚠️</span>
      <div>
        <p className="font-semibold text-gray-700 mb-1">No se pudo cargar el inventario</p>
        <p className="text-xs text-gray-400 font-mono break-all">{error}</p>
      </div>
      <button onClick={fetch_} className="btn-primary text-sm px-6">Reintentar</button>
    </div>
  );

  const filtrados = query.length >= 2
    ? productos.filter(p =>
        p.descripcion.toLowerCase().includes(query.toLowerCase()) ||
        p.codf.toLowerCase().startsWith(query.toLowerCase())
      )
    : productos;

  return (
    <div className="flex flex-col h-full">
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

      <div className="flex-1 overflow-y-auto px-4 pt-2 pb-24">
        {query.length >= 2 && (
          <p className="text-xs text-gray-400 mb-3">
            {filtrados.length} resultado{filtrados.length !== 1 ? 's' : ''} para "{query}"
          </p>
        )}
        {filtrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <span className="text-4xl mb-3">🔎</span>
            <p className="text-sm">Sin resultados</p>
          </div>
        ) : (
          filtrados.map(p => <ProductoCard key={p.codf} producto={p} query={query} />)
        )}
      </div>
    </div>
  );
}
