// js/navbar.js
import { api } from "./api.js";

export async function loadCollectionsMenu() {
  const ul = document.getElementById("collections-menu");
  if (!ul) return;

  try {
    const cols = await api.collections();
    ul.innerHTML = cols.map(c => `
      <li><a href="coleccion.html?c=${encodeURIComponent(c.slug)}">${c.name}</a></li>
    `).join("");
  } catch (err) {
    console.error("No se pudieron cargar colecciones:", err);
    ul.innerHTML = `<li><span>Error cargando colecciones</span></li>`;
  }
}

// auto-run si el elemento existe
document.addEventListener("DOMContentLoaded", loadCollectionsMenu);
