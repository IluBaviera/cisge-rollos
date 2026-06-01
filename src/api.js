const BASE = import.meta.env.VITE_API_BASE;

async function request(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export function getRollos(almacen = null) {
  const qs = almacen !== null ? `?almacen=${encodeURIComponent(almacen)}` : '';
  return request(`/rollos${qs}`);
}

export function getProductos() {
  return request('/productos');
}
