import { useState, useEffect } from 'react';
import { getRollos, putRollo } from './api.js';
import Modal from './Modal.jsx';

const ESTADOS = ['disponible', 'retazo', 'agotado'];

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

// ── Modal de edición ──────────────────────────────────────────────────────────

function EditModal({ rollo, onClose, onSaved }) {
  const tieneCortes = rollo.metros_actuales < rollo.metros_inicial;

  const [ubicacion,    setUbicacion]    = useState(rollo.ubicacion    ?? '');
  const [referencia,   setReferencia]   = useState(rollo.referencia   ?? '');
  const [metros,       setMetros]       = useState(String(rollo.metros_inicial));
  const [estado,       setEstado]       = useState(rollo.estado       ?? 'disponible');
  const [saving,       setSaving]       = useState(false);
  const [error,        setError]        = useState(null);

  const handleGuardar = async () => {
    setSaving(true);
    setError(null);
    try {
      await putRollo(rollo.id_rollo, {
        ubicacion:     ubicacion.trim()   || null,
        referencia:    referencia.trim()  || null,
        metros_inicial: tieneCortes ? undefined : parseFloat(metros) || rollo.metros_inicial,
        estado,
      });
      onSaved();
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <Modal title={`Editar rollo ${rollo.id_rollo}`} onClose={onClose}>
      <div className="px-5 py-4 flex flex-col gap-4">

        {tieneCortes && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700">
            Este rollo ya tiene movimientos. Los metros iniciales no se pueden modificar.
          </div>
        )}

        <div>
          <label className="block text-xs text-gray-500 font-medium mb-1">Metros iniciales</label>
          {tieneCortes ? (
            <div className="input bg-gray-50 text-gray-400 cursor-not-allowed">
              {rollo.metros_inicial.toFixed(2)} m
            </div>
          ) : (
            <input
              type="number"
              inputMode="decimal"
              className="input"
              value={metros}
              onChange={e => setMetros(e.target.value)}
              min="0.1"
              step="0.1"
            />
          )}
        </div>

        <div>
          <label className="block text-xs text-gray-500 font-medium mb-1">Ubicación</label>
          <input
            className="input"
            placeholder="Ej. A-3"
            value={ubicacion}
            onChange={e => setUbicacion(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 font-medium mb-1">Referencia</label>
          <input
            className="input"
            placeholder="Ej. OC-2025-001"
            value={referencia}
            onChange={e => setReferencia(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 font-medium mb-1">Estado</label>
          <select
            className="input"
            value={estado}
            onChange={e => setEstado(e.target.value)}
          >
            {ESTADOS.map(e => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>

        {error && (
          <p className="text-xs text-red-500 font-mono break-all">{error}</p>
        )}

        <div className="flex gap-3 pt-1 pb-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 font-medium hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-blue-700 text-white text-sm font-semibold disabled:opacity-60"
          >
            {saving ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ── Fila de rollo ─────────────────────────────────────────────────────────────

function RolloRow({ rollo, onEdit }) {
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
          <span className="text-sm text-gray-600 truncate">
            {rollo.ubicacion ? `Est. ${rollo.ubicacion}` : <span className="text-gray-300">Sin ubicación</span>}
          </span>
        </div>
        {rollo.referencia && (
          <div className="text-xs text-gray-400 mt-0.5 ml-0.5">{rollo.referencia}</div>
        )}
      </div>
      <div className="text-right flex-shrink-0">
        <div className="font-semibold text-gray-900 text-sm">{rollo.metros_actuales.toFixed(1)} m</div>
        <div className={`text-xs font-medium ${
          pct > 50 ? 'text-emerald-600' : pct > 20 ? 'text-amber-500' : 'text-red-500'
        }`}>
          {pct}% restante
        </div>
      </div>
      <button
        onClick={() => onEdit(rollo)}
        className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
        title="Editar rollo"
      >
        ✏️
      </button>
    </div>
  );
}

// ── Tarjeta de producto ───────────────────────────────────────────────────────

function ProductoCard({ producto, query, onEdit }) {
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
            <RolloRow key={r.id_rollo} rollo={r} onEdit={onEdit} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Vista principal ───────────────────────────────────────────────────────────

export default function MisRollosView() {
  const [productos,      setProductos]      = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState(null);
  const [query,          setQuery]          = useState('');
  const [rolloEditando,  setRolloEditando]  = useState(null);

  const fetch_ = () => {
    setLoading(true);
    setError(null);
    getRollos(1)
      .then(data => { setProductos(adaptarRollos(data)); setLoading(false); })
      .catch(err  => { setError(err.message); setLoading(false); });
  };

  useEffect(fetch_, []);

  const handleSaved = () => {
    setRolloEditando(null);
    fetch_();
  };

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
      {rolloEditando && (
        <EditModal
          rollo={rolloEditando}
          onClose={() => setRolloEditando(null)}
          onSaved={handleSaved}
        />
      )}

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
          filtrados.map(p => (
            <ProductoCard
              key={p.codf}
              producto={p}
              query={query}
              onEdit={setRolloEditando}
            />
          ))
        )}
      </div>
    </div>
  );
}
