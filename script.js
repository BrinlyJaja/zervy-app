document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const overlayMenu = document.getElementById("overlay-menu");
  const menuLinks = gsap.utils.toArray(".menu-links a");
  const logo = document.getElementById("logo-home"); // If you're swapping logo

  let menuOpen = false;

  hamburger.addEventListener("click", () => {
    menuOpen = !menuOpen;
    hamburger.setAttribute("aria-expanded", String(menuOpen));
    hamburger.setAttribute("aria-label", menuOpen ? "Close menu" : "Open menu");

    if (menuOpen) {
      // Animate hamburger to X
      hamburger.classList.add("open");

      // Slide in overlay
      gsap.set(overlayMenu, { display: "block" }); // ensure it's visible before animating
      gsap.to(overlayMenu, {
        y: 0,
        duration: 0.8,
        ease: "power4.out"
      });

      // Animate menu links
      gsap.fromTo(
        menuLinks,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.2
        }
      );
            // Inside your "if (menuOpen)" block in your JS
gsap.fromTo(
  document.querySelector(".social-links"),
  { opacity: 0, y: 20 },
  { opacity: 1, y: 0, delay: 0.4, duration: 0.5, ease: "power2.out" }
);

gsap.to(".social-links", {
  opacity: 0,
  y: 20,
  duration: 0.3,
  ease: "power2.in"
});

      // Optional: Swap logo color if needed
      if (logo) logo.src = "images/logo-white.png";

    } else {
      // Animate hamburger back
      hamburger.classList.remove("open");

      // Animate menu links out
      gsap.to(menuLinks, {
        y: 30,
        opacity: 0,
        duration: 0.3,
        stagger: -0.05,
        ease: "power2.in"
      });

      // Slide out overlay
      gsap.to(overlayMenu, {
        y: "-100%",
        duration: 0.8,
        ease: "power4.in",
        onComplete: () => {
          gsap.set(overlayMenu, { display: "none" });
        }
      });

      // Optional: Swap logo back
      if (logo) logo.src = "images/Logo-black.png";
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".menu-links a");

  links.forEach(link => {
    const text = link.textContent;
    link.innerHTML = ""; // clear original text

    text.split("").forEach(letter => {
      const span = document.createElement("span");
      span.classList.add("char");
      span.textContent = letter === " " ? "\u00A0" : letter;
      link.appendChild(span);
    });
  });
});

const cursor = document.querySelector('.custom-cursor');

document.addEventListener('mousemove', (e) => {
  cursor.style.left = `${e.clientX}px`;
  cursor.style.top = `${e.clientY}px`;
});

gsap.fromTo(
  ".scroll-arrow",
  { y: 0, opacity: 0.6 },
  {
    y: 12,
    opacity: 1,
    duration: 1,
    ease: "power1.inOut",
    repeat: -1,
    yoyo: true
  }
);

gsap.to(".scroll-indicator", {
  opacity: 0,
  scrollTrigger: {
    trigger: ".hero",
    start: "center center",
    end: "bottom top",
    scrub: true
  }
});

// ===== Feature cards modal (with images) =====
(() => {
  const modal = document.getElementById("featureModal");
  const titleEl = document.getElementById("featureModalTitle");
  const subtitleEl = document.getElementById("featureModalSubtitle");
  const detailEl = document.getElementById("featureModalDetail");
  const kickerEl = document.getElementById("featureModalKicker");

  const imgMain = document.getElementById("featureModalImgMain");
  const img1 = document.getElementById("featureModalImg1");
  const img2 = document.getElementById("featureModalImg2");

  let lastFocused = null;

  function setImageSource(image, source, fallback) {
    image.onerror = fallback ? () => {
      image.onerror = null;
      image.src = fallback;
    } : null;
    image.src = source || fallback || "";
  }

  function openModal(card) {
    lastFocused = document.activeElement;

    kickerEl.textContent = card.dataset.kicker || "Feature";
    titleEl.textContent = card.dataset.title || "Feature";
    subtitleEl.textContent = card.dataset.subtitle || "";
    detailEl.textContent = card.dataset.detail || "";

    // Images (mock URLs for now)
    const mainImage = card.dataset.imageSrc || card.dataset.imgMain || "";
    const fallbackImage = card.dataset.imageFallback || "";
    setImageSource(imgMain, mainImage, fallbackImage);
    setImageSource(img1, card.dataset.img1 || mainImage, fallbackImage);
    setImageSource(img2, card.dataset.img2 || mainImage, fallbackImage);

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");

    // focus close button for accessibility
    const closeBtn = modal.querySelector("[data-close]");
    closeBtn && closeBtn.focus();

    // prevent body scroll while modal open
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");

    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";

    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }

  // Click anywhere on a card or its Learn More button opens the modal.
  document.querySelectorAll(".feature-card").forEach((card) => {
    card.addEventListener("click", () => {
      card.focus();
      openModal(card);
    });

    // Keyboard support (Enter / Space)
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(card);
      }
    });

    const learnMore = card.querySelector(".feature-learn-more");
    if (learnMore) {
      learnMore.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        openModal(card);
      });
    }

    const preview = card.querySelector(".feature-img");
    if (preview && card.dataset.imageFallback) {
      preview.addEventListener("error", () => {
        preview.src = card.dataset.imageFallback;
      }, { once: true });
    }
  });

  // Close: click backdrop or close btn
  modal.addEventListener("click", (e) => {
    if (e.target.matches("[data-close]")) closeModal();
  });

  // Close: ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });
})();

// Native horizontal scrolling with page-sized previous/next controls.
(() => {
  const carousel = document.getElementById('featuresCarousel');
  const previous = document.querySelector('[data-carousel-prev]');
  const next = document.querySelector('[data-carousel-next]');
  if (!carousel || !previous || !next) return;

  const scrollCarousel = (direction) => {
    carousel.scrollBy({ left: direction * carousel.clientWidth * 0.82, behavior: 'smooth' });
  };
  previous.addEventListener('click', () => scrollCarousel(-1));
  next.addEventListener('click', () => scrollCarousel(1));
})();

// Audience tabs support pointer and keyboard navigation.
(() => {
  const tabs = [...document.querySelectorAll('.audience-tab')];
  const panels = [...document.querySelectorAll('.audience-content')];
  if (!tabs.length || !panels.length) return;

  function activateTab(tab, focus = false) {
    tabs.forEach((item) => {
      const selected = item === tab;
      item.classList.toggle('is-active', selected);
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    panels.forEach((panel) => { panel.hidden = panel.id !== tab.getAttribute('aria-controls'); });
    if (focus) tab.focus();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', (event) => {
      let nextIndex = index;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') nextIndex = 0;
      else if (event.key === 'End') nextIndex = tabs.length - 1;
      else return;
      event.preventDefault();
      activateTab(tabs[nextIndex], true);
    });
  });
})();

// The static demo has no waitlist API yet, so open an email draft with the address.
(() => {
  const form = document.querySelector('.waitlist-form');
  if (!form) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = form.querySelector('input[type="email"]')?.value.trim();
    if (!email) return;
    const message = form.querySelector('.waitlist-form-message');
    if (message) message.textContent = 'Opening your email app to send your waitlist request.';
    const subject = encodeURIComponent('Zervy waitlist request');
    const body = encodeURIComponent(`Please add ${email} to the Zervy waitlist.`);
    window.location.href = `mailto:support@zervy.com?subject=${subject}&body=${body}`;
  });
})();

