// js/catalog.js
import { api, formatUYU, pickHoverImage, pickCoverImage } from "./api.js";

const TAKE = 12;

let state = {
  collection: "",
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



function enableHoverSwap() {

}

function setLoading(isLoading) {
  state.loading = isLoading;
  els.loadMore?.toggleAttribute("disabled", isLoading);
  if (isLoading) els.loadMore.textContent = "Cargando...";
  else els.loadMore.textContent = state.end ? "No hay más" : "Cargar más";
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

async function loadProducts({ reset = false } = {}) {
  if (state.loading || state.end) return;
  setLoading(true);
  try {
    if (reset) {
      state.skip = 0;
      state.end = false;
      els.grid.innerHTML = "";
    }
    const params = {
      take: TAKE,
      skip: state.skip,
      sort: "price-desc"
    };
    if (state.collection) params.collection = state.collection;
    if (state.q) params.q = state.q;

    const list = await api.products(params);
    list.sort((a, b) => b.priceUYU - a.priceUYU);

    if (!list.length) {
      state.end = true;
      setLoading(false);
      if (reset && !els.grid.children.length) {
        els.grid.innerHTML = `<p>Sin resultados.</p>`;
      }
      return;
    }

    els.grid.insertAdjacentHTML("beforeend", list.map(cardHTML).join(""));
    enableHoverSwap(els.grid);

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

function readParamsFromURL() {
  const params = new URLSearchParams(location.search);
  const q = params.get("q");
  const c = params.get("c"); // colección opcional en la URL
  if (q) state.q = q;
  if (c) state.collection = c;
}

async function main() {
  els.select = document.getElementById("filter-collection");
  els.search = document.getElementById("search");
  els.grid = document.getElementById("catalog-grid");
  els.loadMore = document.getElementById("load-more");

  readParamsFromURL();
  await loadCollectionsForFilter();

  // Setear valores iniciales en UI si vinieron por URL
  if (state.collection && els.select) els.select.value = state.collection;
  if (state.q && els.search) els.search.value = state.q;

  // Eventos
  els.select?.addEventListener("change", () => {
    state.collection = els.select.value;
    loadProducts({ reset: true });
    const url = new URL(location.href);
    if (state.collection) url.searchParams.set("c", state.collection);
    else url.searchParams.delete("c");
    history.replaceState({}, "", url);
  });

  els.search?.addEventListener("input", debounce(() => {
    state.q = els.search.value.trim();
    loadProducts({ reset: true });
    const url = new URL(location.href);
    if (state.q) url.searchParams.set("q", state.q);
    else url.searchParams.delete("q");
    history.replaceState({}, "", url);
  }, 350));

  els.loadMore?.addEventListener("click", () => loadProducts());

  // Primera carga
  loadProducts({ reset: true });
}

document.addEventListener("DOMContentLoaded", main);
