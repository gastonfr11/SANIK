// js/product.js
import { api, formatUYU } from "./api.js";

function galleryHTML(product) {
  const imgs = product.images?.length ? product.images : [{ url: product.coverImage, alt: product.name }];
  const thumbs = imgs.map((im, i) =>
    `<button class="thumb-btn" data-src="${im.url}"><img src="${im.url}" alt="${im.alt ?? product.name}"></button>`
  ).join("");

  const main = imgs[0]?.url || product.coverImage || "";
  return `
    <div class="gallery">
      <div class="main"><img id="main-photo" src="${main}" alt="${product.name}" /></div>
      <div class="thumbs">${thumbs}</div>
    </div>
  `;
}

function variantsHTML(variants = []) {
  if (!variants.length) return "";
  // ejemplo simple: size + color en un select combinado
  const options = variants.map(v => {
    const label = [v.size, v.color].filter(Boolean).join(" / ") || "Única";
    const disabled = v.stock <= 0 ? "disabled" : "";
    return `<option value="${v.id}" ${disabled}>${label} ${v.stock<=0 ? "(sin stock)" : ""}</option>`;
  }).join("");
  return `
    <label class="field">
      <span>Variante</span>
      <select id="variant">${options}</select>
    </label>
  `;
}

function productTemplate(p) {
  const price = formatUYU(p.priceUYU);
  return `
    <div class="product-detail">
      ${galleryHTML(p)}
      <div class="info">
        <h1>${p.name}</h1>
        <p class="price">${price}</p>
        ${p.description ? `<p class="desc">${p.description}</p>` : ""}
        ${variantsHTML(p.variants)}
        <div class="actions">
          <button id="add-to-cart">Agregar al carrito</button>
        </div>
      </div>
    </div>
  `;
}

function wireGallery(container) {
  const main = container.querySelector("#main-photo");
  container.querySelectorAll(".thumb-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const src = btn.getAttribute("data-src");
      if (src) main.src = src;
    });
  });
}

async function main() {
  const el = document.getElementById("product");
  const params = new URLSearchParams(location.search);
  const slug = params.get("id");
  if (!slug) { el.innerHTML = "<p>Falta ?id=slug</p>"; return; }

  try {
    const p = await api.product(slug);
    el.innerHTML = productTemplate(p);
    wireGallery(el);

    // demo carrito (solo muestra selección en consola)
    const addBtn = el.querySelector("#add-to-cart");
    addBtn?.addEventListener("click", () => {
      const variantId = el.querySelector("#variant")?.value ?? null;
      console.log("Agregar al carrito:", { slug: p.slug, variantId });
      alert("Producto agregado (demo).");
    });
  } catch (e) {
    console.error(e);
    el.innerHTML = "<p>No se pudo cargar el producto.</p>";
  }
}
document.addEventListener("DOMContentLoaded", main);
