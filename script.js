const menuToggle = document.querySelector('#menu-toggle');
const mainNav = document.querySelector('#main-nav');
menuToggle.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  menuToggle.textContent = open ? '×' : '☰';
});
mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  mainNav.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.textContent = '☰';
}));
if ('IntersectionObserver' in window) {
  const navLinks = [...mainNav.querySelectorAll('a[href^="#"]')];
  const navObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) navLinks.forEach(link => link.classList.toggle('nav-active', link.hash === `#${entry.target.id}`));
  }), { rootMargin: '-25% 0px -65% 0px' });
  navLinks.forEach(link => { const section = document.querySelector(link.hash); if (section) navObserver.observe(section); });
}

document.querySelector('#theme-toggle').addEventListener('click', () => document.body.classList.toggle('soft-light'));

document.querySelectorAll('.segment').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.segment').forEach(tab => {
    const active = tab === button;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
  });
  document.querySelectorAll('.class-card').forEach(card => {
    card.hidden = button.dataset.filter !== 'all' && card.dataset.kind !== button.dataset.filter;
  });
}));

const progress = document.querySelector('#reading-progress');
function updateProgress() {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`;
}
addEventListener('scroll', updateProgress, { passive: true });
addEventListener('resize', updateProgress);
updateProgress();

// Animate each section as it enters view, while keeping a no-motion fallback.
const revealItems = document.querySelectorAll('.intro-layout > *, .feature-row article, .editorial-image, .purpose-band, .database-vs-tool > *, .classification-grid .class-card, .tip-line, .classification-advisor, .compare-wrap, .callout, .er-steps p, .cardinality-row article, .model-difference, .maria-fact, .structure-showcase, .flow-step, .storage-card, .feature-ribbon span, .acid-block, .lab-grid, .use-case-grid article, .glossary-grid article, .closing-note, .author-card');
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  revealItems.forEach(item => item.classList.add('reveal'));
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  }), { threshold: 0.14 });
  revealItems.forEach(item => revealObserver.observe(item));
}

const advice = {
  orders: 'Te conviene explorar un modelo relacional: clientes, pedidos y productos se conectan con claves. MariaDB es un ejemplo de SGBDR.',
  flexible: 'Un almacén documental NoSQL puede funcionar bien cuando cada registro tiene campos distintos o cambia con frecuencia.',
  analytics: 'Para consultas analíticas grandes, considera una solución orientada a columnas. MariaDB ColumnStore es una opción de su ecosistema.'
};
const adviceBox = document.querySelector('#advisor-answer');
document.querySelectorAll('.advisor-options button').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.advisor-options button').forEach(option => option.classList.toggle('selected', option === button));
  adviceBox.textContent = advice[button.dataset.advice];
  adviceBox.classList.remove('answer-pop');
  requestAnimationFrame(() => adviceBox.classList.add('answer-pop'));
}));

const sql = `SELECT libro.titulo, prestamo.fecha\nFROM libro\nJOIN prestamo ON prestamo.id_libro = libro.id_libro\nWHERE prestamo.devuelto = 0;`;
document.querySelector('#copy-sql').addEventListener('click', async event => {
  const button = event.currentTarget;
  const status = document.querySelector('#copy-status');
  try {
    await navigator.clipboard.writeText(sql);
    button.innerHTML = 'Copiado <span>✓</span>';
    status.textContent = 'CONSULTA COPIADA · SIMULACIÓN EDUCATIVA';
    setTimeout(() => { button.innerHTML = 'Copiar SQL <span>▣</span>'; status.textContent = 'SIMULACIÓN EDUCATIVA · NO CONECTA A UN SERVIDOR'; }, 1800);
  } catch {
    status.textContent = 'NO SE PUDO COPIAR · SELECCIONA EL CÓDIGO';
  }
});

const runButton = document.querySelector('#run-query');
const result = document.querySelector('#query-result');
runButton.addEventListener('click', () => {
  runButton.classList.add('running');
  runButton.textContent = '⟳ Consultando…';
  result.classList.remove('result-pop');
  setTimeout(() => {
    runButton.classList.remove('running');
    runButton.innerHTML = '✓ Consulta completada';
    result.hidden = false;
    result.classList.add('result-pop');
    document.querySelector('#copy-status').textContent = '¡LISTO! 2 PRÉSTAMOS ACTIVOS · DATOS DE EJEMPLO';
    setTimeout(() => { runButton.innerHTML = '▶ Ejecutar de nuevo'; }, 1600);
  }, 700);
});

const quizFeedback = document.querySelector('#quiz-feedback');
document.querySelectorAll('.quiz-options button').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.quiz-options button').forEach(option => option.classList.remove('correct', 'incorrect'));
  const correct = button.dataset.answer === 'yes';
  button.classList.add(correct ? 'correct' : 'incorrect');
  quizFeedback.classList.toggle('right-answer', correct);
  quizFeedback.textContent = correct
    ? '¡Exacto! Un índice funciona como el índice de un libro: ayuda al motor a localizar información sin revisar cada fila.'
    : 'Casi. Piensa en el índice al final de un libro: te lleva a una página sin leerlo entero. Prueba otra vez.';
}));
