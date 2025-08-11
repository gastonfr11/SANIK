// js/api.js
export const API_BASE = "http://localhost:4000/api";

export const formatUYU = (cents) =>
  new Intl.NumberFormat("es-UY", { style: "currency", currency: "UYU", maximumFractionDigits: 0 })
    .format(Math.round(cents / 100));

async function getJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} – ${url}`);
  return res.json();
}

export const api = {
  health: () => getJSON(`${API_BASE}/health`),
  collections: () => getJSON(`${API_BASE}/collections`),
  collection: (slug) => getJSON(`${API_BASE}/collections/${encodeURIComponent(slug)}`),
  products: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return getJSON(`${API_BASE}/products${qs ? "?" + qs : ""}`);
  },
  product: (slug) => getJSON(`${API_BASE}/products/${encodeURIComponent(slug)}`)
};

// helpers
export function pickHoverImage(images = []) {
  return images.find(i => i.isHover) || images[1] || images[0] || null;
}
export function pickCoverImage(product) {
  // prefer coverImage field, else first image
  return product.coverImage || (product.images?.[0]?.url ?? "");
}
