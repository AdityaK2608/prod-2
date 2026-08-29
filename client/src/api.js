const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export async function searchCVEs(query, options = {}) {
  const params = new URLSearchParams({ q: query, ...options });
  const response = await fetch(`${API_BASE}/api/cves?${params}`);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `API request failed (${response.status})`);
  return data;
}

export async function healthCheck() {
  const response = await fetch(`${API_BASE}/api/health`);
  if (!response.ok) throw new Error('Sentinel API unavailable');
  return response.json();
}
