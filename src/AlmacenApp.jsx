import { useState } from 'react';
import PedidosView     from './PedidosView.jsx';
import DetallePedidoView from './DetallePedidoView.jsx';
import MisRollosView   from './MisRollosView.jsx';
import IngresosView    from './IngresosView.jsx';

const TABS = [
  { id: 'pedidos',  label: 'Pedidos',   icon: '📋' },
  { id: 'rollos',   label: 'Mis Rollos',icon: '📦' },
  { id: 'ingresos', label: 'Ingresos',  icon: '📥' },
];

export default function AlmacenApp({ onLogout }) {
  const [tab, setTab]               = useState('pedidos');
  const [pedidoActual, setPedidoActual] = useState(null);

  const goDetalle = pedido => { setPedidoActual(pedido); };
  const goVolver  = ()     => { setPedidoActual(null); };

  const handleTab = t => { setPedidoActual(null); setTab(t); };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-navy-900 text-white px-4 py-3 flex items-center gap-3 shadow-lg flex-shrink-0">
        <div className="flex items-center gap-2 flex-1">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-0.5 flex-shrink-0">
            <img src="/logo-cisge.png" alt="CISGE" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="font-black text-lg tracking-tight">CISGE</span>
            <span className="text-blue-300 text-sm ml-2">Almacén</span>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="text-blue-300 hover:text-white text-sm transition-colors px-2 py-1 rounded"
        >
          Salir →
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {pedidoActual ? (
          <DetallePedidoView pedido={pedidoActual} onVolver={goVolver} />
        ) : tab === 'pedidos' ? (
          <PedidosView onDetalle={goDetalle} />
        ) : tab === 'rollos' ? (
          <MisRollosView />
        ) : (
          <IngresosView />
        )}
      </div>

      {/* Bottom Nav */}
      {!pedidoActual && (
        <nav className="bg-white border-t border-gray-200 flex safe-bottom flex-shrink-0 shadow-lg">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => handleTab(t.id)}
              className={`relative flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs transition-colors ${
                tab === t.id
                  ? 'text-blue-700 font-semibold'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab === t.id && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-blue-700 rounded-full" />
              )}
              <span className="text-xl leading-tight">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
