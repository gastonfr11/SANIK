// js/catalog.js
import { api, formatUYU, pickHoverImage, pickCoverImage } from "./api.js";

const TAKE = 12;

// Colecciones "virtuales"
const SPECIAL = {
  "new-arrivals": { order: "createdAt_desc" },
  "preventa":     { preorder: true },
};

let state = {
  collection: "",
  special: "",
  q: "",
  skip: 0,
  loading: false,
  end: false,
};

const els = {
  select: null,
  search: null,
  grid: null,
  loadMore: null,
};

function cardHTML(p) {
  const cover = pickCoverImage(p);
  const hover = pickHoverImage(p.images)?.url ?? cover;
  const price = formatUYU(p.priceUYU);
  return `
    <a class="product-card vertical" href="prenda.html?id=${encodeURIComponent(p.slug)}">
      <div class="product-image">
        <img class="img-main" src="${cover}" alt="${p.name}" loading="lazy" decoding="async" />
        <img class="img-hover" src="${hover}" alt="" aria-hidden="true" loading="lazy" decoding="async" />
      </div>
      <div class="product-content">
        <h3>${p.name}</h3>
        <p class="price">${price} UYU</p>
      </div>
    </a>
  `;
}

// No necesitamos swap por JS (lo hace CSS con .img-main/.img-hover)
function enableHoverSwap() {}

function setLoading(isLoading) {
  state.loading = isLoading;
  els.loadMore?.toggleAttribute("disabled", isLoading);
  els.loadMore.textContent = isLoading ? "Cargando..." : (state.end ? "No hay más" : "Cargar más");
}

async function loadCollectionsForFilter() {
  try {
    const cols = await api.collections();
    const opts = cols.map(c => `<option value="${c.slug}">${c.name}</option>`).join("");
    els.select.insertAdjacentHTML("beforeend", opts);
  } catch (e) {
    console.error("No se pudieron cargar colecciones para filtro", e);
  }
}

function readParamsFromURL() {
  const params = new URLSearchParams(location.search);
  const q = params.get("q");
  const c = params.get("c"); // colección o especial
  if (q) state.q = q;

  if (c && SPECIAL[c]) {
    state.special = c;
    state.collection = ""; // clave: no filtrar por colección inexistente
  } else if (c) {
    state.collection = c;
    state.special = "";
  }
}

async function loadProducts({ reset = false } = {}) {
  if (state.loading || state.end) return;
  setLoading(true);

  try {
    if (reset) {
      state.skip = 0;
      state.end = false;
      els.grid.innerHTML = "";
    }

    const params = { take: TAKE, skip: state.skip };
    if (state.collection) params.collection = state.collection;
    if (state.q) params.q = state.q;

    // Reglas especiales (sin collection)
    if (state.special === "new-arrivals") {
      params.order = "createdAt_desc";   // ajustá al nombre real que soporte tu backend
    }
    if (state.special === "preventa") {
      params.preorder = "true";          // ajustá al filtro real (tag, flag, etc.)
    }

    const list = await api.products(params);

    if (!list.length) {
      state.end = true;
      if (reset) els.grid.innerHTML = `<p>Sin resultados.</p>`;
      return;
    }

    els.grid.insertAdjacentHTML("beforeend", list.map(cardHTML).join(""));
    enableHoverSwap();

    state.skip += list.length;
    if (list.length < TAKE) state.end = true;
  } catch (e) {
    console.error("Error cargando productos", e);
    if (!els.grid.children.length) {
      els.grid.innerHTML = `<p>Error cargando productos.</p>`;
    }
  } finally {
    setLoading(false);
  }
}

function debounce(fn, wait = 350) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

async function main() {
  els.select = document.getElementById("filter-collection");
  els.search = document.getElementById("search");
  els.grid = document.getElementById("catalog-grid");
  els.loadMore = document.getElementById("load-more");

  readParamsFromURL();
  await loadCollectionsForFilter();

  // UI inicial
  if (state.collection && els.select) els.select.value = state.collection;
  if (state.q && els.search) els.search.value = state.q;

  // Si estamos en modo especial, opcional: limpiar el select visualmente
  if (state.special && els.select) els.select.value = "";

  // Eventos
  els.select?.addEventListener("change", () => {
    state.special = ""; // salimos de modo especial
    state.collection = els.select.value;
    const url = new URL(location.href);
    if (state.collection) url.searchParams.set("c", state.collection);
    else url.searchParams.delete("c");
    history.replaceState({}, "", url);
    loadProducts({ reset: true });
  });

  els.search?.addEventListener("input", debounce(() => {
    state.q = els.search.value.trim();
    const url = new URL(location.href);
    if (state.q) url.searchParams.set("q", state.q);
    else url.searchParams.delete("q");
    history.replaceState({}, "", url);
    loadProducts({ reset: true });
  }, 350));

  els.loadMore?.addEventListener("click", () => loadProducts());

  // Primera carga
  loadProducts({ reset: true });
}

document.addEventListener("DOMContentLoaded", main);
