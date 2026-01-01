const deck = document.querySelector('.deck');
const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
const homeLink = document.querySelector('.nav-links a[href="#home"]');
const mountainFrames = Array.from(document.querySelectorAll('.mountain-frame'));

let activeMountainIndex = -1;

const clampIndex = (value, min, max) => Math.min(Math.max(value, min), max);

const setActiveMountain = (index) => {
  if (!mountainFrames.length) return;
  const nextIndex = clampIndex(index, 0, mountainFrames.length - 1);
  if (nextIndex === activeMountainIndex) return;
  activeMountainIndex = nextIndex;

  mountainFrames.forEach((frame, frameIndex) => {
    frame.style.zIndex = frameIndex === activeMountainIndex ? String(mountainFrames.length + 1) : '';
  });
};

const onMountainScroll = () => {
  if (!deck || !mountainFrames.length) return;
  const deckTop = deck.offsetTop;
  const deckHeight = deck.offsetHeight;
  const scrollRange = Math.max(deckHeight - window.innerHeight, 1);
  const progress = Math.min(Math.max((window.scrollY - deckTop) / scrollRange, 0), 1);
  const nextIndex = Math.round(progress * (mountainFrames.length - 1));
  setActiveMountain(nextIndex);
};

const initMountains = () => {
  if (!mountainFrames.length) return;

  mountainFrames.forEach((frame, index) => {
    const shape = frame.querySelector('.mountain-shape') || frame;
    shape.addEventListener('click', (event) => {
      event.stopPropagation();
      setActiveMountain(index);
    });
  });

  window.addEventListener('scroll', onMountainScroll, { passive: true });
  window.addEventListener('resize', onMountainScroll);
  onMountainScroll();
};

if (homeLink) {
  homeLink.addEventListener('click', (event) => {
    event.preventDefault();
    setActiveMountain(0);
    const homeTarget = document.getElementById('home');
    if (homeTarget) {
      homeTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const mountainIndex = Number(link.dataset.mountain);
    if (Number.isNaN(mountainIndex)) return;
    event.preventDefault();
    setActiveMountain(mountainIndex);
  });
});

initMountains();
