import { useState, useEffect } from 'react';
import { getRollos } from './api.js';
import HoseInventory from './HoseInventory.jsx';

export default function MisRollosView() {
  const [rollos,  setRollos]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const fetch_ = () => {
    setLoading(true);
    setError(null);
    getRollos()
      .then(data => { setRollos(data); setLoading(false); })
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
      <button onClick={fetch_} className="btn-primary text-sm px-6">
        Reintentar
      </button>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <HoseInventory rollos={rollos} />
    </div>
  );
}
