const site = {
  title: "G&amp;D ∞",
  canonical: "https://gwyneth-and-daniel-forever.com/",
  og_image: "https://gwyneth-and-daniel-forever.com/og-preview.png",
  og_image_width: "2048",
  og_image_height: "1024",
  twitter_card: "summary_large_image",
  rsvp_url: "https://gwyneth-and-daniel.wedsites.com/rsvp"
};

const gateStyles = `<style>
  .gate-overlay {
    position: fixed;
    inset: 0;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }
  .gate-panel {
    display: grid;
    gap: 0.75rem;
    width: min(320px, 90vw);
    font-family: "Space Grotesk", system-ui, sans-serif;
    color: #1f2a37;
  }
  .gate-input {
    border: 1px solid #cfd7df;
    border-radius: 999px;
    padding: 0.65rem 1rem;
    font-size: 1rem;
    letter-spacing: 0.04em;
  }
  .gate-button {
    border: 0;
    border-radius: 999px;
    padding: 0.65rem 1rem;
    background: #1f2a37;
    color: #fff;
    font-size: 0.95rem;
    cursor: pointer;
  }
  .gate-hint {
    font-size: 0.85rem;
    color: #6b7280;
  }
  .is-locked #site-content {
    display: none;
  }
</style>`;

const gateOverlay = `<div class="gate-overlay" data-gate>
  <form class="gate-panel" data-gate-form>
    <label for="gate-password">Password</label>
    <input id="gate-password" class="gate-input" type="password" inputmode="numeric" autocomplete="off">
    <button class="gate-button" type="submit">Enter</button>
    <div class="gate-hint" data-gate-hint></div>
  </form>
</div>`;

const gateScript = `<script>
  (function () {
    var PASSWORD = "201085";
    var STORAGE_KEY = "site-unlocked";
    var body = document.body;
    var gate = document.querySelector("[data-gate]");
    var form = document.querySelector("[data-gate-form]");
    var input = document.getElementById("gate-password");
    var hint = document.querySelector("[data-gate-hint]");

    function unlock() {
      localStorage.setItem(STORAGE_KEY, "true");
      body.classList.remove("is-locked");
      if (gate) {
        gate.remove();
      }
    }

    if (localStorage.getItem(STORAGE_KEY) === "true") {
      unlock();
      return;
    }

    body.classList.add("is-locked");

    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        if (!input) {
          return;
        }
        if (input.value === PASSWORD) {
          unlock();
          return;
        }
        input.value = "";
        if (hint) {
          hint.textContent = "Incorrect password.";
        }
      });
    }
  })();
</script>`;

const gradientDefs = {
  one: `<defs>
  <linearGradient id="mountainGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop class="mountain-stop mountain-stop-top" offset="0%"/>
    <stop class="mountain-stop mountain-stop-mid" offset="20%"/>
    <stop class="mountain-stop mountain-stop-bottom" offset="100%"/>
  </linearGradient>
</defs>`,
  two: `<defs>
  <linearGradient id="mountainGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop class="mountain-stop mountain-stop-top" offset="0%"/>
    <stop class="mountain-stop mountain-stop-mid" offset="20%"/>
    <stop class="mountain-stop mountain-stop-bottom" offset="100%"/>
  </linearGradient>
</defs>`,
  three: `<defs>
  <linearGradient id="mountainGradient3" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop class="mountain-stop mountain-stop-top" offset="0%"/>
    <stop class="mountain-stop mountain-stop-mid" offset="20%"/>
    <stop class="mountain-stop mountain-stop-bottom" offset="100%"/>
  </linearGradient>
</defs>`,
  four: `<defs>
  <linearGradient id="mountainGradient4" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop class="mountain-stop mountain-stop-top" offset="0%"/>
    <stop class="mountain-stop mountain-stop-mid" offset="20%"/>
    <stop class="mountain-stop mountain-stop-bottom" offset="100%"/>
  </linearGradient>
</defs>`,
  five: `<defs>
  <linearGradient id="mountainGradient5" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop class="mountain-stop mountain-stop-top" offset="0%"/>
    <stop class="mountain-stop mountain-stop-mid" offset="20%"/>
    <stop class="mountain-stop mountain-stop-bottom" offset="100%"/>
  </linearGradient>
</defs>`
};

