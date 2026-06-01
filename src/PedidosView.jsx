import { pedidos, minutosTranscurridos, formatMin } from './data/mockData.js';

function ItemBadge({ count, label }) {
  if (!count) return null;
  return (
    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs rounded-full px-2 py-0.5">
      <span className="font-semibold">{count}</span> {label}
    </span>
  );
}

function PedidoCard({ pedido, onClick }) {
  const mins  = minutosTranscurridos(pedido.timestamp);
  const urgente = pedido.estado === 'urgente';
  const { ensambles, mangueras_sueltas, productos_sueltos } = pedido.items_resumen;

  return (
    <button
      onClick={() => onClick(pedido.id)}
      className={`card w-full text-left p-4 border-l-4 transition-all active:scale-[0.98] ${
        urgente ? 'border-l-red-500' : 'border-l-gray-300'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={urgente ? 'badge-urgente' : 'badge-pendiente'}>
              {urgente ? '🔴 Urgente' : '⚪ Pendiente'}
            </span>
            <span className="font-mono text-xs text-gray-400">{pedido.id}</span>
          </div>
          <div className="font-semibold text-gray-900 mt-1 truncate">{pedido.cliente}</div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-sm font-semibold text-gray-700">{pedido.hora}</div>
          <div className={`text-xs ${urgente ? 'text-red-500 font-semibold' : 'text-gray-400'}`}>
            hace {formatMin(mins)}
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <ItemBadge count={ensambles} label="ensambles" />
        <ItemBadge count={mangueras_sueltas} label="mangueras sueltas" />
        <ItemBadge count={productos_sueltos} label="productos sueltos" />
      </div>
    </button>
  );
}

export default function PedidosView({ onDetalle }) {
  const urgentes  = pedidos.filter(p => p.estado === 'urgente');
  const pendientes = pedidos.filter(p => p.estado === 'pendiente');

  return (
    <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24">
      {urgentes.length > 0 && (
        <section className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="font-bold text-red-600 uppercase text-xs tracking-widest">
              🔴 Urgentes
            </h2>
            <span className="bg-red-100 text-red-600 text-xs font-bold rounded-full px-2 py-0.5">
              {urgentes.length}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {urgentes.map(p => (
              <PedidoCard key={p.id} pedido={p} onClick={onDetalle} />
            ))}
          </div>
        </section>
      )}

      {pendientes.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="font-bold text-gray-500 uppercase text-xs tracking-widest">
              Pendientes
            </h2>
            <span className="bg-gray-100 text-gray-500 text-xs font-bold rounded-full px-2 py-0.5">
              {pendientes.length}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {pendientes.map(p => (
              <PedidoCard key={p.id} pedido={p} onClick={onDetalle} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
