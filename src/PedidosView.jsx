import { useState, useEffect, useRef } from 'react';
import { getDocumentos } from './api.js';
import { minutosTranscurridos, formatMin } from './data/mockData.js';

// ── Helpers ───────────────────────────────────────────────────────────────────

const hoy = () => {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-');
};

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
    const fecha = g.fecreg
      ? new Date(g.fecreg).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' })
      : '--/--/----';

    return {
      id:           g.id,
      cliente:      g.cliente,
      vendedor:     g.vendedor,
      estado:       mins > 60 ? 'urgente' : 'pendiente',
      hora,
      fecha,
      timestamp:    ts,
      tiene_pedido: g.lineas.some(l => String(l.flag) === '1'),
      lineas:       g.lineas,
      nlineas:      g.lineas.length,
    };
  });
}

// ── Definición de columnas ────────────────────────────────────────────────────

const COLS = [
  { key: 'id',       label: 'N° Doc',   defW: 112, flex: false },
  { key: 'cliente',  label: 'Cliente',  defW: null, flex: true  },
  { key: 'vendedor', label: 'Vendedor', defW: 64,  flex: false },
  { key: 'fecha',    label: 'Fecha',    defW: 82,  flex: false },
  { key: 'hora',     label: 'Hora',     defW: 44,  flex: false },
  { key: 'nlineas',  label: 'Lín',      defW: 28,  flex: false },
];

const DEFAULT_WIDTHS = Object.fromEntries(
  COLS.filter(c => !c.flex).map(c => [c.key, c.defW])
);

// ── Icono de orden ────────────────────────────────────────────────────────────

function SortIcon({ active, dir }) {
  if (!active) return <span className="ml-0.5 text-gray-300 text-xs leading-none">↕</span>;
  return <span className="ml-0.5 text-blue-500 text-xs leading-none">{dir === 'asc' ? '↑' : '↓'}</span>;
}

// ── Encabezado ────────────────────────────────────────────────────────────────

function ListHeader({ colWidths, sortCol, sortDir, onSort, onResize }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b border-gray-200 select-none">
      {COLS.map(col => (
        <div
          key={col.key}
          className="relative flex items-center"
          style={col.flex ? { flex: 1, minWidth: 60 } : { width: colWidths[col.key], flexShrink: 0 }}
        >
          <button
            onClick={() => onSort(col.key)}
            className="flex items-center font-semibold text-xs text-gray-400 uppercase tracking-wide hover:text-gray-600 transition-colors truncate"
          >
            <span className="truncate">{col.label}</span>
            <SortIcon active={sortCol === col.key} dir={sortDir} />
          </button>

          {/* Handle de resize — solo en columnas de ancho fijo */}
          {!col.flex && (
            <div
              onMouseDown={e => onResize(col.key, e)}
              className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize group"
            >
              <div className="absolute inset-y-1 right-0 w-0.5 bg-transparent group-hover:bg-blue-300 transition-colors rounded-full" />
            </div>
          )}
        </div>
      ))}
      {/* Columna ✓ — sin resize ni sort */}
      <div style={{ width: 16, flexShrink: 0 }} />
    </div>
  );
}

// ── Fila ──────────────────────────────────────────────────────────────────────

function PedidoRow({ pedido, onClick, colWidths }) {
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
      <span
        className="font-mono text-xs text-blue-700 truncate flex-shrink-0"
        style={{ width: colWidths.id }}
      >
        {pedido.id}
      </span>

      <span className="text-xs text-gray-800 truncate flex-1 min-w-0">
        {pedido.cliente}
      </span>

      <span
        className="text-xs text-gray-500 truncate flex-shrink-0"
        style={{ width: colWidths.vendedor }}
      >
        {pedido.vendedor}
      </span>

      <span
        className="text-xs text-gray-400 tabular-nums text-right flex-shrink-0"
        style={{ width: colWidths.fecha }}
      >
        {pedido.fecha}
      </span>

      <span
        className="text-xs text-gray-400 tabular-nums text-right flex-shrink-0"
        style={{ width: colWidths.hora }}
      >
        {pedido.hora}
      </span>

      <span
        className="text-xs font-semibold text-gray-500 tabular-nums text-right flex-shrink-0"
        style={{ width: colWidths.nlineas }}
      >
        {pedido.nlineas}
      </span>

      <span style={{ width: 16, flexShrink: 0 }} className="text-center text-xs">
        {pedido.tiene_pedido && <span className="text-emerald-600 font-bold">✓</span>}
      </span>
    </button>
  );
}

