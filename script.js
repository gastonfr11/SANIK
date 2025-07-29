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
});

