const BASE = '/api/todos';

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res.status === 204 ? null : res.json();
}

export const api = {
  list: () => request(BASE),
  create: (text) => request(BASE, { method: 'POST', body: JSON.stringify({ text }) }),
  update: (id, changes) =>
    request(`${BASE}/${id}`, { method: 'PATCH', body: JSON.stringify(changes) }),
  remove: (id) => request(`${BASE}/${id}`, { method: 'DELETE' }),
  clearCompleted: () => request(`${BASE}/completed`, { method: 'DELETE' }),
};