// ── Tabla de sección ──────────────────────────────────────────────────────────

function SeccionTabla({ titulo, count, colorTitulo, colorCount, filas, onDetalle, colWidths, sortCol, sortDir, onSort, onResize }) {
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
        <ListHeader
          colWidths={colWidths}
          sortCol={sortCol}
          sortDir={sortDir}
          onSort={onSort}
          onResize={onResize}
        />
        <div className="divide-y divide-gray-100">
          {filas.map(p => (
            <PedidoRow key={p.id} pedido={p} onClick={onDetalle} colWidths={colWidths} />
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
  const [pedidos,   setPedidos]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [filtro,    setFiltro]    = useState('mangueras');
  const [fecha,     setFecha]     = useState(hoy);
  const [colWidths, setColWidths] = useState(DEFAULT_WIDTHS);
  const [sortCol,   setSortCol]   = useState(null);
  const [sortDir,   setSortDir]   = useState('asc');
  const dragRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getDocumentos(1, fecha)
      .then(data => { setPedidos(adaptarDocumentos(data)); setLoading(false); })
      .catch(err  => { setError(err.message); setLoading(false); });
  }, [fecha]);

  // Ordenamiento
  const handleSort = col => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
  };

  // Resize de columna
  const handleResize = (col, e) => {
    e.preventDefault();
    dragRef.current = { col, startX: e.clientX, startW: colWidths[col] };

    const onMove = e => {
      const { col, startX, startW } = dragRef.current;
      const newW = Math.max(40, startW + e.clientX - startX);
      setColWidths(prev => ({ ...prev, [col]: newW }));
    };
    const onUp = () => {
      dragRef.current = null;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

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

  const filtrados = filtro === 'mangueras' ? pedidos.filter(esManguera) : pedidos;

  // Aplicar ordenamiento
  const sorted = sortCol
    ? [...filtrados].sort((a, b) => {
        const va = a[sortCol] ?? '';
        const vb = b[sortCol] ?? '';
        const cmp = typeof va === 'number'
          ? va - vb
          : String(va).localeCompare(String(vb), 'es');
        return sortDir === 'asc' ? cmp : -cmp;
      })
    : filtrados;

  const urgentes   = sorted.filter(p => p.estado === 'urgente');
  const pendientes = sorted.filter(p => p.estado === 'pendiente');

  const tableProps = { colWidths, sortCol, sortDir, onSort: handleSort, onResize: handleResize };

  return (
    <div className="flex-1 overflow-y-auto px-3 pt-3 pb-24">

      {/* Filtros + selector de fecha */}
      <div className="flex items-center gap-2 mb-3">
        {FILTROS.map(f => (
          <button
            key={f.id}
            onClick={() => setFiltro(f.id)}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors flex-shrink-0 ${
              filtro === f.id
                ? 'bg-blue-700 border-blue-700 text-white'
                : 'bg-white border-gray-200 text-gray-500 hover:border-blue-400 hover:text-blue-600'
            }`}
          >
            {f.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1.5 flex-shrink-0">
          {fecha !== hoy() && (
            <button
              onClick={() => setFecha(hoy())}
              className="px-2 py-1 rounded-lg text-xs font-semibold bg-blue-700 text-white hover:bg-blue-800 transition-colors"
            >
              Hoy
            </button>
          )}
          <input
            type="date"
            value={fecha}
            max={hoy()}
            onChange={e => setFecha(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-2 py-1 text-gray-600 bg-white focus:outline-none focus:border-blue-400"
          />
        </div>
      </div>

      <SeccionTabla
        titulo="🔴 Urgentes"
        count={urgentes.length}
        colorTitulo="text-red-600"
        colorCount="bg-red-100 text-red-600"
        filas={urgentes}
        onDetalle={onDetalle}
        {...tableProps}
      />

      <SeccionTabla
        titulo="Pendientes"
        count={pendientes.length}
        colorTitulo="text-gray-500"
        colorCount="bg-gray-100 text-gray-500"
        filas={pendientes}
        onDetalle={onDetalle}
        {...tableProps}
      />
    </div>
  );
}
