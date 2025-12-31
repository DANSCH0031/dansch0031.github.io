const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
const navToggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('.nav-links');
const deck = document.querySelector('.deck');
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

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    if (navList && navToggle) {
      navList.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

if (navToggle && navList) {
  navToggle.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
}

document.addEventListener('click', (event) => {
  if (!navList || !navToggle) return;
  const target = event.target;
  if (!(target instanceof Element)) return;
  const isToggle = navToggle.contains(target);
  const isMenu = navList.contains(target);
  if (!isToggle && !isMenu && navList.classList.contains('is-open')) {
    navList.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

initMountains();
