import { useState, useEffect, useCallback } from 'react';
import { getSugerencia, postMovimiento } from './api.js';
import Modal from './Modal.jsx';

const getMetros = linea => linea.cant_pedida ?? linea.cant ?? 0;

const TIPOS_ROSCA = ['NPT', 'NPTF', 'BSP', 'JIC', 'ORFS', 'SAE', 'UNF', 'UNC'];

const contarRoscas = desc => {
  const d = (desc ?? '').toUpperCase();
  return TIPOS_ROSCA.reduce((sum, t) => {
    const m = d.match(new RegExp(t, 'g'));
    return sum + (m ? m.length : 0);
  }, 0);
};

const esManguera = linea => {
  if (!linea.subfamilia?.toUpperCase().startsWith('MANGUERA')) return false;
  return contarRoscas(linea.descr) < 2;
};

// ── Sección de rollo sugerido — solo se monta para mangueras ─────────────────

function SugerenciaSection({ codf, metros, almacen_id, onChange }) {
  const [data,         setData]         = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [seleccionado, setSeleccionado] = useState(null);
  const [sobrante,     setSobrante]     = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    getSugerencia(codf, metros, almacen_id)
      .then(d => {
        setData(d);
        const sug = d.sugerido;
        setSeleccionado(sug?.id_rollo ?? null);
        setSobrante(sug ? (sug.metros_actuales - metros).toFixed(1) : '');
        setLoading(false);
      })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  const rolloActivo = data?.todos?.find(r => r.id_rollo === seleccionado) ?? data?.sugerido;

  // Notificar al padre cada vez que cambie la selección o el sobrante editado
  useEffect(() => {
    if (!seleccionado || !rolloActivo) return;
    const sob = parseFloat(sobrante);
    const metros_cortar = isNaN(sob) ? 0 : rolloActivo.metros_actuales - sob;
    onChange?.({ id_rollo: seleccionado, metros_cortar, metros_actuales: rolloActivo.metros_actuales });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seleccionado, sobrante, data]);

  const handleSelect = rollo => {
    setSeleccionado(rollo.id_rollo);
    setSobrante((rollo.metros_actuales - metros).toFixed(1));
    setModalAbierto(false);
  };

  const sobranteNum = parseFloat(sobrante);
  const sobColor = isNaN(sobranteNum)
    ? 'text-gray-400'
    : sobranteNum > 5 ? 'text-emerald-600' : sobranteNum >= 0 ? 'text-amber-500' : 'text-red-500';

  return (
    <div className="border-t border-gray-100 bg-gray-50 px-4 py-3">
      <div className="text-xs text-gray-400 font-medium mb-2">Rollo sugerido</div>

      {loading && (
        <div className="flex items-center gap-2 text-gray-400">
          <div className="w-3 h-3 border border-blue-300 border-t-blue-600 rounded-full animate-spin flex-shrink-0" />
          <span className="text-xs">Buscando rollos…</span>
        </div>
      )}

      {!loading && error && (
        <span className="text-xs text-red-400">Sin stock disponible para este producto</span>
      )}

      {!loading && rolloActivo && (
        <div className="flex items-center gap-2 flex-wrap">

          {/* ID + ubicación */}
          <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-lg flex-shrink-0">
            {rolloActivo.id_rollo}
          </span>
          {rolloActivo.ubicacion && (
            <span className="text-xs text-gray-500 flex-shrink-0">Est. {rolloActivo.ubicacion}</span>
          )}
          <span className="text-xs text-gray-300 flex-shrink-0">{rolloActivo.metros_actuales.toFixed(1)} m</span>

          {/* Sobrante editable */}
          <div className="flex items-center gap-1 ml-auto flex-shrink-0">
            <span className="text-xs text-gray-400">Sobrante</span>
            <input
              type="number"
              value={sobrante}
              onChange={e => setSobrante(e.target.value)}
              className={`w-16 text-xs text-right border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-blue-400 bg-white font-semibold ${sobColor}`}
              step="0.1"
            />
            <span className="text-xs text-gray-400">m</span>
          </div>

          {/* Botón otros rollos */}
          {data?.todos?.length > 1 && (
            <button
              onClick={() => setModalAbierto(true)}
              className="text-xs px-2.5 py-1 rounded-lg border border-gray-200 text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors flex-shrink-0"
            >
              Otros rollos
            </button>
          )}
        </div>
      )}

      {/* Modal selección de rollo */}
      {modalAbierto && (
        <Modal title="Seleccionar rollo" onClose={() => setModalAbierto(false)}>
          <div className="px-4 py-3 flex flex-col gap-2 max-h-80 overflow-y-auto">
            {data.todos.map(r => {
              const sob = r.metros_actuales - metros;
              const activo = r.id_rollo === seleccionado;
              return (
                <button
                  key={r.id_rollo}
                  onClick={() => handleSelect(r)}
                  className={`text-left flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all ${
                    activo ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <span className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${
                    activo ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700'
                  }`}>
                    {r.id_rollo}
                  </span>
                  {r.ubicacion && (
                    <span className="text-xs text-gray-500 flex-shrink-0">Est. {r.ubicacion}</span>
                  )}
                  <span className="text-xs text-gray-400 flex-shrink-0">{r.metros_actuales.toFixed(1)} m</span>
                  <span className={`text-xs font-semibold ml-auto flex-shrink-0 ${
                    sob >= 0 ? sob > 5 ? 'text-emerald-600' : 'text-amber-500' : 'text-red-500'
                  }`}>
                    {sob >= 0 ? `+${sob.toFixed(1)}` : sob.toFixed(1)} m
                  </span>
                </button>
              );
            })}
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Línea de pedido ───────────────────────────────────────────────────────────

function LineaRow({ linea, almacen_id, onSugerenciaChange }) {
  const metros = getMetros(linea);

  return (
    <div className="card mb-3 overflow-hidden">
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

      {esManguera(linea) && (
        <SugerenciaSection
          codf={linea.codf}
          metros={metros}
          almacen_id={almacen_id}
          onChange={onSugerenciaChange}
        />
      )}
    </div>
  );
}

// ── Vista de detalle ──────────────────────────────────────────────────────────

export default function DetallePedidoView({ pedido, onVolver }) {
  const [sugerencias,   setSugerencias]   = useState({});
  const [guardando,     setGuardando]     = useState(false);
  const [guardadoError, setGuardadoError] = useState(null);
  const [guardadoOk,    setGuardadoOk]    = useState(false);

  if (!pedido) return null;

  const urgente = pedido.estado === 'urgente';
  const fecha   = pedido.timestamp
    ? new Date(pedido.timestamp).toLocaleDateString('es-PE', {
        day: '2-digit', month: '2-digit', year: 'numeric',
      })
    : '--';

  const lineasManguera = pedido.lineas?.filter(esManguera) ?? [];

  const handleSugerenciaChange = useCallback((key, data) => {
    setSugerencias(prev => ({ ...prev, [key]: data }));
  }, []);

  const handleGuardar = async () => {
    setGuardando(true);
    setGuardadoError(null);
    setGuardadoOk(false);
    const pedido_erp = String(pedido.ndocu_pedido ?? pedido.id ?? '');
    try {
      for (const s of Object.values(sugerencias)) {
        if (!s.id_rollo || s.metros_cortar <= 0) continue;
        await postMovimiento({
          id_rollo:   s.id_rollo,
          metros:     parseFloat(s.metros_cortar.toFixed(3)),
          pedido_erp,
          usuario:    'almacen',
        });
      }
      setGuardadoOk(true);
    } catch (err) {
      setGuardadoError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const hayMovimientos = Object.values(sugerencias).some(s => s.id_rollo && s.metros_cortar > 0);

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
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
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
                onSugerenciaChange={data => handleSugerenciaChange(`${linea.codf}-${i}`, data)}
              />
            ))}
          </>
        )}

        {/* Botón guardar — solo si hay mangueras */}
        {lineasManguera.length > 0 && (
          <div className="mt-2 pb-6">
            {guardadoOk && (
              <p className="text-emerald-600 text-xs text-center mb-2 font-medium">
                Movimientos registrados correctamente
              </p>
            )}
            {guardadoError && (
              <p className="text-red-500 text-xs text-center mb-2 break-all">{guardadoError}</p>
            )}
            <button
              onClick={handleGuardar}
              disabled={guardando || !hayMovimientos}
              className="w-full py-3 rounded-xl bg-blue-700 text-white text-sm font-semibold disabled:opacity-40 transition-opacity"
            >
              {guardando ? 'Guardando…' : 'Guardar cortes de rollo'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
