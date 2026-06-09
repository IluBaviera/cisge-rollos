import { useState, useEffect } from 'react';
import { getDocumentos } from './api.js';
import { minutosTranscurridos, formatMin } from './data/mockData.js';

function adaptarDocumentos({ cotizaciones = [], pedidos = [] }) {
  const todos = [...cotizaciones, ...pedidos].filter(item => item.flag !== '*');

  const grupos = {};
  todos.forEach(item => {
    if (!grupos[item.ndocu]) {
      grupos[item.ndocu] = {
        id:       item.ndocu,
        cliente:  item.nomcli,
        vendedor: item.nomven,
        fecreg:   item.fecreg,
        lineas:   [],
      };
    }
    grupos[item.ndocu].lineas.push(item);
  });

  const ahora = Date.now();

  return Object.values(grupos).map(g => {
    const ts   = g.fecreg ? new Date(g.fecreg).getTime() : ahora;
    const mins = Math.floor((ahora - ts) / 60000);
    const hora = g.fecreg
      ? new Date(g.fecreg).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
      : '--:--';

    return {
      id:           g.id,
      cliente:      g.cliente,
      vendedor:     g.vendedor,
      estado:       mins > 60 ? 'urgente' : 'pendiente',
      hora,
      timestamp:    ts,
      tiene_pedido: g.lineas.some(l => String(l.flag) === '1'),
      lineas:       g.lineas,
      nlineas:      g.lineas.length,
    };
  });
}

// ── Encabezado de columnas ────────────────────────────────────────────────────

function ListHeader() {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b border-gray-200">
      <span className="font-semibold text-xs text-gray-400 uppercase tracking-wide w-28 flex-shrink-0">
        N° Doc
      </span>
      <span className="font-semibold text-xs text-gray-400 uppercase tracking-wide flex-1">
        Cliente
      </span>
      <span className="font-semibold text-xs text-gray-400 uppercase tracking-wide w-20 flex-shrink-0">
        Vendedor
      </span>
      <span className="font-semibold text-xs text-gray-400 uppercase tracking-wide w-11 text-right flex-shrink-0">
        Hora
      </span>
      <span className="font-semibold text-xs text-gray-400 uppercase tracking-wide w-7 text-right flex-shrink-0">
        Lín
      </span>
      <span className="w-4 flex-shrink-0" />
    </div>
  );
}

// ── Fila compacta ─────────────────────────────────────────────────────────────

function PedidoRow({ pedido, onClick }) {
  const urgente     = pedido.estado === 'urgente';
  const borderColor = urgente
    ? 'border-l-red-500'
    : pedido.tiene_pedido ? 'border-l-emerald-500'
    : 'border-l-gray-200';

  return (
    <button
      onClick={() => onClick(pedido)}
      className={`w-full text-left flex items-center gap-2 px-3 py-2.5 border-l-4 hover:bg-blue-50 active:bg-blue-100 transition-colors ${borderColor}`}
    >
      <span className="font-mono text-xs text-blue-700 w-28 flex-shrink-0 truncate">
        {pedido.id}
      </span>
      <span className="text-xs text-gray-800 flex-1 truncate">
        {pedido.cliente}
      </span>
      <span className="text-xs text-gray-500 w-20 flex-shrink-0 truncate">
        {pedido.vendedor}
      </span>
      <span className="text-xs text-gray-400 w-11 text-right flex-shrink-0 tabular-nums">
        {pedido.hora}
      </span>
      <span className="text-xs font-semibold text-gray-500 w-7 text-right flex-shrink-0 tabular-nums">
        {pedido.nlineas}
      </span>
      <span className="w-4 flex-shrink-0 text-center text-xs">
        {pedido.tiene_pedido && <span className="text-emerald-600 font-bold">✓</span>}
      </span>
    </button>
  );
}

// ── Tabla de sección ──────────────────────────────────────────────────────────

function SeccionTabla({ titulo, count, colorTitulo, colorCount, filas, onDetalle }) {
  if (!filas.length) return null;
  return (
    <section className="mb-4">
      <div className="flex items-center gap-2 mb-2 px-1">
        <span className={`font-bold text-xs uppercase tracking-widest ${colorTitulo}`}>
          {titulo}
        </span>
        <span className={`text-xs font-bold rounded-full px-2 py-0.5 ${colorCount}`}>
          {count}
        </span>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <ListHeader />
        <div className="divide-y divide-gray-100">
          {filas.map(p => (
            <PedidoRow key={p.id} pedido={p} onClick={onDetalle} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Vista principal ───────────────────────────────────────────────────────────

const FILTROS = [
  { id: 'mangueras', label: 'Mangueras' },
  { id: 'todo',      label: 'Todo' },
];

export default function PedidosView({ onDetalle }) {
  const [pedidos,  setPedidos]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [filtro,   setFiltro]   = useState('mangueras');

  useEffect(() => {
    getDocumentos(1)
      .then(data => { setPedidos(adaptarDocumentos(data)); setLoading(false); })
      .catch(err  => { setError(err.message); setLoading(false); });
  }, []);

  if (loading) return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 text-gray-400 py-20">
      <div className="w-8 h-8 border-2 border-blue-300 border-t-blue-700 rounded-full animate-spin" />
      <p className="text-sm">Cargando cotizaciones…</p>
    </div>
  );

  if (error) return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 py-20 text-center">
      <span className="text-4xl">⚠️</span>
      <div>
        <p className="font-semibold text-gray-700 mb-1">No se pudieron cargar las cotizaciones</p>
        <p className="text-xs text-gray-400 font-mono break-all">{error}</p>
      </div>
    </div>
  );

  if (pedidos.length === 0) return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 text-gray-400 py-20">
      <span className="text-4xl">📋</span>
      <p className="text-sm">Sin cotizaciones</p>
    </div>
  );

  const esManguera = p => p.lineas?.some(l =>
    l.subfamilia?.toUpperCase().includes('MANGUERA')
  );

  const filtrados  = filtro === 'mangueras' ? pedidos.filter(esManguera) : pedidos;
  const urgentes   = filtrados.filter(p => p.estado === 'urgente');
  const pendientes = filtrados.filter(p => p.estado === 'pendiente');

  return (
    <div className="flex-1 overflow-y-auto px-3 pt-3 pb-24">

      {/* Filtros */}
      <div className="flex items-center gap-2 mb-3">
        {FILTROS.map(f => (
          <button
            key={f.id}
            onClick={() => setFiltro(f.id)}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
              filtro === f.id
                ? 'bg-blue-700 border-blue-700 text-white'
                : 'bg-white border-gray-200 text-gray-500 hover:border-blue-400 hover:text-blue-600'
            }`}
          >
            {f.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-400">
          {filtrados.length} cotizaciones
        </span>
      </div>

      <SeccionTabla
        titulo="🔴 Urgentes"
        count={urgentes.length}
        colorTitulo="text-red-600"
        colorCount="bg-red-100 text-red-600"
        filas={urgentes}
        onDetalle={onDetalle}
      />

      <SeccionTabla
        titulo="Pendientes"
        count={pendientes.length}
        colorTitulo="text-gray-500"
        colorCount="bg-gray-100 text-gray-500"
        filas={pendientes}
        onDetalle={onDetalle}
      />
    </div>
  );
}
