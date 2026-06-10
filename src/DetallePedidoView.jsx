import { useState, useEffect } from 'react';
import { getSugerencia } from './api.js';

// Metros a pedir: pedidos[] usa cant_pedida, cotizaciones[] usa cant
const getMetros = linea => linea.cant_pedida ?? linea.cant ?? 0;

const esManguera = linea =>
  linea.subfamilia?.toUpperCase().startsWith('MANGUERA');

// ── Sección de rollo sugerido — solo se monta para mangueras ─────────────────

function SugerenciaSection({ codf, metros, almacen_id }) {
  const [sug,     setSug]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    getSugerencia(codf, metros, almacen_id)
      .then(data => { setSug(data);          setLoading(false); })
      .catch(err  => { setError(err.message); setLoading(false); });
  }, []);

  return (
    <div className="border-t border-gray-100 bg-gray-50 px-4 py-2.5">
      <div className="text-xs text-gray-400 font-medium mb-1.5">Rollo sugerido</div>

      {loading && (
        <div className="flex items-center gap-2 text-gray-400">
          <div className="w-3 h-3 border border-blue-300 border-t-blue-600 rounded-full animate-spin flex-shrink-0" />
          <span className="text-xs">Buscando…</span>
        </div>
      )}

      {!loading && error && (
        <span className="text-xs text-red-400">Sin sugerencia disponible</span>
      )}

      {!loading && sug && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
            {sug.id_rollo}
          </span>
          {sug.ubicacion && (
            <span className="text-xs text-gray-500">Est. {sug.ubicacion}</span>
          )}
          {sug.metros_actuales != null && (() => {
            const sob = sug.metros_actuales - metros;
            return (
              <span className={`text-xs font-semibold ml-auto ${
                sob > 5 ? 'text-emerald-600' : sob > 1 ? 'text-amber-500' : 'text-red-500'
              }`}>
                Sobrante: {sob.toFixed(2)} m
              </span>
            );
          })()}
        </div>
      )}
    </div>
  );
}

// ── Línea de pedido ───────────────────────────────────────────────────────────

function LineaRow({ linea, almacen_id }) {
  const metros = getMetros(linea);

  return (
    <div className="card mb-3 overflow-hidden">
      {/* Producto */}
      <div className="px-4 py-3 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm text-gray-900 leading-tight">{linea.descr}</div>
          <div className="text-xs font-mono text-gray-400 mt-0.5">{linea.codf}</div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="font-bold text-blue-700 text-sm">{metros}</div>
          <div className="text-xs text-gray-400">{linea.umed}</div>
          {linea.cant_despachada > 0 && (
            <div className="text-xs text-emerald-600 font-medium mt-0.5">
              {linea.cant_despachada} despachado
            </div>
          )}
        </div>
      </div>

      {/* Rollo sugerido — solo para mangueras */}
      {esManguera(linea) && (
        <SugerenciaSection codf={linea.codf} metros={metros} almacen_id={almacen_id} />
      )}
    </div>
  );
}

// ── Vista de detalle ──────────────────────────────────────────────────────────

export default function DetallePedidoView({ pedido, onVolver }) {
  if (!pedido) return null;

  const urgente = pedido.estado === 'urgente';
  const fecha   = pedido.timestamp
    ? new Date(pedido.timestamp).toLocaleDateString('es-PE', {
        day: '2-digit', month: '2-digit', year: 'numeric',
      })
    : '--';

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0">
        <div className="flex items-start gap-3">
          <button
            onClick={onVolver}
            className="text-blue-700 font-semibold text-sm hover:text-blue-900 mt-0.5"
          >
            ‹ Volver
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs text-gray-400">{pedido.id}</span>
              <span className={urgente ? 'badge-urgente' : 'badge-pendiente'}>
                {urgente ? '🔴 Urgente' : 'Pendiente'}
              </span>
            </div>
            <div className="font-bold text-gray-900 text-sm truncate">{pedido.cliente}</div>
            <div className="text-xs text-gray-400 mt-0.5">{fecha} · {pedido.hora}</div>
          </div>
        </div>
      </div>

      {/* Lista de líneas */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-8">
        {!pedido.lineas?.length ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <span className="text-3xl mb-2">📋</span>
            <p className="text-sm">Sin líneas en este pedido</p>
          </div>
        ) : (
          <>
            <div className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-3">
              {pedido.lineas.length} línea{pedido.lineas.length !== 1 ? 's' : ''}
            </div>
            {pedido.lineas.map((linea, i) => (
              <LineaRow
                key={`${linea.codf}-${i}`}
                linea={linea}
                almacen_id={1}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
