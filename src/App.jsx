import { useState } from 'react';
import Login       from './Login.jsx';
import VentasView  from './VentasView.jsx';
import AlmacenApp  from './AlmacenApp.jsx';

export default function App() {
  const [area, setArea] = useState(null);

  if (!area)              return <Login onSelect={setArea} />;
  if (area === 'ventas')  return <VentasView  onLogout={() => setArea(null)} />;
  if (area === 'almacen') return <AlmacenApp  onLogout={() => setArea(null)} />;
}
