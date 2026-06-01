import { useState } from 'react';
import Modal from './Modal.jsx';
import {
  getPedido, getManguera, getRollo, getComplemento, getProducto,
  getRolloDisponible, getRollosElegibles, formatFecha,
} from './data/mockData.js';

// ────── helpers de presentación ──────

function sobrante(rolloId, metros) {
  const r = getRollo(rolloId);
  if (!r) return null;
  return getRolloDisponible(r) - metros;
}

function SobranteChip({ valor }) {
  if (valor === null) return null;
  const color = valor > 5 ? 'text-emerald-600' : valor > 1 ? 'text-amber-500' : 'text-red-500';
  return (
    <span className={`text-xs font-semibold ${color}`}>
      Sobrante: {valor.toFixed(2)} m
    </span>
  );
}

// ────── popup selector de rollo ──────

function CambiarRolloModal({ mangueraId, metros, rolloActual, onSelect, onClose }) {
  const manguera  = getManguera(mangueraId);
  const elegibles = getRollosElegibles(mangueraId, metros);

  return (
    <Modal title="Cambiar Rollo" onClose={onClose}>
      <div className="px-5 py-3 bg-blue-50 border-b border-blue-100">
        <p className="text-sm font-semibold text-blue-900">{manguera?.nombre}</p>
        <p className="text-xs text-blue-600 mt-0.5">Necesitas: <strong>{metros.toFixed(2)} m</strong></p>
      </div>

      {elegibles.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          <p className="text-3xl mb-2">⚠️</p>
          <p className="text-sm">No hay rollos con suficientes metros disponibles.</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {elegibles.map((r, idx) => {
            const disp   = getRolloDisponible(r);
            const sob    = disp - metros;
            const selec  = r.id === rolloActual;
            const suger  = idx === 0;
            return (
              <li key={r.id}>
                <button
                  onClick={() => { onSelect(r.id); onClose(); }}
                  className={`w-full text-left px-5 py-4 transition-colors flex items-start gap-3 ${
                    selec ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="mt-0.5 w-5 flex-shrink-0">
                    {selec ? (
                      <span className="text-blue-600 font-bold text-lg">✓</span>
                    ) : (
                      <span className="w-4 h-4 border-2 border-gray-300 rounded-full block mt-0.5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-sm font-bold text-blue-700">{r.id}</span>
                      {suger && (
                        <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">
                          ⭐ Sugerido
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Estante {r.ubicacion} · {formatFecha(r.fecha_ingreso)}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm font-semibold text-gray-800">{disp.toFixed(1)} m disp.</span>
                      <SobranteChip valor={sob} />
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Modal>
  );
}

// ────── sección ensamble ──────

function EnsambleCard({ ens, rolloId, onCambiarRollo, complementosCheck, onToggleComp }) {
  const manguera = getManguera(ens.manguera_id);
  const rollo    = getRollo(rolloId);
  const sob      = sobrante(rolloId, ens.metros);

  return (
    <div className="card mb-3 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
        <div className="font-semibold text-sm text-gray-900">{ens.nombre}</div>
      </div>

      {/* Manguera */}
      <div className="px-4 py-3">
        <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Manguera</div>
        <div className="font-medium text-gray-800 text-sm">{manguera?.nombre}</div>
        <div className="text-xs text-blue-600 font-mono mt-0.5">{ens.metros.toFixed(2)} m</div>

        {/* Rollo asignado */}
        <div className="mt-3 bg-blue-50 rounded-lg px-3 py-2.5 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-blue-700">{rolloId}</span>
              <span className="text-xs text-gray-500">· Est. {rollo?.ubicacion}</span>
            </div>
            <SobranteChip valor={sob} />
          </div>
          <button
            onClick={() => onCambiarRollo(ens.id, ens.manguera_id, ens.metros)}
            className="text-xs font-semibold text-blue-700 hover:text-blue-900 bg-white border border-blue-200 rounded-lg px-3 py-1.5 transition-colors whitespace-nowrap"
          >
            Cambiar
          </button>
        </div>
      </div>

      {/* Complementos */}
      {ens.complementos.length > 0 && (
        <div className="border-t border-gray-100 px-4 py-3">
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Complementos</div>
          <ul className="space-y-2">
            {ens.complementos.map((c, i) => {
              const comp = getComplemento(c.complemento_id);
              const key  = `${ens.id}-${i}`;
              return (
                <li key={key} className="flex items-center gap-3">
                  <button
                    onClick={() => onToggleComp(key)}
                    className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition-colors ${
                      complementosCheck[key]
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-gray-300'
                    }`}
                  >
                    {complementosCheck[key] && <span className="text-xs">✓</span>}
                  </button>
                  <span className={`text-sm flex-1 ${complementosCheck[key] ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                    {comp?.nombre}
                    {c.cantidad > 1 && (
                      <span className="ml-1 text-xs text-gray-400">× {c.cantidad}</span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

// ────── sección manguera suelta ──────

function MangueraSueltaCard({ ms, idx, rolloId, onCambiarRollo }) {
  const manguera = getManguera(ms.manguera_id);
  const rollo    = getRollo(rolloId);
  const sob      = sobrante(rolloId, ms.metros);

  return (
    <div className="card mb-3 px-4 py-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-medium text-gray-800 text-sm">{manguera?.nombre}</div>
          <div className="text-xs text-blue-600 font-mono mt-0.5">{ms.metros.toFixed(2)} m</div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs font-bold text-blue-700">{rolloId}</span>
            <span className="text-xs text-gray-400">Est. {rollo?.ubicacion}</span>
          </div>
          <SobranteChip valor={sob} />
        </div>
      </div>
      <button
        onClick={() => onCambiarRollo(`ms-${idx}`, ms.manguera_id, ms.metros)}
        className="mt-2 text-xs font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 border border-blue-100 rounded-lg px-3 py-1.5 transition-colors"
      >
        Cambiar rollo
      </button>
    </div>
  );
}

// ────── vista principal ──────

export default function DetallePedidoView({ pedidoId, onVolver }) {
  const pedido = getPedido(pedidoId);

  const [rollosAsignados, setRollosAsignados] = useState(() => {
    const init = {};
    pedido?.ensambles.forEach(e => { init[e.id] = e.rollo_asignado; });
    pedido?.mangueras_sueltas.forEach((ms, i) => { init[`ms-${i}`] = ms.rollo_asignado; });
    return init;
  });

  const [complementosCheck, setComplementosCheck] = useState(() => {
    const init = {};
    pedido?.ensambles.forEach(e => {
      e.complementos.forEach((c, i) => { init[`${e.id}-${i}`] = c.incluido; });
    });
    return init;
  });

  const [popup, setPopup] = useState(null); // { key, mangueraId, metros }

  if (!pedido) return null;

  const urgente = pedido.estado === 'urgente';

  const abrirPopup = (key, mangueraId, metros) =>
    setPopup({ key, mangueraId, metros });

  const seleccionarRollo = (key, nuevoRolloId) =>
    setRollosAsignados(prev => ({ ...prev, [key]: nuevoRolloId }));

  const toggleComp = key =>
    setComplementosCheck(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onVolver}
            className="text-blue-700 font-semibold text-sm hover:text-blue-900 flex items-center gap-1"
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
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-sm font-semibold text-gray-700">{pedido.hora}</div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-8">

        {/* Ensambles */}
        {pedido.ensambles.length > 0 && (
          <section className="mb-5">
            <SectionHeader
              label="Ensambles"
              count={pedido.ensambles.length}
              color="blue"
            />
            {pedido.ensambles.map(ens => (
              <EnsambleCard
                key={ens.id}
                ens={ens}
                rolloId={rollosAsignados[ens.id]}
                onCambiarRollo={abrirPopup}
                complementosCheck={complementosCheck}
                onToggleComp={toggleComp}
              />
            ))}
          </section>
        )}

        {/* Mangueras sueltas */}
        {pedido.mangueras_sueltas.length > 0 && (
          <section className="mb-5">
            <SectionHeader
              label="Mangueras Sueltas"
              count={pedido.mangueras_sueltas.length}
              color="violet"
            />
            {pedido.mangueras_sueltas.map((ms, i) => (
              <MangueraSueltaCard
                key={i}
                ms={ms}
                idx={i}
                rolloId={rollosAsignados[`ms-${i}`]}
                onCambiarRollo={abrirPopup}
              />
            ))}
          </section>
        )}

        {/* Productos sueltos */}
        {pedido.productos_sueltos.length > 0 && (
          <section>
            <SectionHeader
              label="Productos Sueltos"
              count={pedido.productos_sueltos.length}
              color="amber"
            />
            <div className="card divide-y divide-gray-100">
              {pedido.productos_sueltos.map((ps, i) => {
                const prod = getProducto(ps.producto_id);
                return (
                  <div key={i} className="flex items-center justify-between px-4 py-3">
                    <div>
                      <div className="text-sm font-medium text-gray-800">{prod?.nombre}</div>
                      <div className="text-xs text-gray-400 font-mono">{prod?.codigo}</div>
                    </div>
                    <span className="font-bold text-gray-700 bg-gray-100 rounded-lg px-3 py-1 text-sm">
                      × {ps.cantidad} <span className="text-gray-400 font-normal">{prod?.unidad}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* Popup */}
      {popup && (
        <CambiarRolloModal
          mangueraId={popup.mangueraId}
          metros={popup.metros}
          rolloActual={rollosAsignados[popup.key]}
          onSelect={id => seleccionarRollo(popup.key, id)}
          onClose={() => setPopup(null)}
        />
      )}
    </div>
  );
}

function SectionHeader({ label, count, color }) {
  const colors = {
    blue:   'text-blue-700 bg-blue-50 border-blue-100',
    violet: 'text-violet-700 bg-violet-50 border-violet-100',
    amber:  'text-amber-700 bg-amber-50 border-amber-100',
  };
  return (
    <div className={`flex items-center gap-2 mb-3 px-3 py-1.5 rounded-lg border ${colors[color]}`}>
      <span className="font-bold uppercase text-xs tracking-widest">{label}</span>
      <span className="font-bold text-xs ml-auto">{count}</span>
    </div>
  );
}
