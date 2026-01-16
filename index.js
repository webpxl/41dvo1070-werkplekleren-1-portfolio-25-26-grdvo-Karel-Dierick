const imgs = [
  'Assets/Schermafbeelding 2026-01-16 103907.png',
  'Assets/Schermafbeelding 2026-01-16 103926.png',
  'Assets/Schermafbeelding 2026-01-16 103950.png',
  'Assets/Schermafbeelding 2026-01-16 104146.png',
  'Assets/Schermafbeelding 2026-01-16 104238.png',
  'Assets/Schermafbeelding 2026-01-16 104256.png'
];

let current = 0; // start with first screenshot

const leftImg = document.querySelector('.gallery-img.left');
const centerImg = document.querySelector('.gallery-img.center');
const rightImg = document.querySelector('.gallery-img.right');
const prevBtn = document.getElementById('galleryPrev');
const nextBtn = document.getElementById('galleryNext');
const announcer = document.getElementById('gallery-announcer');

function preloadAll() {
  imgs.forEach(src => {
    const i = new Image();
    i.src = src;
  });
}

function render() {
  const total = imgs.length;
  const centerIndex = ((current % total) + total) % total;
  const leftIndex = (centerIndex - 1 + total) % total;
  const rightIndex = (centerIndex + 1) % total;

  if (leftImg) leftImg.src = imgs[leftIndex];
  if (centerImg) centerImg.src = imgs[centerIndex];
  if (rightImg) rightImg.src = imgs[rightIndex];

  // update announcer for accessibility
  if (announcer) announcer.textContent = `Afbeelding ${centerIndex + 1} van ${total}`;
}

function prev() {
  current = (current - 1 + imgs.length) % imgs.length;
  render();
}

function next() {
  current = (current + 1) % imgs.length;
  render();
}

if (prevBtn) prevBtn.addEventListener('click', prev);
if (nextBtn) nextBtn.addEventListener('click', next);

// keyboard support
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') prev();
  if (e.key === 'ArrowRight') next();
});

// initial preload and render
preloadAll();
render();
