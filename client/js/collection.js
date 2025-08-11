import { api, formatUYU, pickHoverImage, pickCoverImage } from "./api.js";

function cardTemplate(p) {
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

function enableHoverSwap() {}

function setFeaturedFromFirstProduct(collection) {
  const p = collection.products?.[0];

  // 1) Encabezado de colección
  const titleEl   = document.getElementById("collection-title");
  const conceptEl = document.getElementById("collection-concept");
  const logoEl    = document.getElementById("logo");

  if (titleEl)   titleEl.textContent   = collection.name || "Colección";
  if (conceptEl) conceptEl.textContent = collection.concept || "";
  if (logoEl)    logoEl.textContent    = collection.name || "SANIK";

  // 2) Destacado (prenda)
  const featureImg   = document.getElementById("feature-img");
  const featureLink  = document.getElementById("feature-link");
  const featuredTEl  = document.getElementById("featured-title");
  const featuredDEl  = document.getElementById("featured-desc");
  const featuredPriceEl = document.getElementById("featured-price"); // opcional

  if (!p || !featureImg) return;

  const cover = pickCoverImage(p);
  featureImg.src = cover;
  featureImg.alt = p.name;

  if (featuredTEl)  featuredTEl.textContent = p.name || "Prenda destacada";
  if (featuredDEl)  featuredDEl.textContent = p.description?.trim() || ""; // ajustá al campo real
  if (featuredPriceEl) featuredPriceEl.textContent = `${formatUYU(p.priceUYU)} UYU`;

  if (featureLink) {
    featureLink.href = `prenda.html?id=${encodeURIComponent(p.slug)}`;
    featureLink.style.display = "inline-block";
  }
}

async function main() {
  const params = new URLSearchParams(location.search);
  const slug = params.get("c");

  const grid = document.getElementById("collection-grid");

  if (!slug) {
    if (grid) grid.innerHTML = `<p>Falta el parámetro ?c=slug en la URL.</p>`;
    return;
  }

  try {
    const col = await api.collection(slug);

    setFeaturedFromFirstProduct(col);

    if (grid) {
      grid.innerHTML = (col.products ?? []).map(cardTemplate).join("") || `<p>Sin productos aún.</p>`;
      enableHoverSwap(grid);
    }
  } catch (e) {
    console.error(e);
    if (grid) grid.innerHTML = `<p>No se pudo cargar la colección.</p>`;
  }
}

document.addEventListener("DOMContentLoaded", main);
