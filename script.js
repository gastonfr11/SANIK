// scripts.js

document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks  = document.querySelector('.nav-links');
  const logo = document.getElementById('logo');
  const body      = document.body;

  if (logo) {
    // 1) tomamos el texto original como string
    const str = logo.textContent.trim();
    // 2) lo dividimos en array de caracteres y lo reescribimos como spans
    logo.innerHTML = str.split('').map(char => {
      if (char === ' ') {
        return '<span class="space">&nbsp;</span>';
      }
      return `<span>${char}</span>`;
    }).join('');
  }

  if (!navToggle || !navLinks) return;

   navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('show');
    body.classList.toggle('sidebar-open');
  });

  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target); // deja de observar tras animar
      }
    });
  }, {
    threshold: 0.1  // se dispara cuando al menos el 10% del elemento está visible
  });

  reveals.forEach(el => observer.observe(el));
  document.querySelectorAll('.submenu-header').forEach(header => {
  header.addEventListener('click', function(e) {
    // Expandir/cerrar con flecha
    if (e.target.classList.contains('submenu-arrow')) {
      this.parentElement.classList.toggle('open');
    } else {
      // Click en texto de colección = va a la colección
      window.location.href = this.getAttribute('data-link');
    }
  });
});

document.querySelectorAll('.carousel-arrow').forEach(btn => {
  btn.addEventListener('click', function() {
    const track = this.closest('.carousel-wrapper').querySelector('.carousel-track-horizontal');
    const card = track.querySelector('.product-card');
    if (!card) return;
    const cardWidth = card.offsetWidth + 20; // gap
    track.scrollBy({ 
      left: (this.classList.contains('right') ? cardWidth : -cardWidth), 
      behavior: 'smooth' 
    });
  });
});

// Opcional: drag para mobile/pc (UX tipo Shopify)
const track = document.querySelector('.carousel-track-horizontal');
if (track) {
  let isDown = false, startX, scrollLeft;
  track.addEventListener('mousedown', e => {
    isDown = true; track.classList.add('dragging');
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });
  track.addEventListener('mouseleave', () => { isDown = false; track.classList.remove('dragging'); });
  track.addEventListener('mouseup', () => { isDown = false; track.classList.remove('dragging'); });
  track.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.2;
    track.scrollLeft = scrollLeft - walk;
  });
}

});

