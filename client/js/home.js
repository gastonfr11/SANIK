// js/home.js
import { api, formatUYU, pickHoverImage, pickCoverImage } from "./api.js";

function cardHTML(p) {
  const cover = pickCoverImage(p);
  const hover = pickHoverImage(p.images)?.url ?? cover;
  const price = formatUYU(p.priceUYU);
  return `
    <article class="product-card vertical">
      <a href="prenda.html?id=${encodeURIComponent(p.slug)}" class="product-image" aria-label="${p.name}">
        <img src="${cover}" class="img-main" alt="${p.name}" loading="lazy" decoding="async" />
        <img src="${hover}" class="img-hover" alt="" aria-hidden="true" loading="lazy" decoding="async" />
      </a>
      <div class="product-content">
        <h3>${p.name}</h3>
        <p class="price">${price} UYU</p>
      </div>
    </article>
  `;
}

// ❌ ya no hace falta swap por JS
function enableHoverSwap() {}

function wireCarousel(track, prevBtn, nextBtn) {
  const step = () => track.querySelector(".product-card")?.offsetWidth ?? 280;
  prevBtn?.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
  nextBtn?.addEventListener("click", () => track.scrollBy({ left:  step(), behavior: "smooth" }));
}

async function main() {
  const track = document.getElementById("featured-track");
  const prevBtn = document.getElementById("feat-prev");
  const nextBtn = document.getElementById("feat-next");
  if (!track) return;

  try {
    const products = await api.products({ take: 12, skip: 0 });
    track.innerHTML = products.map(cardHTML).join("") || `<p>Pronto habrá novedades ✨</p>`;
    wireCarousel(track, prevBtn, nextBtn);
  } catch (e) {
    console.error("No se pudieron cargar destacados", e);
    track.innerHTML = `<p>Error cargando destacados</p>`;
  }
}

document.addEventListener("DOMContentLoaded", main);
