const BASE = import.meta.env.VITE_API_BASE;

async function request(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

async function send(method, path, data) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    let detail = `${res.status} ${res.statusText}`;
    try {
      const body = await res.json();
      if (body?.detail) detail = JSON.stringify(body.detail);
    } catch (_) {}
    throw new Error(detail);
  }
  return res.json();
}

// ── GET ──────────────────────────────────────────────────────────────────────

export function getRollos(almacen_id = 1, producto = null) {
  const params = new URLSearchParams({ almacen_id });
  if (producto !== null) params.set('producto', producto);
  return request(`/rollos?${params}`);
}

export function getProductos() {
  return request('/productos');
}

export function getStock() {
  return request('/stock');
}

export function getRollosPorProducto(codf) {
  return request(`/rollos?producto=${encodeURIComponent(codf)}`);
}

export function getDocumentos(almacen_id, fecha = null) {
  const params = new URLSearchParams({ almacen_id });
  if (fecha !== null) params.set('fecha', fecha);
  return request(`/rollos/documentos?${params}`);
}

export function getSugerencia(producto, metros, almacen_id) {
  const params = new URLSearchParams({ producto, metros, almacen_id });
  return request(`/rollos/sugerencia?${params}`);
}

export function getConfig() {
  return request('/config');
}

// ── POST / PUT ───────────────────────────────────────────────────────────────

export function putRollo(id_rollo, data) { return send('PUT', `/rollos/${encodeURIComponent(id_rollo)}`, data); }
export function postIngreso(data)    { return send('POST', '/rollos/ingresos',    data); }
export function postMovimiento(data) { return send('POST', '/rollos/movimientos', data); }
export function postTraslado(data)   { return send('POST', '/rollos/traslados',   data); }
export function putConfig(data)      { return send('PUT',  '/config',             data); }
