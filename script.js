const deck = document.querySelector('.deck');
const cardStack = document.querySelector('.card-stack');
const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
const allNavLinks = Array.from(document.querySelectorAll('.nav-links a'));
const homeLink = document.querySelector('.nav-links a[href="#home"]');
const mountainFrames = Array.from(document.querySelectorAll('.mountain-frame'));
const rsvpButton = document.querySelector('.rsvp-button');
const registerButtons = Array.from(document.querySelectorAll('.register-tabs button'));
const navToggle = document.querySelector('.nav-toggle');
const navOverlay = document.querySelector('.nav-overlay');
const galleryLinks = Array.from(document.querySelectorAll('.gallery-card'));

let activeMountainIndex = -1;
let activeGalleryIndex = -1;

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
    document.body.classList.remove('nav-open');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
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

allNavLinks.forEach((link) => {
  link.addEventListener('click', () => {
    document.body.classList.remove('nav-open');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
  });
});

if (navToggle) {
  navToggle.addEventListener('click', () => {
    const isOpen = document.body.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
}

if (navOverlay) {
  navOverlay.addEventListener('click', () => {
    document.body.classList.remove('nav-open');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
  });
}

if (galleryLinks.length) {
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  const lightboxImg = document.createElement('img');
  lightbox.appendChild(lightboxImg);
  const navContainer = document.createElement('div');
  navContainer.className = 'lightbox-nav';
  const prevBtn = document.createElement('button');
  prevBtn.className = 'lightbox-button';
  prevBtn.type = 'button';
  prevBtn.setAttribute('aria-label', 'Previous image');
  prevBtn.textContent = '‹';
  const nextBtn = document.createElement('button');
  nextBtn.className = 'lightbox-button';
  nextBtn.type = 'button';
  nextBtn.setAttribute('aria-label', 'Next image');
  nextBtn.textContent = '›';
  navContainer.appendChild(prevBtn);
  navContainer.appendChild(nextBtn);
  lightbox.appendChild(navContainer);
  document.body.appendChild(lightbox);

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    document.body.classList.remove('lightbox-open');
    activeGalleryIndex = -1;
  };

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  const showImageAt = (index) => {
    const nextIndex = ((index % galleryLinks.length) + galleryLinks.length) % galleryLinks.length;
    const link = galleryLinks[nextIndex];
    if (!link) return;
    const img = link.querySelector('img');
    lightboxImg.src = link.href;
    lightboxImg.alt = img ? img.alt : '';
    activeGalleryIndex = nextIndex;
  };

  galleryLinks.forEach((link, index) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      showImageAt(index);
      lightbox.classList.add('is-open');
      document.body.classList.add('lightbox-open');
    });
  });

  prevBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    showImageAt(activeGalleryIndex - 1);
  });

  nextBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    showImageAt(activeGalleryIndex + 1);
  });

  document.addEventListener('keyup', (event) => {
    if (event.key === 'Escape') {
      closeLightbox();
    } else if (event.key === 'ArrowLeft' && activeGalleryIndex !== -1) {
      showImageAt(activeGalleryIndex - 1);
    } else if (event.key === 'ArrowRight' && activeGalleryIndex !== -1) {
      showImageAt(activeGalleryIndex + 1);
    }
  });
}

initMountains();
