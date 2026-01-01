const deck = document.querySelector('.deck');
const cardStack = document.querySelector('.card-stack');
const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
const homeLink = document.querySelector('.nav-links a[href="#home"]');
const mountainFrames = Array.from(document.querySelectorAll('.mountain-frame'));
const rsvpButton = document.querySelector('.rsvp-button');
const registerButtons = Array.from(document.querySelectorAll('.register-tabs button'));

let activeMountainIndex = -1;

const clampIndex = (value, min, max) => Math.min(Math.max(value, min), max);

const setActiveMountain = (index) => {
  if (!mountainFrames.length) return;
  const nextIndex = clampIndex(index, 0, mountainFrames.length - 1);
  if (nextIndex === activeMountainIndex) return;
  activeMountainIndex = nextIndex;

  const total = mountainFrames.length;

  mountainFrames.forEach((frame, frameIndex) => {
    const offset = (frameIndex - activeMountainIndex + total) % total;
    const zIndex = total - offset;
    frame.style.zIndex = String(zIndex);
    frame.classList.toggle('is-active', offset === 0);
  });

  if (rsvpButton) {
    if (activeMountainIndex === 0) {
      rsvpButton.classList.add('is-visible');
    } else {
      rsvpButton.classList.remove('is-visible');
    }
  }

  registerButtons.forEach((button) => {
    const buttonIndex = Number(button.dataset.mountain);
    button.classList.toggle('is-active', buttonIndex === activeMountainIndex);
  });

  if (cardStack) {
    cardStack.classList.add('animate-mountains');
  }
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

registerButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    const mountainIndex = Number(button.dataset.mountain);
    if (Number.isNaN(mountainIndex)) return;
    event.preventDefault();
    setActiveMountain(mountainIndex);
  });
});

initMountains();