const en = {
  lang: "en",
  meta: {
    description: "Gwyneth and Daniel are getting married in Austria on April 24, 2027."
  },
  nav: {
    brand_aria: "Back to home",
    menu: "Menu",
    primary_aria: "Primary",
    language: "Language",
    return: "Return"
  },
  sections: {
    home: "Home",
    story: "Our Story",
    schedule: "Schedule",
    travel: "Travel &amp; Stay",
    more: "More"
  },
  rsvp_text: "RSVP by Sept. 24th 2026",
  mountain_labels: {
    home: "Home",
    story: "Please click on button to read more",
    schedule: "Schedule",
    travel: "Travel &amp; Stay",
    more: "More"
  },
  tabs: {
    aria: "Sections",
    home: "Home",
    story: "Our Story",
    schedule: "Schedule",
    travel: "Travel &amp; Stay",
    more: "More"
  },
  more: {
    aria: "More links",
    faq_desc: "Your questions, answered with care — dip into the FAQs.",
    faq_link: "FAQs",
    photos_desc: "Browse our moments and soak in the photos we love.",
    photos_link: "Photos"
  },
  story_buttons: {
    met: "How We Met",
    proposal: "Our Proposal"
  },
  story_modal: {
    close_aria: "Close story modal"
  },
  mountains: {
    one: { defs: gradientDefs.one, fill: "url(#mountainGradient1)" },
    two: { defs: gradientDefs.two, fill: "url(#mountainGradient2)" },
    three: { defs: gradientDefs.three, fill: "url(#mountainGradient3)" },
    four: { defs: gradientDefs.four, fill: "url(#mountainGradient4)" },
    five: { defs: gradientDefs.five, fill: "url(#mountainGradient5)" }
  },
  page_titles: {
    faqs: "G&amp;D ∞",
    photos: "G&amp;D ∞ Photos"
  },
  faqs: {
    title: "Frequently Asked Questions",
    sections: {
      logistics: "Logistics",
      attire: "Attire &amp; Dress Code",
      schedule: "Schedule &amp; Events",
      guests: "Guests, Plus-Ones &amp; Children",
      food: "Food &amp; Drinks",
      photos: "Photos &amp; Phones",
      gifts: "Gifts &amp; Registry",
      travel: "Travel &amp; Miscellaneous"
    }
  },
  photos: {
    title: "Photo Highlights",
    intro: "A few favorite moments. Tap to view larger.",
    alt_prefix: "Photo"
  },
  gate: {
    styles: gateStyles,
    overlay: gateOverlay,
    open: "<div id=\"site-content\">",
    close: "</div>",
    script: gateScript
  },
  paths: {
    index: "index.html",
    faqs: "faqs.html",
    photos: "photos.html"
  }
};

const de = {
  lang: "de",
  meta: {
    description: "Gwyneth und Daniel heiraten in Österreich am 24. April 2027."
  },
  nav: {
    brand_aria: "Zur Startseite",
    menu: "Menü",
    primary_aria: "Primary",
    language: "Language",
    return: "Zurück"
  },
  sections: {
    home: "Startseite",
    story: "Unsere Geschichte",
    schedule: "Zeitplan",
    travel: "Reise &amp; Aufenthalt",
    more: "More"
  },
  rsvp_text: "RSVP by Sept. 24th 2026",
  mountain_labels: {
    home: "Startseite",
    story: "Unsere Geschichte",
    schedule: "Zeitplan",
    travel: "Reise &amp; Aufenthalt",
    more: "More"
  },
  tabs: {
    aria: "Abschnitte",
    home: "Startseite",
    story: "Unsere Geschichte",
    schedule: "Zeitplan",
    travel: "Reise &amp; Aufenthalt",
    more: "More"
  },
  more: {
    aria: "Weitere Links",
    faq_desc: "Hier findest du Antworten auf eure Fragen – schau in die FAQs.",
    faq_link: "FAQs",
    photos_desc: "Stöbere durch unsere Lieblingsmomente in den Fotos.",
    photos_link: "Photos"
  },
  story_buttons: {
    met: "How We Met",
    proposal: "Our Proposal"
  },
  story_modal: {
    close_aria: "Close story modal"
  },
  mountains: {
    one: { defs: "", fill: "#97cce4" },
    two: { defs: "", fill: "#6ba0b9" },
    three: { defs: "", fill: "#60b3de" },
    four: { defs: "", fill: "#004c75" },
    five: { defs: "", fill: "#003a59" }
  },
  page_titles: {
    faqs: "G&amp;D ∞",
    photos: "G&amp;D ∞ Fotos"
  },
  faqs: {
    title: "Häufig gestellte Fragen",
    sections: {
      logistics: "Logistik",
      attire: "Kleidung &amp; Dresscode",
      schedule: "Zeitplan &amp; Events",
      guests: "Gäste, Plus-Ones &amp; Kinder",
      food: "Essen &amp; Getränke",
      photos: "Fotos &amp; Handys",
      gifts: "Geschenke &amp; Registry",
      travel: "Reise &amp; Sonstiges"
    }
  },
  photos: {
    title: "Foto-Highlights",
    intro: "Ein paar unserer Lieblingsmomente. Tippe zum Vergrößern.",
    alt_prefix: "Foto"
  },
  gate: {
    styles: "",
    overlay: "",
    open: "",
    close: "",
    script: ""
  },
  paths: {
    index: "index.de.html",
    faqs: "faqs.de.html",
    photos: "photos.de.html"
  }
};

module.exports = {
  site,
  en,
  de
};
