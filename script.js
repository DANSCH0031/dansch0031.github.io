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
const storyButtons = Array.from(document.querySelectorAll('.story-open'));
const storyButtonsFloating = document.querySelector('.story-buttons-floating');
const storyModal = document.querySelector('[data-story-modal]');
const storyModalBackdrop = document.querySelector('[data-story-modal-backdrop]');
const storyModalTitle = document.querySelector('[data-story-modal-title]');
const storyModalContent = document.querySelector('[data-story-modal-content]');
const storyModalClose = document.querySelector('.story-modal-close');
const storyModalCard = document.querySelector('.story-modal-card');

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

  if (storyButtonsFloating) {
    storyButtonsFloating.classList.toggle('is-visible', activeMountainIndex === 1);
  }

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

  let touchStartX = 0;
  let touchStartY = 0;

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

  lightbox.addEventListener('touchstart', (event) => {
    if (!lightbox.classList.contains('is-open')) return;
    const touch = event.touches[0];
    if (!touch) return;
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  }, { passive: true });

  lightbox.addEventListener('touchend', (event) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (activeGalleryIndex === -1) return;
    const touch = event.changedTouches[0];
    if (!touch) return;
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;
    const minSwipe = 40;
    if (Math.abs(deltaX) > minSwipe && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        showImageAt(activeGalleryIndex - 1);
      } else {
        showImageAt(activeGalleryIndex + 1);
      }
    }
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

const storyContentMap = {
  met: {
    title: 'How We Met',
    body: `
      <p>Gwen and Daniel’s story began in December 2019, when a simple online match turned into something neither of them expected. At the time, Daniel was still living in Vancouver and preparing to move to Toronto — not exactly the ideal setup for meeting someone new. But from the very first messages, something just clicked. Their conversations felt easy, natural, and quickly became part of their everyday lives.</p>
      <p>Before Daniel officially moved east, he visited Toronto — and that’s when they had their first date on January 19th, 2020 at a Boston Pizza in Burlington. It wasn’t fancy or dramatic, but it didn’t need to be. The connection they’d felt through weeks of texting was instantly real in person.</p>
      <p>From the day they matched on December 7th until today, there hasn’t been a single day they haven’t talked. What started as a simple swipe turned into a constant, steady presence in each other’s lives — something that felt right from the very beginning.</p>
      <p>And that’s how their story started: quietly, unexpectedly, and with a feeling that only grew stronger with time.</p>
    `,
  },
  proposal: {
    title: 'Our Proposal',
    body: `
      <p>On April 21st, 2024, on the quiet beaches of Andros Island in the Bahamas, Daniel had a plan — and Gwen had absolutely no idea. What made it even better was that everyone else did. Daniel’s sister Martina and her boyfriend Felix were there, Gwen’s brother Alex and his girlfriend Alejandra had flown in, Gwen’s parents David and Karin were waiting excitedly, and even Robin had come all the way from Germany. A full undercover cheering squad.</p>
      <p>Daniel and Gwen went for a walk along the beach, the kind of simple moment that always feels right for the two of them. Daniel can’t remember the ten minutes leading up to it — just the rush of nerves and love — but he dropped to one knee and asked the question that would change everything.</p>
      <p><strong>Gwen said yes.</strong></p>
      <p>They walked back to the beach house trying (and failing) to hide the giant smiles on their faces. Everyone inside tried (and also failed) to pretend they didn’t know what had just happened. The whole scene was full of laughter, joy, and the kind of happiness you can’t script.</p>
      <p>It was, without question, one of the best days of their lives — the perfect beginning to the rest of their story.</p>
      <p><img src="Proposal.JPG" alt="Proposal moment" class="story-image"></p>
    `,
  },
};

const openStoryModal = (key) => {
  if (!storyModal || !storyModalBackdrop || !storyModalTitle || !storyModalContent) return;
  const payload = storyContentMap[key];
  if (!payload) return;
  storyModalTitle.textContent = payload.title;
  storyModalContent.innerHTML = payload.body;
  storyModal.classList.add('is-open');
  storyModalBackdrop.classList.add('is-open');
  document.body.classList.add('story-modal-open');
};

const closeStoryModal = () => {
  if (!storyModal || !storyModalBackdrop) return;
  storyModal.classList.remove('is-open');
  storyModalBackdrop.classList.remove('is-open');
  document.body.classList.remove('story-modal-open');
};

storyButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const key = btn.dataset.story;
    openStoryModal(key);
  });
});

if (storyModalBackdrop) {
  storyModalBackdrop.addEventListener('click', closeStoryModal);
}

if (storyModal) {
  storyModal.addEventListener('click', (event) => {
    if (storyModalCard && storyModalCard.contains(event.target)) return;
    closeStoryModal();
  });
}

if (storyModalClose) {
  storyModalClose.addEventListener('click', closeStoryModal);
}

document.addEventListener('keyup', (event) => {
  if (event.key === 'Escape') {
    closeStoryModal();
  }
});

initMountains();
