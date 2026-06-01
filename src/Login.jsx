export default function Login({ onSelect }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 to-blue-900 flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-2xl mb-4 shadow-xl p-2">
          <img src="/logo-cisge.png" alt="CISGE" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight">CISGE</h1>
        <p className="text-blue-200 mt-1 text-sm font-medium tracking-widest uppercase">
          Control de Rollos
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <p className="text-center text-gray-500 text-sm font-medium">
            Selecciona tu área de trabajo
          </p>
        </div>

        <div className="p-5 flex flex-col gap-3">
          <button
            onClick={() => onSelect('almacen')}
            className="flex items-center gap-4 w-full bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white rounded-xl px-5 py-4 transition-all shadow-md hover:shadow-lg"
          >
            <span className="text-3xl">📦</span>
            <div className="text-left">
              <div className="font-bold text-lg leading-tight">Almacén</div>
              <div className="text-blue-200 text-xs mt-0.5">Pedidos, rollos e ingresos</div>
            </div>
            <span className="ml-auto text-blue-300 text-xl">›</span>
          </button>

          <button
            onClick={() => onSelect('ventas')}
            className="flex items-center gap-4 w-full border-2 border-blue-700 hover:bg-blue-50 active:bg-blue-100 text-blue-700 rounded-xl px-5 py-4 transition-all"
          >
            <span className="text-3xl">🔍</span>
            <div className="text-left">
              <div className="font-bold text-lg leading-tight">Ventas</div>
              <div className="text-blue-500 text-xs mt-0.5">Consulta de inventario</div>
            </div>
            <span className="ml-auto text-blue-400 text-xl">›</span>
          </button>
        </div>

        <div className="px-6 pb-5 text-center">
          <p className="text-gray-400 text-xs">v1.0 · CISGE 2025</p>
        </div>
      </div>
    </div>
  );
}
