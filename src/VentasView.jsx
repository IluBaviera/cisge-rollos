import { useState, useEffect } from 'react';
import { getStock } from './api.js';
import HoseInventory from './HoseInventory.jsx';

function adaptarStock(response) {
  const map = {};
  for (const p of (response.productos ?? [])) {
    if (!p.subfamilia?.toUpperCase().startsWith('MANGUERA')) continue;
    const metros = Object.values(p.almacenes ?? {}).reduce((s, v) => s + v, 0);
    if (map[p.codigo]) {
      map[p.codigo].metros_disponibles += metros;
    } else {
      map[p.codigo] = {
        id:                 p.codigo,
        nombre:             p.descripcion,
        marca:              p.marca,
        categoria:          p.subfamilia,
        metros_disponibles: metros,
      };
    }
  }
  return Object.values(map);
}

export default function VentasView({ onLogout }) {
  const [productos, setProductos] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  const fetch_ = () => {
    setLoading(true);
    setError(null);
    getStock()
      .then(data => {
        const adapted = adaptarStock(data);
        console.log(adapted.slice(0, 5));
        setProductos(adapted);
        setLoading(false);
      })
      .catch(err  => { setError(err.message); setLoading(false); });
  };

  useEffect(fetch_, []);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-navy-900 text-white px-4 py-3 flex items-center gap-3 shadow-lg flex-shrink-0">
        <div className="flex items-center gap-2 flex-1">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-0.5 flex-shrink-0">
            <img src="/logo-cisge.png" alt="CISGE" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="font-black text-lg tracking-tight">CISGE</span>
            <span className="text-blue-300 text-sm ml-2">Ventas</span>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="text-blue-300 hover:text-white text-sm transition-colors px-2 py-1 rounded"
        >
          Salir →
        </button>
      </header>

      <div className="flex-1 overflow-hidden">
        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 text-gray-400 h-full">
            <div className="w-8 h-8 border-2 border-blue-300 border-t-blue-700 rounded-full animate-spin" />
            <p className="text-sm">Cargando inventario…</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center gap-4 px-8 h-full text-center">
            <span className="text-4xl">⚠️</span>
            <div>
              <p className="font-semibold text-gray-700 mb-1">No se pudo cargar el inventario</p>
              <p className="text-xs text-gray-400 font-mono break-all">{error}</p>
            </div>
            <button onClick={fetch_} className="btn-primary text-sm px-6">
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && <HoseInventory productos={productos} />}
      </div>
    </div>
  );
}
