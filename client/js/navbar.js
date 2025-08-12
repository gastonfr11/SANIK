// js/navbar.js
import { api } from "./api.js";

function newArrivalsHTML() {
  return `
    <li class="menu-item">
      <a href="catalogo.html?c=new-arrivals" class="menu-link btn-nav new-arrivals">NEW ARRIVALS</a>
    </li>
    <hr style="width:86%;opacity:.25;border:none;border-top:1px solid #fff2;">
  `;
}

function preventaHTML() {
  return `
    <hr style="width:86%;opacity:.25;border:none;border-top:1px solid #fff2;">
    <li class="menu-item preventa">
      <a href="catalogo.html?c=preventa" class="menu-link btn-nav preventa">PREVENTA</a>
    </li>
  `;
}

function collectionItemHTML(col) {
  return `
    <li class="menu-item has-submenu" data-slug="${col.slug}">
      <div class="submenu-header">
        <a href="coleccion.html?c=${encodeURIComponent(col.slug)}" 
           class="submenu-title-link">
          ${col.name}
        </a>
        <button class="submenu-arrow-btn" aria-label="Mostrar productos">▾</button>
      </div>
      <ul class="submenu" role="region" aria-label="Productos de ${col.name}">
        <li><span style="opacity:.8;font-size:.95rem;">Cargando…</span></li>
      </ul>
    </li>
  `;
}

async function loadProductsIntoSubmenu(li) {
  const slug = li.dataset.slug;
  const submenu = li.querySelector(".submenu");
  if (!submenu || submenu.dataset.loaded === "true") return;

  try {
    const col = await api.collection(slug);
    const products = col?.products ?? [];
    submenu.innerHTML = products.length
      ? products.map(p => `
          <li>
            <a href="prenda.html?id=${encodeURIComponent(p.slug)}" title="${p.name}">
              ${p.name}
            </a>
          </li>
        `).join("")
      : `<li><span style="opacity:.8;">Sin productos aún.</span></li>`;
    submenu.dataset.loaded = "true";
  } catch (err) {
    console.error("No se pudieron cargar productos de la colección:", slug, err);
    submenu.innerHTML = `<li><span style="color:#d66;">Error al cargar</span></li>`;
  }
}

function toggleSubmenu(li) {
  const open = li.classList.contains("open");
  const btn = li.querySelector(".submenu-header");
  if (open) {
    li.classList.remove("open");
    btn?.setAttribute("aria-expanded", "false");
  } else {
    li.classList.add("open");
    btn?.setAttribute("aria-expanded", "true");
  }
}

export async function loadCollectionsMenu() {
  const ul = document.getElementById("collections-menu");
  if (!ul) return;

  try {
    const cols = await api.collections();
    const collectionsHTML = (cols ?? []).map(collectionItemHTML).join("");

    // Armamos: NEW ARRIVALS -> Colecciones -> PREVENTA
    ul.innerHTML = newArrivalsHTML() + collectionsHTML + preventaHTML();

    ul.addEventListener("click", async (e) => {
  // Si hizo click en la flecha, abrimos/cerramos submenú
  if (e.target.closest(".submenu-arrow-btn")) {
    const li = e.target.closest(".has-submenu");
    if (!li) return;
    if (li.querySelector(".submenu")?.dataset.loaded !== "true") {
      await loadProductsIntoSubmenu(li);
    }
    toggleSubmenu(li);
  }
  // Si hizo click en el título, el <a> llevará a la colección automáticamente
});
  } catch (err) {
    console.error("No se pudieron cargar colecciones:", err);
    ul.innerHTML = newArrivalsHTML() + `<li><span>Error cargando colecciones</span></li>` + preventaHTML();
  }
}

document.addEventListener("DOMContentLoaded", loadCollectionsMenu);
