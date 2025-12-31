const cards = Array.from(document.querySelectorAll('.card'));
const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
const navToggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('.nav-links');
const deck = document.querySelector('.deck');
let targetProgress = 0;
let currentProgress = 0;
let rafId = null;

function layoutCards() {
  const activeIndex = Math.round(currentProgress);

  cards.forEach((card, index) => {
    const delta = index - currentProgress;
    const offsetY = delta * 18;
    const offsetX = delta * 10;
    const scale = 1 - Math.min(Math.abs(delta) * 0.03, 0.12);
    const rotate = delta * 2;
    card.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale}) rotate(${rotate}deg)`;
    card.style.opacity = '1';
    card.style.zIndex = String(20 - Math.abs(index - activeIndex));
    card.classList.toggle('is-active', index === activeIndex);
  });
}

cards.forEach((card, index) => {
  card.addEventListener('click', () => {
    targetProgress = index;
    startAnimation();
  });
});

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const targetId = link.getAttribute('href')?.slice(1);
    const targetCard = cards.find((card) => card.id === targetId);
    if (!targetCard) return;
    targetProgress = Number(targetCard.dataset.index) || 0;
    startAnimation();
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

cards.forEach((card) => {
  const body = card.querySelector('.card-body');
  if (!body) return;
  body.addEventListener('wheel', (event) => {
    const activeIndex = Math.round(currentProgress);
    const isActive = Number(card.dataset.index) === activeIndex;
    if (!isActive) return;

    const atTop = body.scrollTop <= 0;
    const atBottom = body.scrollTop + body.clientHeight >= body.scrollHeight - 1;

    if (event.deltaY > 0 && atBottom && activeIndex < cards.length - 1) {
      event.preventDefault();
      targetProgress = activeIndex + 1;
      startAnimation();
    } else if (event.deltaY < 0 && atTop && activeIndex > 0) {
      event.preventDefault();
      targetProgress = activeIndex - 1;
      startAnimation();
    }
  }, { passive: false });
});

function onScroll() {
  if (!deck) return;
  const deckTop = deck.offsetTop;
  const deckHeight = deck.offsetHeight;
  const scrollRange = Math.max(deckHeight - window.innerHeight, 1);
  const progress = Math.min(Math.max((window.scrollY - deckTop) / scrollRange, 0), 1);
  targetProgress = progress * (cards.length - 1);
  startAnimation();
}

function startAnimation() {
  if (rafId) return;
  const tick = () => {
    currentProgress += (targetProgress - currentProgress) * 0.12;
    if (Math.abs(targetProgress - currentProgress) < 0.001) {
      currentProgress = targetProgress;
      rafId = null;
      layoutCards();
      return;
    }
    layoutCards();
    rafId = window.requestAnimationFrame(tick);
  };
  rafId = window.requestAnimationFrame(tick);
}

layoutCards();
window.addEventListener('resize', layoutCards);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
